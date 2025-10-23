import mongoose, { Schema, Document } from 'mongoose';

export interface ITutorialStep {
  title: string;
  content: string;
  code?: string;
  expectedOutput?: string;
  hints: string[];
}

export interface ITutorial extends Document {
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  category: string;
  thumbnail?: string;
  estimatedTime: number; // in minutes
  steps: ITutorialStep[];
  prerequisiteTutorials: mongoose.Types.ObjectId[];
  tags: string[];
  isPublished: boolean;
  author: mongoose.Types.ObjectId;
  completionCount: number;
  rating: number;
  createdAt: Date;
  updatedAt: Date;
}

const TutorialStepSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  code: {
    type: String,
  },
  expectedOutput: {
    type: String,
  },
  hints: [{
    type: String,
  }],
});

const TutorialSchema = new Schema<ITutorial>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    difficulty: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced'],
      default: 'beginner',
    },
    category: {
      type: String,
      required: true,
      index: true,
    },
    thumbnail: {
      type: String,
    },
    estimatedTime: {
      type: Number,
      default: 15,
    },
    steps: [TutorialStepSchema],
    prerequisiteTutorials: [{
      type: Schema.Types.ObjectId,
      ref: 'Tutorial',
    }],
    tags: [{
      type: String,
      trim: true,
    }],
    isPublished: {
      type: Boolean,
      default: false,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    completionCount: {
      type: Number,
      default: 0,
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
  },
  {
    timestamps: true,
  }
);

export const Tutorial = mongoose.model<ITutorial>('Tutorial', TutorialSchema);
