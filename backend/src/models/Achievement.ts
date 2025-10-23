import mongoose, { Schema, Document } from 'mongoose';

export interface IAchievement extends Document {
  name: string;
  description: string;
  icon: string;
  category: 'execution' | 'learning' | 'collaboration' | 'mastery';
  points: number;
  requirement: {
    type: 'programs_written' | 'lines_of_code' | 'tutorials_completed' | 'days_streak' | 'errors_fixed' | 'collaborations';
    count: number;
  };
  isSecret: boolean;
  unlockedBy: mongoose.Types.ObjectId[];
  createdAt: Date;
}

const AchievementSchema = new Schema<IAchievement>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
      required: true,
    },
    icon: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: ['execution', 'learning', 'collaboration', 'mastery'],
      required: true,
    },
    points: {
      type: Number,
      default: 10,
    },
    requirement: {
      type: {
        type: String,
        enum: ['programs_written', 'lines_of_code', 'tutorials_completed', 'days_streak', 'errors_fixed', 'collaborations'],
        required: true,
      },
      count: {
        type: Number,
        required: true,
      },
    },
    isSecret: {
      type: Boolean,
      default: false,
    },
    unlockedBy: [{
      type: Schema.Types.ObjectId,
      ref: 'User',
    }],
  },
  {
    timestamps: true,
  }
);

export const Achievement = mongoose.model<IAchievement>('Achievement', AchievementSchema);
