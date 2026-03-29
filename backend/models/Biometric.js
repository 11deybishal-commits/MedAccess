import mongoose from 'mongoose';

const biometricSchema = new mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    heartRate: {
      type: Number,
      required: true,
    },
    bloodPressure: {
      systolic: Number,
      diastolic: Number,
    },
    oxygenLevel: {
      type: Number,
      required: true,
    },
    steps: {
      type: Number,
    },
    recordedAt: {
      type: Date,
      default: Date.now,
    }
  },
  { timestamps: true }
);

export default mongoose.model('Biometric', biometricSchema);
