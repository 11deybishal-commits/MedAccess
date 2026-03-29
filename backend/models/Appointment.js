import mongoose from 'mongoose';

const appointmentSchema = new mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    doctorName: {
      type: String,
      required: true,
      default: 'Dr. Julian Sterling',
    },
    department: {
      type: String,
      required: true,
      default: 'General Clinical',
    },
    appointmentDate: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ['Scheduled', 'Completed', 'Cancelled', 'Rescheduled'],
      default: 'Scheduled',
    },
    notes: {
      type: String,
      trim: true,
    },
    type: {
      type: String,
      default: 'Annual Check-up',
    }
  },
  { timestamps: true }
);

export default mongoose.model('Appointment', appointmentSchema);
