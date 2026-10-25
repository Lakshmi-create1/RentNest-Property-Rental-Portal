const RentalInquiry = require('../models/RentalInquiry');
const Property = require('../models/Property');

// @desc    Submit a rental inquiry or viewing request
// @route   POST /api/inquiries
// @access  Private (Tenant)
exports.createInquiry = async (req, res, next) => {
  try {
    const { propertyId, message, preferredVisitDate } = req.body;

    if (!propertyId || !message) {
      return res.status(400).json({
        success: false,
        message: 'Property ID and message are required'
      });
    }

    const property = await Property.findOne({ _id: propertyId, isDeleted: false });
    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property listing not found'
      });
    }

    // Owner cannot inquire on their own property
    if (property.owner.toString() === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'You cannot submit a rental inquiry for your own property'
      });
    }

    // Check duplicate pending inquiry
    const existingActive = await RentalInquiry.findOne({
      tenant: req.user._id,
      property: propertyId,
      status: 'pending'
    });

    if (existingActive) {
      return res.status(400).json({
        success: false,
        message: 'You already have a pending rental inquiry for this property'
      });
    }

    const inquiry = await RentalInquiry.create({
      tenant: req.user._id,
      property: property._id,
      owner: property.owner,
      message,
      preferredVisitDate: preferredVisitDate ? new Date(preferredVisitDate) : null
    });

    res.status(201).json({
      success: true,
      message: 'Rental inquiry submitted successfully',
      inquiry
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current tenant's submitted inquiries
// @route   GET /api/inquiries/my
// @access  Private (Tenant)
exports.getMyInquiries = async (req, res, next) => {
  try {
    const inquiries = await RentalInquiry.find({ tenant: req.user._id })
      .populate('property', 'title monthlyRent address city images availabilityStatus')
      .populate('owner', 'name email phone')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: inquiries.length,
      inquiries
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get owner's received rental inquiries
// @route   GET /api/inquiries/received
// @access  Private (Owner)
exports.getReceivedInquiries = async (req, res, next) => {
  try {
    const inquiries = await RentalInquiry.find({ owner: req.user._id })
      .populate('property', 'title monthlyRent address city images availabilityStatus')
      .populate('tenant', 'name email phone')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: inquiries.length,
      inquiries
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single inquiry details
// @route   GET /api/inquiries/:id
// @access  Private
exports.getInquiryById = async (req, res, next) => {
  try {
    const inquiry = await RentalInquiry.findById(req.params.id)
      .populate('property')
      .populate('tenant', 'name email phone')
      .populate('owner', 'name email phone');

    if (!inquiry) {
      return res.status(404).json({ success: false, message: 'Inquiry not found' });
    }

    // Authorization: only tenant, owner, or admin
    const userId = req.user._id.toString();
    if (
      inquiry.tenant._id.toString() !== userId &&
      inquiry.owner._id.toString() !== userId &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    res.status(200).json({ success: true, inquiry });
  } catch (error) {
    next(error);
  }
};

// @desc    Owner accept or reject an inquiry
// @route   PATCH /api/inquiries/:id/status
// @access  Private (Owner)
exports.updateInquiryStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    if (!['accepted', 'rejected'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Status must be either accepted or rejected'
      });
    }

    const inquiry = await RentalInquiry.findById(req.params.id);

    if (!inquiry) {
      return res.status(404).json({ success: false, message: 'Inquiry not found' });
    }

    if (inquiry.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized: You are not the owner of this property'
      });
    }

    inquiry.status = status;
    await inquiry.save();

    res.status(200).json({
      success: true,
      message: `Rental inquiry ${status} successfully`,
      inquiry
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Tenant cancel their pending inquiry
// @route   PATCH /api/inquiries/:id/cancel
// @access  Private (Tenant)
exports.cancelInquiry = async (req, res, next) => {
  try {
    const inquiry = await RentalInquiry.findById(req.params.id);

    if (!inquiry) {
      return res.status(404).json({ success: false, message: 'Inquiry not found' });
    }

    if (inquiry.tenant.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized: You did not submit this inquiry'
      });
    }

    if (inquiry.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: `Cannot cancel inquiry because it is already ${inquiry.status}`
      });
    }

    inquiry.status = 'cancelled';
    await inquiry.save();

    res.status(200).json({
      success: true,
      message: 'Rental inquiry cancelled successfully',
      inquiry
    });
  } catch (error) {
    next(error);
  }
};
