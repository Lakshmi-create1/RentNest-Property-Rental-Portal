const mongoose = require('mongoose');

const rentalInquirySchema = new mongoose.Schema(
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
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    message: {
      type: String,
      required: [true, 'Inquiry message is required'],
      trim: true
    },
    preferredVisitDate: {
      type: Date
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected', 'cancelled'],
      default: 'pending',
      index: true
    }
  },
  {
    timestamps: true
  }
);

// Prevent multiple pending inquiries for the same property by the same tenant
rentalInquirySchema.index(
  { tenant: 1, property: 1, status: 1 }
);

const RentalInquiry = mongoose.model('RentalInquiry', rentalInquirySchema);
module.exports = RentalInquiry;
