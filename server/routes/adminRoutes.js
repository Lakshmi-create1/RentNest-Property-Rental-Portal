const express = require('express');
const router = express.Router();
const {
  getDashboardStats,
  getUsers,
  updateUserStatus,
  getAllProperties,
  updatePropertyApproval,
  deletePropertyAdmin,
  getReports,
  updateReportStatus,
  getAllInquiries,
  getContactMessages,
  updateContactStatus
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');

// All admin routes require authentication and the admin role
router.use(protect);
router.use(authorize('admin'));

router.get('/dashboard', getDashboardStats);
router.get('/users', getUsers);
router.patch('/users/:id/status', updateUserStatus);
router.get('/properties', getAllProperties);
router.patch('/properties/:id/approval', updatePropertyApproval);
router.delete('/properties/:id', deletePropertyAdmin);
router.get('/reports', getReports);
router.patch('/reports/:id', updateReportStatus);
router.get('/inquiries', getAllInquiries);
router.get('/contact-messages', getContactMessages);
router.patch('/contact-messages/:id/status', updateContactStatus);

module.exports = router;
