import mongoose, { Schema, Document } from 'mongoose';

export interface ISubmission extends Document {
  assignmentId: mongoose.Types.ObjectId;
  studentId: mongoose.Types.ObjectId;
  classId: mongoose.Types.ObjectId;
  code: string;
  submittedAt: Date;
  isLate: boolean;
  status: 'pending' | 'grading' | 'graded' | 'failed';
  testResults: {
    testCaseIndex: number;
    passed: boolean;
    pointsEarned: number;
    error?: string;
    executionOutput?: string;
  }[];
  score: number;
  maxScore: number;
  feedback?: string;
  instructorComments?: string;
  gradedAt?: Date;
  gradedBy?: mongoose.Types.ObjectId;
  attemptNumber: number;
  createdAt: Date;
  updatedAt: Date;
}

const SubmissionSchema = new Schema<ISubmission>(
  {
    assignmentId: {
      type: Schema.Types.ObjectId,
      ref: 'Assignment',
      required: true,
      index: true,
    },
    studentId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    classId: {
      type: Schema.Types.ObjectId,
      ref: 'Class',
      required: true,
      index: true,
    },
    code: {
      type: String,
      required: true,
    },
    submittedAt: {
      type: Date,
      default: Date.now,
    },
    isLate: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ['pending', 'grading', 'graded', 'failed'],
      default: 'pending',
    },
    testResults: [{
      testCaseIndex: {
        type: Number,
        required: true,
      },
      passed: {
        type: Boolean,
        required: true,
      },
      pointsEarned: {
        type: Number,
        required: true,
      },
      error: {
        type: String,
      },
      executionOutput: {
        type: String,
      },
    }],
    score: {
      type: Number,
      default: 0,
    },
    maxScore: {
      type: Number,
      required: true,
    },
    feedback: {
      type: String,
    },
    instructorComments: {
      type: String,
    },
    gradedAt: {
      type: Date,
    },
    gradedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    attemptNumber: {
      type: Number,
      default: 1,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for finding user's submissions for an assignment
SubmissionSchema.index({ assignmentId: 1, studentId: 1 });

export const Submission = mongoose.model<ISubmission>('Submission', SubmissionSchema);
