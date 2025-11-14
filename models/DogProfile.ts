import mongoose, { Schema, models, model } from 'mongoose';

export interface DogProfileDocument extends mongoose.Document {
  name?: string;
  bio?: string;
  facts?: string[];
  createdAt: Date;
  updatedAt: Date;
}

const DogProfileSchema = new Schema<DogProfileDocument>(
  {
    name: { type: String, trim: true },
    bio: { type: String, trim: true },
    facts: [{ type: String, trim: true }]
  },
  { timestamps: true }
);

export const DogProfile = models.DogProfile || model<DogProfileDocument>('DogProfile', DogProfileSchema);


