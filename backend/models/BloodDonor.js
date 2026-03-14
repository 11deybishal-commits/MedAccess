import mongoose from 'mongoose';

const bloodDonorSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    bloodGroup: {
      type: String,
      enum: ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'],
      required: true,
    },
    lastDonationDate: {
      type: Date,
      default: null,
    },
    availability: {
      type: Boolean,
      default: true,
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
      trim: true,
    },
    city: {
      type: String,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
    },
    donationCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

// Create geospatial index
bloodDonorSchema.index({ location: '2dsphere' });

export default mongoose.model('BloodDonor', bloodDonorSchema);
