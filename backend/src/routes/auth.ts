import express from 'express';
import { User } from '../models/User';
import { generateToken, protect, AuthRequest } from '../middleware/auth';
import { validateGeminiApiKey } from '../utils/apiKeyValidator';

const router = express.Router();

// @route   POST /api/auth/register
// @desc    Register a new student (simple: username + password only)
// @access  Public
router.post('/register', async (req, res) => {
  try {
    const { username, password, geminiApiKey } = req.body;

    // Validate required fields
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        error: 'Please provide username and password',
      });
    }

    if (!geminiApiKey) {
      return res.status(400).json({
        success: false,
        error: 'Please provide your Gemini API key',
      });
    }

    // Validate the Gemini API key
    console.log('[Registration] Validating Gemini API key...');
    const validation = await validateGeminiApiKey(geminiApiKey);
    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        error: validation.error || 'Invalid Gemini API key',
        details: 'Please check your API key at https://aistudio.google.com/app/apikey',
      });
    }
    console.log('[Registration] API key validated successfully');

    // Check if username already exists
    const existingUser = await User.findOne({ username });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: 'Username already taken',
      });
    }

    // Create user with username, password, and API key
    const user = await User.create({
      username,
      password,
      geminiApiKey,
      email: `${username}@student.local`, // Auto-generate email
      role: 'student', // Always student
    });

    // Generate token
    const token = generateToken(String(user._id));

    res.status(201).json({
      success: true,
      message: 'Registration successful',
      token,
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
    });
  } catch (error: any) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Registration failed',
    });
  }
});

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', async (req, res) => {
  try {
    const { username, password, geminiApiKey } = req.body;

    // Validation
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        error: 'Please provide username and password',
      });
    }

    // Find user (include password field)
    const user = await User.findOne({ username }).select('+password +geminiApiKey');

    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'User not found',
      });
    }

    // Check password
    const isPasswordMatch = await user.comparePassword(password);

    if (!isPasswordMatch) {
      return res.status(401).json({
        success: false,
        error: 'Invalid username or password',
      });
    }

    // Update API key if provided
    if (geminiApiKey) {
      // Validate the new API key before storing it
      console.log('[Login] Validating new Gemini API key...');
      const validation = await validateGeminiApiKey(geminiApiKey);
      if (!validation.isValid) {
        return res.status(400).json({
          success: false,
          error: validation.error || 'Invalid Gemini API key',
          details: 'Please check your API key at https://aistudio.google.com/app/apikey',
        });
      }
      console.log('[Login] API key validated successfully');
      user.geminiApiKey = geminiApiKey;
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate token
    const token = generateToken(String(user._id));

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        avatar: user.avatar,
        preferences: user.preferences,
      },
    });
  } catch (error: any) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Login failed',
    });
  }
});

// @route   GET /api/auth/me
// @desc    Get current logged in user
// @access  Private
router.get('/me', protect, async (req: AuthRequest, res) => {
  try {
    const user = req.user;

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
      });
    }

    res.json({
      success: true,
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        avatar: user.avatar,
        bio: user.bio,
        preferences: user.preferences,
        stats: user.stats,
        createdAt: user.createdAt,
        lastLogin: user.lastLogin,
      },
    });
  } catch (error: any) {
    console.error('Get user error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch user data',
    });
  }
});

// @route   PUT /api/auth/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', protect, async (req: AuthRequest, res) => {
  try {
    const userId = req.userId;
    const { firstName, lastName, bio, avatar, preferences } = req.body;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
      });
    }

    // Update allowed fields
    if (firstName !== undefined) user.firstName = firstName;
    if (lastName !== undefined) user.lastName = lastName;
    if (bio !== undefined) user.bio = bio;
    if (avatar !== undefined) user.avatar = avatar;
    if (preferences !== undefined) {
      user.preferences = { ...user.preferences, ...preferences };
    }

    await user.save();

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        bio: user.bio,
        avatar: user.avatar,
        preferences: user.preferences,
      },
    });
  } catch (error: any) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update profile',
    });
  }
});

// @route   PUT /api/auth/password
// @desc    Change password
// @access  Private
router.put('/password', protect, async (req: AuthRequest, res) => {
  try {
    const userId = req.userId;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        error: 'Please provide current and new password',
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        error: 'New password must be at least 6 characters',
      });
    }

    // Get user with password
    const user = await User.findById(userId).select('+password');

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
      });
    }

    // Verify current password
    const isMatch = await user.comparePassword(currentPassword);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: 'Current password is incorrect',
      });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    res.json({
      success: true,
      message: 'Password changed successfully',
    });
  } catch (error: any) {
    console.error('Change password error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to change password',
    });
  }
});

// @route   POST /api/auth/logout
// @desc    Logout user (mainly for clearing cookies if used)
// @access  Private
router.post('/logout', protect, (req, res) => {
  res.json({
    success: true,
    message: 'Logged out successfully',
  });
});

export default router;
