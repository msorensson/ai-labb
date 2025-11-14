import mongoose, { Schema, models, model } from 'mongoose';

export type ChatRole = 'user' | 'bot';

export interface ChatMessageDocument extends mongoose.Document {
  body: string;
  role: ChatRole;
  createdAt: Date;
  updatedAt: Date;
}

const ChatMessageSchema = new Schema<ChatMessageDocument>(
  {
    body: { type: String, required: true, trim: true },
    role: { type: String, enum: ['user', 'bot'], required: true }
  },
  { timestamps: true }
);

export const ChatMessage =
  models.ChatMessage || model<ChatMessageDocument>('ChatMessage', ChatMessageSchema);


