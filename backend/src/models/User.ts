import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  email: string;
  password: string;
  username: string;
  geminiApiKey?: string;
  role: 'student' | 'instructor' | 'admin';
  firstName?: string;
  lastName?: string;
  avatar?: string;
  bio?: string;
  createdAt: Date;
  updatedAt: Date;
  lastLogin?: Date;
  isEmailVerified: boolean;
  preferences: {
    theme: 'light' | 'dark' | 'auto';
    fontSize: number;
    editorTheme: string;
  };
  stats: {
    programsWritten: number;
    linesOfCode: number;
    totalExecutions: number;
    achievementsEarned: string[];
  };
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const UserSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      select: false, // Don't return password by default
    },
    username: {
      type: String,
      required: [true, 'Username is required'],
      unique: true,
      trim: true,
      minlength: [3, 'Username must be at least 3 characters'],
      maxlength: [30, 'Username cannot exceed 30 characters'],
      match: [/^[a-zA-Z0-9_-]+$/, 'Username can only contain letters, numbers, hyphens, and underscores'],
    },
    geminiApiKey: {
      type: String,
      select: false, // Don't return API key by default
    },
    role: {
      type: String,
      enum: ['student', 'instructor', 'admin'],
      default: 'student',
    },
    firstName: {
      type: String,
      trim: true,
    },
    lastName: {
      type: String,
      trim: true,
    },
    avatar: {
      type: String,
      default: null,
    },
    bio: {
      type: String,
      maxlength: [500, 'Bio cannot exceed 500 characters'],
    },
    lastLogin: {
      type: Date,
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    preferences: {
      theme: {
        type: String,
        enum: ['light', 'dark', 'auto'],
        default: 'dark',
      },
      fontSize: {
        type: Number,
        default: 14,
        min: 10,
        max: 24,
      },
      editorTheme: {
        type: String,
        default: 'vs-dark',
      },
    },
    stats: {
      programsWritten: {
        type: Number,
        default: 0,
      },
      linesOfCode: {
        type: Number,
        default: 0,
      },
      totalExecutions: {
        type: Number,
        default: 0,
      },
      achievementsEarned: [{
        type: String,
      }],
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error: any) {
    next(error);
  }
});

// Method to compare password
UserSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    return false;
  }
};

// Remove sensitive data when converting to JSON
UserSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

export const User = mongoose.model<IUser>('User', UserSchema);
