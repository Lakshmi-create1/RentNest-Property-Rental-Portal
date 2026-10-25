const Property = require('../models/Property');
const Favorite = require('../models/Favorite');
const { deleteImageFile } = require('../middleware/upload');

// @desc    Get all properties with filtering, search, sorting & pagination
// @route   GET /api/properties
// @access  Public
exports.getProperties = async (req, res, next) => {
  try {
    const {
      search,
      city,
      propertyType,
      minRent,
      maxRent,
      bedrooms,
      furnishingStatus,
      parkingAvailable,
      sort,
      page = 1,
      limit = 9
    } = req.query;

    const query = {
      isDeleted: false,
      listingStatus: 'approved',
      availabilityStatus: 'available'
    };

    // Keyword search across title, description, city, address
    if (search && search.trim() !== '') {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [
        { title: searchRegex },
        { description: searchRegex },
        { city: searchRegex },
        { address: searchRegex }
      ];
    }

    // City filter
    if (city && city.trim() !== '') {
      query.city = new RegExp(city.trim(), 'i');
    }

    // Property type
    if (propertyType && propertyType !== 'All') {
      query.propertyType = propertyType;
    }

    // Bedrooms (BHK)
    if (bedrooms && bedrooms !== 'All') {
      const bhkNum = parseInt(bedrooms, 10);
      if (!isNaN(bhkNum)) {
        if (bhkNum >= 4) {
          query.bedrooms = { $gte: 4 };
        } else {
          query.bedrooms = bhkNum;
        }
      }
    }

    // Furnishing status
    if (furnishingStatus && furnishingStatus !== 'All') {
      query.furnishingStatus = furnishingStatus;
    }

    // Parking
    if (parkingAvailable === 'true') {
      query.parkingAvailable = true;
    }

    // Rent range
    if (minRent || maxRent) {
      query.monthlyRent = {};
      if (minRent) query.monthlyRent.$gte = Number(minRent);
      if (maxRent) query.monthlyRent.$lte = Number(maxRent);
    }

    // Sorting
    let sortOption = { createdAt: -1 }; // default newest
    if (sort === 'rent_asc') {
      sortOption = { monthlyRent: 1 };
    } else if (sort === 'rent_desc') {
      sortOption = { monthlyRent: -1 };
    } else if (sort === 'newest') {
      sortOption = { createdAt: -1 };
    }

    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.max(1, Math.min(50, parseInt(limit, 10)));
    const skip = (pageNum - 1) * limitNum;

    const total = await Property.countDocuments(query);
    const properties = await Property.find(query)
      .populate('owner', 'name email phone')
      .sort(sortOption)
      .skip(skip)
      .limit(limitNum);

    const totalPages = Math.ceil(total / limitNum) || 1;

    res.status(200).json({
      success: true,
      count: properties.length,
      total,
      page: pageNum,
      totalPages,
      properties
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get featured properties for home page
// @route   GET /api/properties/featured
// @access  Public
exports.getFeaturedProperties = async (req, res, next) => {
  try {
    const featured = await Property.find({
      isDeleted: false,
      listingStatus: 'approved',
      availabilityStatus: 'available'
    })
      .populate('owner', 'name email phone')
      .sort({ createdAt: -1 })
      .limit(6);

    res.status(200).json({
      success: true,
      count: featured.length,
      properties: featured
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single property details
// @route   GET /api/properties/:id
// @access  Public (optionalAuth)
exports.getPropertyById = async (req, res, next) => {
  try {
    const property = await Property.findOne({
      _id: req.params.id,
      isDeleted: false
    }).populate('owner', 'name email phone role createdAt');

    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property listing not found'
      });
    }

    // Check if favorited by current user
    let isFavorite = false;
    if (req.user) {
      const fav = await Favorite.findOne({
        tenant: req.user._id,
        property: property._id
      });
      isFavorite = !!fav;
    }

    res.status(200).json({
      success: true,
      property,
      isFavorite
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new property listing
// @route   POST /api/properties
// @access  Private (Owner, Admin)
exports.createProperty = async (req, res, next) => {
  try {
    const {
      title,
      description,
      propertyType,
      monthlyRent,
      address,
      city,
      state,
      pinCode,
      bedrooms,
      bathrooms,
      furnishingStatus,
      parkingAvailable,
      amenities
    } = req.body;

    // Handle image paths
    let images = [];
    if (req.files && req.files.length > 0) {
      images = req.files.map((file) => `/uploads/${file.filename}`);
    } else if (req.body.imageUrls) {
      // Support manual image URLs
      if (Array.isArray(req.body.imageUrls)) {
        images = req.body.imageUrls;
      } else {
        images = [req.body.imageUrls];
      }
    }

    // Parse amenities
    let parsedAmenities = [];
    if (amenities) {
      if (Array.isArray(amenities)) {
        parsedAmenities = amenities;
      } else {
        try {
          parsedAmenities = JSON.parse(amenities);
        } catch (e) {
          parsedAmenities = amenities.split(',').map((item) => item.trim());
        }
      }
    }

    const property = await Property.create({
      title,
      description,
      propertyType,
      monthlyRent: Number(monthlyRent),
      address,
      city,
      state,
      pinCode,
      bedrooms: Number(bedrooms),
      bathrooms: Number(bathrooms),
      furnishingStatus,
      parkingAvailable: parkingAvailable === 'true' || parkingAvailable === true,
      amenities: parsedAmenities,
      images,
      owner: req.user._id,
      availabilityStatus: 'available',
      listingStatus: 'approved' // auto-approve for semester demonstration
    });

    res.status(201).json({
      success: true,
      message: 'Property listing created successfully',
      property
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update existing property listing
// @route   PUT /api/properties/:id
// @access  Private (Owner, Admin)
exports.updateProperty = async (req, res, next) => {
  try {
    let property = await Property.findOne({
      _id: req.params.id,
      isDeleted: false
    });

    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property listing not found'
      });
    }

    // Owner authorization check: only the owner or an admin can update
    if (
      property.owner.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized: You do not own this property listing'
      });
    }

    const {
      title,
      description,
      propertyType,
      monthlyRent,
      address,
      city,
      state,
      pinCode,
      bedrooms,
      bathrooms,
      furnishingStatus,
      parkingAvailable,
      amenities,
      existingImages,
      removedImages
    } = req.body;

    // Handle existing images and deleted images
    let updatedImages = property.images || [];

    if (removedImages) {
      const toRemove = Array.isArray(removedImages)
        ? removedImages
        : [removedImages];
      toRemove.forEach((img) => {
        deleteImageFile(img);
        updatedImages = updatedImages.filter((item) => item !== img);
      });
    }

    if (existingImages) {
      const keep = Array.isArray(existingImages) ? existingImages : [existingImages];
      updatedImages = updatedImages.filter((img) => keep.includes(img));
    }

    // Add newly uploaded files
    if (req.files && req.files.length > 0) {
      const newImages = req.files.map((file) => `/uploads/${file.filename}`);
      updatedImages = [...updatedImages, ...newImages];
    }

    // Amenities
    let parsedAmenities = property.amenities;
    if (amenities !== undefined) {
      if (Array.isArray(amenities)) {
        parsedAmenities = amenities;
      } else {
        try {
          parsedAmenities = JSON.parse(amenities);
        } catch (e) {
          parsedAmenities = amenities.split(',').map((item) => item.trim());
        }
      }
    }

    property.title = title || property.title;
    property.description = description || property.description;
    property.propertyType = propertyType || property.propertyType;
    if (monthlyRent) property.monthlyRent = Number(monthlyRent);
    property.address = address || property.address;
    property.city = city || property.city;
    property.state = state || property.state;
    property.pinCode = pinCode || property.pinCode;
    if (bedrooms) property.bedrooms = Number(bedrooms);
    if (bathrooms) property.bathrooms = Number(bathrooms);
    property.furnishingStatus = furnishingStatus || property.furnishingStatus;
    if (parkingAvailable !== undefined) {
      property.parkingAvailable =
        parkingAvailable === 'true' || parkingAvailable === true;
    }
    property.amenities = parsedAmenities;
    property.images = updatedImages;

    await property.save();

    res.status(200).json({
      success: true,
      message: 'Property listing updated successfully',
      property
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete property listing (soft delete)
// @route   DELETE /api/properties/:id
// @access  Private (Owner, Admin)
exports.deleteProperty = async (req, res, next) => {
  try {
    const property = await Property.findOne({
      _id: req.params.id,
      isDeleted: false
    });

    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property listing not found'
      });
    }

    if (
      property.owner.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized: You do not own this property listing'
      });
    }

    property.isDeleted = true;
    await property.save();

    res.status(200).json({
      success: true,
      message: 'Property listing deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update property availability (available <-> rented)
// @route   PATCH /api/properties/:id/availability
// @access  Private (Owner, Admin)
exports.updateAvailability = async (req, res, next) => {
  try {
    const { availabilityStatus } = req.body;

    if (!['available', 'rented'].includes(availabilityStatus)) {
      return res.status(400).json({
        success: false,
        message: 'Status must be either "available" or "rented"'
      });
    }

    const property = await Property.findOne({
      _id: req.params.id,
      isDeleted: false
    });

    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property listing not found'
      });
    }

    if (
      property.owner.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized: You do not own this property'
      });
    }

    property.availabilityStatus = availabilityStatus;
    await property.save();

    res.status(200).json({
      success: true,
      message: `Property marked as ${availabilityStatus}`,
      property
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all properties owned by current logged in owner
// @route   GET /api/properties/my
// @access  Private (Owner)
exports.getMyProperties = async (req, res, next) => {
  try {
    const properties = await Property.find({
      owner: req.user._id,
      isDeleted: false
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: properties.length,
      properties
    });
  } catch (error) {
    next(error);
  }
};
