const express = require('express');
const router = express.Router();
const {
  createInquiry,
  getMyInquiries,
  getReceivedInquiries,
  getInquiryById,
  updateInquiryStatus,
  cancelInquiry
} = require('../controllers/inquiryController');
const { protect, authorize } = require('../middleware/auth');

router.post('/', protect, authorize('tenant'), createInquiry);
router.get('/my', protect, authorize('tenant'), getMyInquiries);
router.get('/received', protect, authorize('owner', 'admin'), getReceivedInquiries);
router.get('/:id', protect, getInquiryById);
router.patch('/:id/status', protect, authorize('owner', 'admin'), updateInquiryStatus);
router.patch('/:id/cancel', protect, authorize('tenant'), cancelInquiry);

module.exports = router;
