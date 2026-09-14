import mongoose from 'mongoose';

const sessionSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    tokenId: { type: String, required: true },
    ip: { type: String },
    userAgent: { type: String },
    expiresAt: { type: Date, required: true },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model('Session', sessionSchema);