import mongoose from 'mongoose';

const alertSchema = new mongoose.Schema(
  {
    type: { type: String, required: true },
    severity: { type: String, enum: ['low', 'medium', 'high', 'critical'], default: 'low' },
    title: { type: String, required: true },
    message: { type: String, required: true },
    status: { type: String, enum: ['open', 'resolved', 'ignored'], default: 'open' },
    source: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model('Alert', alertSchema);