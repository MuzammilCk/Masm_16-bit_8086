import mongoose, { Schema, Document } from 'mongoose';

export interface ITestCase {
  input?: string;
  expectedOutput?: string;
  expectedRegisters?: Record<string, string>;
  expectedMemory?: { offset: string; value: string }[];
  points: number;
}

export interface IAssignment extends Document {
  title: string;
  description: string;
  classId: mongoose.Types.ObjectId;
  instructor: mongoose.Types.ObjectId;
  starterCode?: string;
  instructions: string;
  testCases: ITestCase[];
  dueDate: Date;
  totalPoints: number;
  difficulty: 'easy' | 'medium' | 'hard';
  tags: string[];
  isPublished: boolean;
  allowLateSubmissions: boolean;
  latePenaltyPercent: number;
  createdAt: Date;
  updatedAt: Date;
}

const TestCaseSchema = new Schema({
  input: {
    type: String,
  },
  expectedOutput: {
    type: String,
  },
  expectedRegisters: {
    type: Map,
    of: String,
  },
  expectedMemory: [{
    offset: String,
    value: String,
  }],
  points: {
    type: Number,
    required: true,
  },
});

const AssignmentSchema = new Schema<IAssignment>(
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
    classId: {
      type: Schema.Types.ObjectId,
      ref: 'Class',
      required: true,
      index: true,
    },
    instructor: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    starterCode: {
      type: String,
    },
    instructions: {
      type: String,
      required: true,
    },
    testCases: [TestCaseSchema],
    dueDate: {
      type: Date,
      required: true,
    },
    totalPoints: {
      type: Number,
      default: 100,
    },
    difficulty: {
      type: String,
      enum: ['easy', 'medium', 'hard'],
      default: 'medium',
    },
    tags: [{
      type: String,
      trim: true,
    }],
    isPublished: {
      type: Boolean,
      default: false,
    },
    allowLateSubmissions: {
      type: Boolean,
      default: true,
    },
    latePenaltyPercent: {
      type: Number,
      default: 10,
      min: 0,
      max: 100,
    },
  },
  {
    timestamps: true,
  }
);

export const Assignment = mongoose.model<IAssignment>('Assignment', AssignmentSchema);
