import mongoose from 'mongoose';

const pharmacySchema = new mongoose.Schema(
  {
    pharmacyName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    address: {
      type: String,
    },
    city: {
      type: String,
    },
    walletAddress: {
      type: String,
    },
    rating: {
      type: Number,
      default: 4.5,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const Pharmacy = mongoose.model('Pharmacy', pharmacySchema);
export default Pharmacy;
