import mongoose from 'mongoose';

const resourceReportSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    type: {
      type: String,
      enum: ['oxygen', 'icuBeds', 'blood', 'medicalSupplies', 'camp'],
      required: true,
    },
    location: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point',
      },
      coordinates: [Number], // [longitude, latitude]
    },
    address: {
      type: String,
      required: true,
      trim: true,
    },
    city: {
      type: String,
      required: true,
      trim: true,
    },
    quantity: {
      type: String,
      trim: true,
    },
    contact: {
      type: String,
      required: true,
    },
    notes: {
      type: String,
      trim: true,
    },
    verified: {
      type: Boolean,
      default: false,
    },
    verifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    status: {
      type: String,
      enum: ['pending', 'verified', 'rejected'],
      default: 'pending',
    },
  },
  { timestamps: true }
);

resourceReportSchema.index({ location: '2dsphere' });

export default mongoose.model('ResourceReport', resourceReportSchema);
