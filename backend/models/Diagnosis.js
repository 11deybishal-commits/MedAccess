import mongoose from 'mongoose';

const diagnosisSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    symptoms: {
      type: [String],
      required: true,
    },
    predictions: [
      {
        disease: String,
        probability: Number,
      }
    ],
    primaryPrediction: {
      type: String,
      required: true,
    },
    advice: String,
    precautions: [String],
    medicines: [String],
    disclaimer: {
        type: String,
        default: "This is not a medical diagnosis. Consult a licensed doctor before taking any medication."
    }
  },
  { timestamps: true }
);

export default mongoose.model('Diagnosis', diagnosisSchema);
