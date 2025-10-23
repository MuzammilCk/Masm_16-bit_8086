import mongoose, { Schema, Document } from 'mongoose';

export interface IClass extends Document {
  name: string;
  description: string;
  code: string; // Unique join code for students
  instructor: mongoose.Types.ObjectId;
  students: mongoose.Types.ObjectId[];
  semester: string;
  year: number;
  isActive: boolean;
  settings: {
    allowLateSubmissions: boolean;
    autoGrading: boolean;
    showLeaderboard: boolean;
  };
  createdAt: Date;
  updatedAt: Date;
}

const ClassSchema = new Schema<IClass>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
    },
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      index: true,
    },
    instructor: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    students: [{
      type: Schema.Types.ObjectId,
      ref: 'User',
    }],
    semester: {
      type: String,
      enum: ['Fall', 'Spring', 'Summer', 'Winter'],
    },
    year: {
      type: Number,
      default: () => new Date().getFullYear(),
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    settings: {
      allowLateSubmissions: {
        type: Boolean,
        default: true,
      },
      autoGrading: {
        type: Boolean,
        default: true,
      },
      showLeaderboard: {
        type: Boolean,
        default: false,
      },
    },
  },
  {
    timestamps: true,
  }
);

// Generate unique class code before saving
ClassSchema.pre('save', function (next) {
  if (!this.code || this.isNew) {
    this.code = generateClassCode();
  }
  next();
});

function generateClassCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Exclude confusing chars
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

export const Class = mongoose.model<IClass>('Class', ClassSchema);
