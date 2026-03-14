import mongoose from 'mongoose';

const ambulanceSchema = new mongoose.Schema(
  {
    ambulanceNumber: {
      type: String,
      required: true,
      unique: true,
    },
    driverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    driverName: {
      type: String,
      required: true,
    },
    driverPhone: {
      type: String,
      required: true,
    },
    hospital: {
      type: String,
      required: true,
    },
    currentLocation: {
      latitude: Number,
      longitude: Number,
      address: String,
    },
    destination: {
      latitude: Number,
      longitude: Number,
      address: String,
    },
    status: {
      type: String,
      enum: ['available', 'on-duty', 'in-transit', 'arrived', 'busy'],
      default: 'available',
    },
    emergencyNumber: String,
    patientInfo: {
      name: String,
      age: Number,
      condition: String,
      contact: String,
    },
    estimatedTime: Number, // in minutes
    route: [{
      latitude: Number,
      longitude: Number,
      timestamp: Date,
    }],
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model('Ambulance', ambulanceSchema);
