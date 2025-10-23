import express from 'express';
import { Session } from '../models/Session';

const router = express.Router();

// Secret admin key check middleware
const adminAuth = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const adminKey = req.headers['x-admin-key'];
  
  if (adminKey !== process.env.ADMIN_SECRET_KEY) {
    return res.status(403).json({ error: 'Unauthorized' });
  }
  
  next();
};

// @route   GET /api/admin/dashboard
// @desc    Get overview of all student activity
// @access  Admin only
router.get('/dashboard', adminAuth, async (req, res) => {
  try {
    const now = new Date();
    const last24h = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const lastWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    // Active sessions in last 24 hours
    const activeSessions = await Session.countDocuments({
      lastActivity: { $gte: last24h }
    });

    // Total sessions this week
    const weekSessions = await Session.countDocuments({
      startTime: { $gte: lastWeek }
    });

    // Total executions
    const totalExecutions = await Session.aggregate([
      { $group: { _id: null, total: { $sum: '$executionCount' } } }
    ]);

    // Most common errors
    const commonErrors = await Session.aggregate([
      { $unwind: '$errorMessages' },
      { $group: { _id: '$errorMessages', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    res.json({
      success: true,
      dashboard: {
        activeStudents24h: activeSessions,
        totalStudentsThisWeek: weekSessions,
        totalExecutions: totalExecutions[0]?.total || 0,
        commonErrors: commonErrors.map(e => ({
          error: e._id,
          count: e.count
        }))
      }
    });
  } catch (error: any) {
    console.error('Dashboard error:', error);
    res.status(500).json({ error: 'Failed to load dashboard' });
  }
});

// @route   GET /api/admin/sessions
// @desc    Get all active sessions
// @access  Admin only
router.get('/sessions', adminAuth, async (req, res) => {
  try {
    const limit = parseInt(req.query.limit as string) || 50;
    const page = parseInt(req.query.page as string) || 1;
    const skip = (page - 1) * limit;

    const sessions = await Session.find()
      .sort({ lastActivity: -1 })
      .limit(limit)
      .skip(skip)
      .select('-__v');

    const total = await Session.countDocuments();

    res.json({
      success: true,
      sessions,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error: any) {
    console.error('Get sessions error:', error);
    res.status(500).json({ error: 'Failed to fetch sessions' });
  }
});

// @route   GET /api/admin/sessions/:sessionId
// @desc    Get detailed session info
// @access  Admin only
router.get('/sessions/:sessionId', adminAuth, async (req, res) => {
  try {
    const session = await Session.findOne({ sessionId: req.params.sessionId });

    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    res.json({
      success: true,
      session
    });
  } catch (error: any) {
    console.error('Get session error:', error);
    res.status(500).json({ error: 'Failed to fetch session' });
  }
});

// @route   DELETE /api/admin/sessions/old
// @desc    Clean up old sessions (older than 30 days)
// @access  Admin only
router.delete('/sessions/old', adminAuth, async (req, res) => {
  try {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    
    const result = await Session.deleteMany({
      lastActivity: { $lt: thirtyDaysAgo }
    });

    res.json({
      success: true,
      message: `Deleted ${result.deletedCount} old sessions`
    });
  } catch (error: any) {
    console.error('Delete old sessions error:', error);
    res.status(500).json({ error: 'Failed to clean up sessions' });
  }
});

export default router;
