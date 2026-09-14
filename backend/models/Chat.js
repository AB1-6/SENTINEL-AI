import mongoose from 'mongoose';

const chatMessageSchema = new mongoose.Schema(
  {
    role: { type: String, enum: ['user', 'assistant', 'system'], required: true },
    content: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
  },
  { _id: false }
);

const chatSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    messages: [chatMessageSchema],
    documentIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Document' }],
    isArchived: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model('Chat', chatSchema);