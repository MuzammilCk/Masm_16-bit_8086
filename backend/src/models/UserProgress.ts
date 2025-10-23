import mongoose, { Schema, Document } from 'mongoose';

export interface IUserProgress extends Document {
  userId: mongoose.Types.ObjectId;
  tutorialProgress: {
    tutorialId: mongoose.Types.ObjectId;
    currentStep: number;
    completed: boolean;
    completedAt?: Date;
    score?: number;
  }[];
  achievementsUnlocked: {
    achievementId: mongoose.Types.ObjectId;
    unlockedAt: Date;
  }[];
  stats: {
    totalPoints: number;
    currentStreak: number;
    longestStreak: number;
    lastActiveDate: Date;
  };
  createdAt: Date;
  updatedAt: Date;
}

const UserProgressSchema = new Schema<IUserProgress>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
      index: true,
    },
    tutorialProgress: [{
      tutorialId: {
        type: Schema.Types.ObjectId,
        ref: 'Tutorial',
        required: true,
      },
      currentStep: {
        type: Number,
        default: 0,
      },
      completed: {
        type: Boolean,
        default: false,
      },
      completedAt: {
        type: Date,
      },
      score: {
        type: Number,
      },
    }],
    achievementsUnlocked: [{
      achievementId: {
        type: Schema.Types.ObjectId,
        ref: 'Achievement',
        required: true,
      },
      unlockedAt: {
        type: Date,
        default: Date.now,
      },
    }],
    stats: {
      totalPoints: {
        type: Number,
        default: 0,
      },
      currentStreak: {
        type: Number,
        default: 0,
      },
      longestStreak: {
        type: Number,
        default: 0,
      },
      lastActiveDate: {
        type: Date,
        default: Date.now,
      },
    },
  },
  {
    timestamps: true,
  }
);

export const UserProgress = mongoose.model<IUserProgress>('UserProgress', UserProgressSchema);
