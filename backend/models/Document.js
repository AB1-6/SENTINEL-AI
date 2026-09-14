import mongoose from 'mongoose';

const documentSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    originalName: { type: String, required: true },
    filename: { type: String, required: true },
    mimeType: { type: String, required: true },
    size: { type: Number, required: true },
    path: { type: String, required: true },
    summary: { type: String },
    tags: [{ type: String }],
  },
  { timestamps: true }
);

export default mongoose.model('Document', documentSchema);