import mongoose from 'mongoose';
import bcryptjs from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    phone: {
      type: String,
      trim: true,
    },
    city: {
      type: String,
      trim: true,
    },
    role: {
      type: String,
      enum: ['user', 'admin', 'hospital_admin'],
      default: 'user',
    },
    bloodGroup: {
      type: String,
      enum: ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'],
      default: undefined,
      sparse: true,
    },
    isDonor: {
      type: Boolean,
      default: false,
    },
    // ─── Hospital Admin Specific Fields ───────────────────────────────────────
    hospitalName: {
      type: String,
      trim: true,
    },
    hospitalAddress: {
      type: String,
      trim: true,
    },
    hospitalPhone: {
      type: String,
      trim: true,
    },
    hospitalSpecialties: {
      type: [String],
      default: [],
    },
    hospitalLat: {
      type: Number,
    },
    hospitalLng: {
      type: Number,
    },
    hospitalDescription: {
      type: String,
      trim: true,
    },
    registrationNumber: {
      type: String,
      trim: true,
    },
    totalBeds: {
      type: Number,
      default: 0,
    },
    availableBeds: {
      type: Number,
      default: 0,
    },
    rating: {
      type: Number,
      default: 4.5,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    isActiveHospital: {
      type: Boolean,
      default: true,
    },
    // ─────────────────────────────────────────────────────────────────────────
  },
  { timestamps: true }
);

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  try {
    const salt = await bcryptjs.genSalt(10);
    this.password = await bcryptjs.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare passwords
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcryptjs.compare(enteredPassword, this.password);
};

export default mongoose.model('User', userSchema);
