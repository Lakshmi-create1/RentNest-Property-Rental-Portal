const mongoose = require('mongoose');

const favoriteSchema = new mongoose.Schema(
  {
    tenant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    property: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Property',
      required: true,
      index: true
    }
  },
  {
    timestamps: true
  }
);

// Compound index to ensure a tenant cannot favorite the same property twice
favoriteSchema.index({ tenant: 1, property: 1 }, { unique: true });

const Favorite = mongoose.model('Favorite', favoriteSchema);
module.exports = Favorite;
