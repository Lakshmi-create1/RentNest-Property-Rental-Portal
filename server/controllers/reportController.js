const PropertyReport = require('../models/PropertyReport');
const Property = require('../models/Property');

// @desc    Submit a moderation report for a suspicious/inappropriate property
// @route   POST /api/reports
// @access  Private
exports.submitReport = async (req, res, next) => {
  try {
    const { propertyId, reason, description } = req.body;

    if (!propertyId || !reason) {
      return res.status(400).json({
        success: false,
        message: 'Property ID and reason are required'
      });
    }

    const property = await Property.findOne({ _id: propertyId, isDeleted: false });
    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property listing not found'
      });
    }

    const report = await PropertyReport.create({
      reporter: req.user._id,
      property: propertyId,
      reason,
      description: description || ''
    });

    res.status(201).json({
      success: true,
      message: 'Property reported successfully for admin review.',
      report
    });
  } catch (error) {
    next(error);
  }
};
