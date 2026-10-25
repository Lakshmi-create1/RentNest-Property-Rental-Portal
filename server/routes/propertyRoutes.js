const express = require('express');
const router = express.Router();
const {
  getProperties,
  getFeaturedProperties,
  getPropertyById,
  createProperty,
  updateProperty,
  deleteProperty,
  updateAvailability,
  getMyProperties
} = require('../controllers/propertyController');
const { protect, authorize, optionalAuth } = require('../middleware/auth');
const { upload } = require('../middleware/upload');

// Public routes
router.get('/', getProperties);
router.get('/featured', getFeaturedProperties);

// Owner-specific listings
router.get('/my', protect, authorize('owner', 'admin'), getMyProperties);

// Single property details (with optional authentication to determine favorite status)
router.get('/:id', optionalAuth, getPropertyById);

// Owner / Admin operations
router.post(
  '/',
  protect,
  authorize('owner', 'admin'),
  upload.array('images', 6),
  createProperty
);

router.put(
  '/:id',
  protect,
  authorize('owner', 'admin'),
  upload.array('images', 6),
  updateProperty
);

router.delete('/:id', protect, authorize('owner', 'admin'), deleteProperty);

router.patch(
  '/:id/availability',
  protect,
  authorize('owner', 'admin'),
  updateAvailability
);

module.exports = router;
