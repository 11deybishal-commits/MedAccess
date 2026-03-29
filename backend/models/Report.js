import mongoose from 'mongoose';

const reportSchema = new mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      enum: ['MRI', 'CT Scan', 'ECG', 'Blood Test', 'General'],
      default: 'General',
    },
    fileUrl: {
      type: String,
      required: true,
    },
    fileName: {
      type: String,
      required: true,
    },
    dateConducted: {
      type: Date,
      default: Date.now,
    },
    aiAnalysis: {
      summary: String,
      findings: [String],
      recommendations: [String],
      confidenceScore: Number,
      analyzedAt: Date,
    },
  },
  { timestamps: true }
);

export default mongoose.model('Report', reportSchema);
