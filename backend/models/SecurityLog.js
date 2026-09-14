import mongoose from 'mongoose';

const securityLogSchema = new mongoose.Schema(
  {
    userId: { type: String, default: 'anonymous' },
    prompt: { type: String, required: true },
    score: { type: Number, required: true },
    label: { type: String, enum: ['SAFE', 'JAILBREAK'], required: true },
    action: { type: String, enum: ['allowed', 'blocked'], required: true },
    reason: { type: String },
    route: { type: String, required: true },
    ip: { type: String },
    severity: { type: String, default: 'low' },
  },
  { timestamps: true }
);

export default mongoose.model('SecurityLog', securityLogSchema);