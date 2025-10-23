import express from 'express';
import { Project } from '../models/Project';
import { protect, optionalAuth, AuthRequest } from '../middleware/auth';

const router = express.Router();

// @route   POST /api/share/:projectId
// @desc    Generate share link for a project
// @access  Private
router.post('/:projectId', protect, async (req: AuthRequest, res) => {
  try {
    const { projectId } = req.params;
    const userId = req.userId;

    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({
        success: false,
        error: 'Project not found',
      });
    }

    // Check if user owns the project
    if (project.userId.toString() !== userId) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to share this project',
      });
    }

    // Make project public and generate share ID
    project.isPublic = true;
    await project.save(); // Pre-save hook will generate shareId

    res.json({
      success: true,
      message: 'Project is now shareable',
      shareUrl: `${process.env.FRONTEND_URL}/share/${project.shareId}`,
      shareId: project.shareId,
    });
  } catch (error: any) {
    console.error('Share project error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to share project',
    });
  }
});

// @route   GET /api/share/:shareId
// @desc    Get shared project by share ID
// @access  Public
router.get('/:shareId', optionalAuth, async (req: AuthRequest, res) => {
  try {
    const { shareId } = req.params;

    const project = await Project.findOne({ shareId, isPublic: true })
      .populate('userId', 'username firstName lastName avatar')
      .populate('collaborators', 'username avatar');

    if (!project) {
      return res.status(404).json({
        success: false,
        error: 'Shared project not found or no longer public',
      });
    }

    res.json({
      success: true,
      project: {
        id: project._id,
        name: project.name,
        code: project.code,
        description: project.description,
        language: project.language,
        author: project.userId,
        collaborators: project.collaborators,
        createdAt: project.createdAt,
        updatedAt: project.updatedAt,
      },
    });
  } catch (error: any) {
    console.error('Get shared project error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to load shared project',
    });
  }
});

// @route   DELETE /api/share/:projectId
// @desc    Revoke share link (make project private)
// @access  Private
router.delete('/:projectId', protect, async (req: AuthRequest, res) => {
  try {
    const { projectId } = req.params;
    const userId = req.userId;

    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({
        success: false,
        error: 'Project not found',
      });
    }

    if (project.userId.toString() !== userId) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to modify this project',
      });
    }

    // Make project private
    project.isPublic = false;
    // Optionally clear the shareId or keep it for future use
    await project.save();

    res.json({
      success: true,
      message: 'Share link revoked. Project is now private.',
    });
  } catch (error: any) {
    console.error('Revoke share error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to revoke share',
    });
  }
});

// @route   POST /api/share/:shareId/fork
// @desc    Fork a shared project (create a copy)
// @access  Private
router.post('/:shareId/fork', protect, async (req: AuthRequest, res) => {
  try {
    const { shareId } = req.params;
    const userId = req.userId;

    const originalProject = await Project.findOne({ shareId, isPublic: true });

    if (!originalProject) {
      return res.status(404).json({
        success: false,
        error: 'Shared project not found',
      });
    }

    // Create a copy for the user
    const forkedProject = await Project.create({
      name: `${originalProject.name} (Fork)`,
      code: originalProject.code,
      description: `Forked from ${originalProject.name}`,
      userId: userId,
      language: originalProject.language,
      tags: [...originalProject.tags, 'forked'],
      isPublic: false,
    });

    res.status(201).json({
      success: true,
      message: 'Project forked successfully',
      project: {
        id: forkedProject._id,
        name: forkedProject.name,
        code: forkedProject.code,
      },
    });
  } catch (error: any) {
    console.error('Fork project error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fork project',
    });
  }
});

export default router;
