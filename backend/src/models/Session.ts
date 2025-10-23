import mongoose, { Schema, Document } from 'mongoose';

// Track anonymous student sessions
export interface ISession extends Document {
  sessionId: string; // Unique browser session
  username?: string; // Student username
  codeExecuted: string;
  executionCount: number;
  errorMessages: string[];
  startTime: Date;
  lastActivity: Date;
  ipAddress?: string;
  userAgent?: string;
}

const SessionSchema = new Schema<ISession>(
  {
    sessionId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    username: {
      type: String,
      index: true,
    },
    codeExecuted: {
      type: String,
      default: '',
    },
    executionCount: {
      type: Number,
      default: 0,
    },
    errorMessages: {
      type: [String],
      default: [],
    },
    startTime: {
      type: Date,
      default: Date.now,
    },
    lastActivity: {
      type: Date,
      default: Date.now,
    },
    ipAddress: {
      type: String,
    },
    userAgent: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// Auto-update lastActivity
SessionSchema.pre('save', function(next) {
  this.lastActivity = new Date();
  next();
});

export const Session = mongoose.model<ISession>('Session', SessionSchema);
