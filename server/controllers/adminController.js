const User = require('../models/User');
const Property = require('../models/Property');
const RentalInquiry = require('../models/RentalInquiry');
const PropertyReport = require('../models/PropertyReport');
const ContactMessage = require('../models/ContactMessage');

// @desc    Get system-wide metrics and stats for admin dashboard
// @route   GET /api/admin/dashboard
// @access  Private (Admin)
exports.getDashboardStats = async (req, res, next) => {
  try {
    const [
      totalUsers,
      totalTenants,
      totalOwners,
      totalProperties,
      approvedProperties,
      pendingProperties,
      rentedProperties,
      totalInquiries,
      pendingInquiries,
      acceptedInquiries,
      totalReports,
      pendingReports,
      totalMessages,
      recentProperties,
      recentInquiries,
      recentUsers
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ role: 'tenant' }),
      User.countDocuments({ role: 'owner' }),
      Property.countDocuments({ isDeleted: false }),
      Property.countDocuments({ isDeleted: false, listingStatus: 'approved' }),
      Property.countDocuments({ isDeleted: false, listingStatus: 'pending' }),
      Property.countDocuments({ isDeleted: false, availabilityStatus: 'rented' }),
      RentalInquiry.countDocuments(),
      RentalInquiry.countDocuments({ status: 'pending' }),
      RentalInquiry.countDocuments({ status: 'accepted' }),
      PropertyReport.countDocuments(),
      PropertyReport.countDocuments({ status: 'pending' }),
      ContactMessage.countDocuments(),
      Property.find({ isDeleted: false })
        .populate('owner', 'name email')
        .sort({ createdAt: -1 })
        .limit(5),
      RentalInquiry.find()
        .populate('tenant', 'name email')
        .populate('property', 'title monthlyRent')
        .sort({ createdAt: -1 })
        .limit(5),
      User.find()
        .select('-password')
        .sort({ createdAt: -1 })
        .limit(5)
    ]);

    res.status(200).json({
      success: true,
      stats: {
        users: {
          total: totalUsers,
          tenants: totalTenants,
          owners: totalOwners
        },
        properties: {
          total: totalProperties,
          approved: approvedProperties,
          pending: pendingProperties,
          rented: rentedProperties
        },
        inquiries: {
          total: totalInquiries,
          pending: pendingInquiries,
          accepted: acceptedInquiries
        },
        reports: {
          total: totalReports,
          pending: pendingReports
        },
        messages: {
          total: totalMessages
        }
      },
      recent: {
        properties: recentProperties,
        inquiries: recentInquiries,
        users: recentUsers
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all users with search and role filter
// @route   GET /api/admin/users
// @access  Private (Admin)
exports.getUsers = async (req, res, next) => {
  try {
    const { search, role, page = 1, limit = 15 } = req.query;
    const query = {};

    if (search && search.trim() !== '') {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [{ name: searchRegex }, { email: searchRegex }, { phone: searchRegex }];
    }

    if (role && role !== 'All') {
      query.role = role;
    }

    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.max(1, parseInt(limit, 10));
    const skip = (pageNum - 1) * limitNum;

    const total = await User.countDocuments(query);
    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    res.status(200).json({
      success: true,
      count: users.length,
      total,
      page: pageNum,
      totalPages: Math.ceil(total / limitNum) || 1,
      users
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Activate or deactivate user account
// @route   PATCH /api/admin/users/:id/status
// @access  Private (Admin)
exports.updateUserStatus = async (req, res, next) => {
  try {
    const { isActive } = req.body;
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Prevent deactivating own admin account
    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'You cannot deactivate your own administrative account'
      });
    }

    user.isActive = isActive;
    await user.save();

    res.status(200).json({
      success: true,
      message: `User account has been ${user.isActive ? 'activated' : 'deactivated'} successfully`,
      user
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all property listings for admin moderation
// @route   GET /api/admin/properties
// @access  Private (Admin)
exports.getAllProperties = async (req, res, next) => {
  try {
    const { search, listingStatus, propertyType, page = 1, limit = 15 } = req.query;
    const query = { isDeleted: false };

    if (search && search.trim() !== '') {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [{ title: searchRegex }, { city: searchRegex }, { address: searchRegex }];
    }

    if (listingStatus && listingStatus !== 'All') {
      query.listingStatus = listingStatus;
    }

    if (propertyType && propertyType !== 'All') {
      query.propertyType = propertyType;
    }

    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.max(1, parseInt(limit, 10));
    const skip = (pageNum - 1) * limitNum;

    const total = await Property.countDocuments(query);
    const properties = await Property.find(query)
      .populate('owner', 'name email phone')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    res.status(200).json({
      success: true,
      count: properties.length,
      total,
      page: pageNum,
      totalPages: Math.ceil(total / limitNum) || 1,
      properties
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Approve or reject property listing
// @route   PATCH /api/admin/properties/:id/approval
// @access  Private (Admin)
exports.updatePropertyApproval = async (req, res, next) => {
  try {
    const { listingStatus } = req.body;

    if (!['approved', 'rejected', 'pending'].includes(listingStatus)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid listing status'
      });
    }

    const property = await Property.findOne({ _id: req.params.id, isDeleted: false });

    if (!property) {
      return res.status(404).json({ success: false, message: 'Property not found' });
    }

    property.listingStatus = listingStatus;
    await property.save();

    res.status(200).json({
      success: true,
      message: `Property listing status set to ${listingStatus}`,
      property
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete property as admin
// @route   DELETE /api/admin/properties/:id
// @access  Private (Admin)
exports.deletePropertyAdmin = async (req, res, next) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({ success: false, message: 'Property not found' });
    }

    property.isDeleted = true;
    await property.save();

    res.status(200).json({
      success: true,
      message: 'Property listing removed by administrator'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all moderation reports
// @route   GET /api/admin/reports
// @access  Private (Admin)
exports.getReports = async (req, res, next) => {
  try {
    const reports = await PropertyReport.find()
      .populate('reporter', 'name email phone')
      .populate({
        path: 'property',
        select: 'title monthlyRent city images owner isDeleted',
        populate: { path: 'owner', select: 'name email phone' }
      })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: reports.length,
      reports
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update report status (pending -> reviewed / resolved)
// @route   PATCH /api/admin/reports/:id
// @access  Private (Admin)
exports.updateReportStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    if (!['pending', 'reviewed', 'resolved'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid report status' });
    }

    const report = await PropertyReport.findById(req.params.id);

    if (!report) {
      return res.status(404).json({ success: false, message: 'Report not found' });
    }

    report.status = status;
    await report.save();

    res.status(200).json({
      success: true,
      message: `Report status updated to ${status}`,
      report
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all inquiries for admin review
// @route   GET /api/admin/inquiries
// @access  Private (Admin)
exports.getAllInquiries = async (req, res, next) => {
  try {
    const inquiries = await RentalInquiry.find()
      .populate('tenant', 'name email phone')
      .populate('owner', 'name email phone')
      .populate('property', 'title city monthlyRent')
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

// @desc    Get all contact messages
// @route   GET /api/admin/contact-messages
// @access  Private (Admin)
exports.getContactMessages = async (req, res, next) => {
  try {
    const messages = await ContactMessage.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: messages.length,
      messages
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update contact message status
// @route   PATCH /api/admin/contact-messages/:id/status
// @access  Private (Admin)
exports.updateContactStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    if (!['unread', 'read', 'resolved'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }

    const message = await ContactMessage.findById(req.params.id);
    if (!message) {
      return res.status(404).json({ success: false, message: 'Message not found' });
    }

    message.status = status;
    await message.save();

    res.status(200).json({
      success: true,
      message: `Message status updated to ${status}`,
      messageItem: message
    });
  } catch (error) {
    next(error);
  }
};
