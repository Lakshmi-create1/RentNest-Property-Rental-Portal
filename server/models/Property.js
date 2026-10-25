const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Property title is required'],
      trim: true,
      maxlength: [120, 'Title cannot exceed 120 characters']
    },
    description: {
      type: String,
      required: [true, 'Property description is required'],
      trim: true
    },
    propertyType: {
      type: String,
      required: [true, 'Property type is required'],
      enum: ['Apartment', 'Independent House', 'Villa', 'PG/Hostel']
    },
    monthlyRent: {
      type: Number,
      required: [true, 'Monthly rent is required'],
      min: [1, 'Monthly rent must be greater than zero']
    },
    address: {
      type: String,
      required: [true, 'Address is required'],
      trim: true
    },
    city: {
      type: String,
      required: [true, 'City is required'],
      trim: true,
      index: true
    },
    state: {
      type: String,
      required: [true, 'State is required'],
      trim: true
    },
    pinCode: {
      type: String,
      required: [true, 'PIN code is required'],
      trim: true
    },
    bedrooms: {
      type: Number,
      required: [true, 'Number of bedrooms (BHK) is required'],
      min: [1, 'Minimum 1 bedroom required']
    },
    bathrooms: {
      type: Number,
      required: [true, 'Number of bathrooms is required'],
      min: [1, 'Minimum 1 bathroom required']
    },
    furnishingStatus: {
      type: String,
      required: [true, 'Furnishing status is required'],
      enum: ['Furnished', 'Semi-Furnished', 'Unfurnished']
    },
    parkingAvailable: {
      type: Boolean,
      default: false
    },
    amenities: {
      type: [String],
      default: []
    },
    images: {
      type: [String],
      default: []
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    availabilityStatus: {
      type: String,
      enum: ['available', 'rented'],
      default: 'available',
      index: true
    },
    listingStatus: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'approved',
      index: true
    },
    isDeleted: {
      type: Boolean,
      default: false,
      index: true
    }
  },
  {
    timestamps: true
  }
);

// Compound indexes for high performance search and filter
propertySchema.index({ city: 1, listingStatus: 1, availabilityStatus: 1, isDeleted: 1 });
propertySchema.index({ monthlyRent: 1, propertyType: 1, bedrooms: 1 });
propertySchema.index({ title: 'text', description: 'text', address: 'text', city: 'text' });

const Property = mongoose.model('Property', propertySchema);
module.exports = Property;
