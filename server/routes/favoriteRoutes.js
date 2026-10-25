const express = require('express');
const router = express.Router();
const {
  getFavorites,
  addFavorite,
  removeFavorite
} = require('../controllers/favoriteController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);
router.use(authorize('tenant'));

router.get('/', getFavorites);
router.post('/:propertyId', addFavorite);
router.delete('/:propertyId', removeFavorite);

module.exports = router;
