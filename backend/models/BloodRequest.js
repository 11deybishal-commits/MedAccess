import mongoose from 'mongoose';

const bloodRequestSchema = new mongoose.Schema(
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
    hospital: {
      type: String,
      required: true,
      trim: true,
    },
    city: {
      type: String,
      required: true,
      trim: true,
    },
    urgency: {
      type: String,
      enum: ['low', 'medium', 'high', 'critical'],
      default: 'medium',
    },
    contact: {
      type: String,
      required: true,
    },
    unitsNeeded: {
      type: Number,
      default: 1,
    },
    status: {
      type: String,
      enum: ['pending', 'fulfilled', 'expired'],
      default: 'pending',
    },
    location: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point',
      },
      coordinates: [Number], // [longitude, latitude]
    },
    notes: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

bloodRequestSchema.index({ location: '2dsphere' });

export default mongoose.model('BloodRequest', bloodRequestSchema);
