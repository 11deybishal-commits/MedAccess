import mongoose from 'mongoose';

const medicineSchema = new mongoose.Schema(
  {
    pharmacyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Pharmacy',
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    dosage: {
      type: String,
    },
    description: {
      type: String,
    },
    quantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: true,
    },
    manufacturer: {
      type: String,
    },
    expiryDate: {
      type: Date,
    },
    batchNumber: {
      type: String,
    },
  },
  { timestamps: true }
);

const Medicine = mongoose.model('Medicine', medicineSchema);
export default Medicine;
