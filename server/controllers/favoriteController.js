const Favorite = require('../models/Favorite');
const Property = require('../models/Property');

// @desc    Get current tenant's saved favorites
// @route   GET /api/favorites
// @access  Private (Tenant)
exports.getFavorites = async (req, res, next) => {
  try {
    const favorites = await Favorite.find({ tenant: req.user._id })
      .populate({
        path: 'property',
        match: { isDeleted: false },
        populate: { path: 'owner', select: 'name email phone' }
      })
      .sort({ createdAt: -1 });

    // Filter out any properties that might have been deleted
    const validFavorites = favorites.filter((fav) => fav.property !== null);

    res.status(200).json({
      success: true,
      count: validFavorites.length,
      favorites: validFavorites
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add property to favorites
// @route   POST /api/favorites/:propertyId
// @access  Private (Tenant)
exports.addFavorite = async (req, res, next) => {
  try {
    const { propertyId } = req.params;

    const property = await Property.findOne({ _id: propertyId, isDeleted: false });
    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found'
      });
    }

    const existing = await Favorite.findOne({
      tenant: req.user._id,
      property: propertyId
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'This property is already in your favorites'
      });
    }

    const favorite = await Favorite.create({
      tenant: req.user._id,
      property: propertyId
    });

    res.status(201).json({
      success: true,
      message: 'Property added to favorites',
      favorite
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Remove property from favorites
// @route   DELETE /api/favorites/:propertyId
// @access  Private (Tenant)
exports.removeFavorite = async (req, res, next) => {
  try {
    const { propertyId } = req.params;

    const favorite = await Favorite.findOneAndDelete({
      tenant: req.user._id,
      property: propertyId
    });

    if (!favorite) {
      return res.status(404).json({
        success: false,
        message: 'Property was not found in your favorites'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Property removed from favorites'
    });
  } catch (error) {
    next(error);
  }
};
