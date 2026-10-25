const mongoose = require('mongoose');

const propertyReportSchema = new mongoose.Schema(
  {
    reporter: {
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
    reason: {
      type: String,
      required: [true, 'Please specify a reason for reporting'],
      trim: true
    },
    description: {
      type: String,
      trim: true,
      default: ''
    },
    status: {
      type: String,
      enum: ['pending', 'reviewed', 'resolved'],
      default: 'pending',
      index: true
    }
  },
  {
    timestamps: true
  }
);

const PropertyReport = mongoose.model('PropertyReport', propertyReportSchema);
module.exports = PropertyReport;
