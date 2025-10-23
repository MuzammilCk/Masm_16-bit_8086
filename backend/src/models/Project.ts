import mongoose, { Schema, Document } from 'mongoose';

export interface IProject extends Document {
  name: string;
  code: string;
  description?: string;
  userId: mongoose.Types.ObjectId;
  shareId?: string;
  isPublic: boolean;
  isFavorite: boolean;
  tags: string[];
  language: 'MASM' | 'NASM' | 'TASM';
  lastRun?: Date;
  executionCount: number;
  collaborators: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const ProjectSchema = new Schema<IProject>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: [100, 'Project name cannot exceed 100 characters'],
    },
    code: {
      type: String,
      required: true,
      default: '',
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters'],
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    shareId: {
      type: String,
      unique: true,
      sparse: true, // Allows null values but enforces uniqueness for non-null
      index: true,
    },
    isPublic: {
      type: Boolean,
      default: false,
    },
    isFavorite: {
      type: Boolean,
      default: false,
    },
    tags: [{
      type: String,
      trim: true,
    }],
    language: {
      type: String,
      enum: ['MASM', 'NASM', 'TASM'],
      default: 'MASM',
    },
    lastRun: {
      type: Date,
    },
    executionCount: {
      type: Number,
      default: 0,
    },
    collaborators: [{
      type: Schema.Types.ObjectId,
      ref: 'User',
    }],
  },
  {
    timestamps: true,
  }
);

// Generate share ID when making project public
ProjectSchema.pre('save', function (next) {
  if (this.isPublic && !this.shareId) {
    // Generate unique share ID
    this.shareId = generateShareId();
  }
  next();
});

// Helper function to generate share ID
function generateShareId(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export const Project = mongoose.model<IProject>('Project', ProjectSchema);
