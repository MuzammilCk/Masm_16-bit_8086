import express from 'express';
import { Assignment } from '../models/Assignment';
import { Submission } from '../models/Submission';
import { Class } from '../models/Class';
import { protect, authorize, AuthRequest } from '../middleware/auth';
import { AutoGrader } from '../services/autoGrader';

const router = express.Router();

// @route   POST /api/assignments
// @desc    Create a new assignment
// @access  Private (Instructor only)
router.post('/', protect, authorize('instructor', 'admin'), async (req: AuthRequest, res) => {
  try {
    const {
      title,
      description,
      classId,
      starterCode,
      instructions,
      testCases,
      dueDate,
      totalPoints,
      difficulty,
      tags,
      allowLateSubmissions,
      latePenaltyPercent,
    } = req.body;
    const instructorId = req.userId;

    // Verify class exists and instructor owns it
    const classData = await Class.findById(classId);
    if (!classData) {
      return res.status(404).json({
        success: false,
        error: 'Class not found',
      });
    }

    if (classData.instructor.toString() !== instructorId) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to create assignments for this class',
      });
    }

    const assignment = await Assignment.create({
      title,
      description,
      classId,
      instructor: instructorId,
      starterCode,
      instructions,
      testCases: testCases || [],
      dueDate,
      totalPoints: totalPoints || 100,
      difficulty: difficulty || 'medium',
      tags: tags || [],
      allowLateSubmissions: allowLateSubmissions !== undefined ? allowLateSubmissions : true,
      latePenaltyPercent: latePenaltyPercent || 10,
    });

    res.status(201).json({
      success: true,
      message: 'Assignment created successfully',
      assignment,
    });
  } catch (error: any) {
    console.error('Create assignment error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create assignment',
    });
  }
});

// @route   GET /api/assignments/class/:classId
// @desc    Get all assignments for a class
// @access  Private
router.get('/class/:classId', protect, async (req: AuthRequest, res) => {
  try {
    const { classId } = req.params;
    const userId = req.userId;

    // Verify user has access to this class
    const classData = await Class.findById(classId);
    if (!classData) {
      return res.status(404).json({
        success: false,
        error: 'Class not found',
      });
    }

    const isInstructor = classData.instructor.toString() === userId;
    const isStudent = classData.students.some((s) => s.toString() === userId);

    if (!isInstructor && !isStudent) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to access this class',
      });
    }

    // Students only see published assignments
    const query: any = { classId };
    if (!isInstructor) {
      query.isPublished = true;
    }

    const assignments = await Assignment.find(query)
      .populate('instructor', 'username firstName lastName')
      .sort('-createdAt');

    res.json({
      success: true,
      assignments,
    });
  } catch (error: any) {
    console.error('Get assignments error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch assignments',
    });
  }
});

// @route   GET /api/assignments/:assignmentId
// @desc    Get assignment details
// @access  Private
router.get('/:assignmentId', protect, async (req: AuthRequest, res) => {
  try {
    const { assignmentId } = req.params;
    const userId = req.userId;

    const assignment = await Assignment.findById(assignmentId)
      .populate('instructor', 'username firstName lastName')
      .populate('classId', 'name code');

    if (!assignment) {
      return res.status(404).json({
        success: false,
        error: 'Assignment not found',
      });
    }

    // Verify access
    const classData = await Class.findById(assignment.classId);
    if (!classData) {
      return res.status(404).json({
        success: false,
        error: 'Class not found',
      });
    }

    const isInstructor = classData.instructor.toString() === userId;
    const isStudent = classData.students.some((s: any) => s.toString() === userId);

    if (!isInstructor && !isStudent) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to access this assignment',
      });
    }

    // Students can't see unpublished assignments
    if (!isInstructor && !assignment.isPublished) {
      return res.status(403).json({
        success: false,
        error: 'Assignment not yet published',
      });
    }

    res.json({
      success: true,
      assignment,
    });
  } catch (error: any) {
    console.error('Get assignment error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch assignment',
    });
  }
});

// @route   POST /api/assignments/:assignmentId/submit
// @desc    Submit assignment solution
// @access  Private (Student)
router.post('/:assignmentId/submit', protect, async (req: AuthRequest, res) => {
  try {
    const { assignmentId } = req.params;
    const { code } = req.body;
    const studentId = req.userId;

    if (!code) {
      return res.status(400).json({
        success: false,
        error: 'Code is required',
      });
    }

    const assignment = await Assignment.findById(assignmentId);
    if (!assignment) {
      return res.status(404).json({
        success: false,
        error: 'Assignment not found',
      });
    }

    // Check if student is in the class
    const classData = await Class.findById(assignment.classId);
    if (!classData) {
      return res.status(404).json({
        success: false,
        error: 'Class not found',
      });
    }

    const isEnrolled = classData.students.some((s) => s.toString() === studentId);
    if (!isEnrolled) {
      return res.status(403).json({
        success: false,
        error: 'Not enrolled in this class',
      });
    }

    // Check if late
    const now = new Date();
    const isLate = now > assignment.dueDate;

    if (isLate && !assignment.allowLateSubmissions) {
      return res.status(403).json({
        success: false,
        error: 'Late submissions are not allowed for this assignment',
      });
    }

    // Count previous attempts
    const previousSubmissions = await Submission.countDocuments({
      assignmentId,
      studentId,
    });

    // Create submission
    const submission = await Submission.create({
      assignmentId,
      studentId,
      classId: assignment.classId,
      code,
      isLate,
      maxScore: assignment.totalPoints,
      attemptNumber: previousSubmissions + 1,
      status: 'grading',
    });

    // Auto-grade if enabled
    if (classData.settings.autoGrading && assignment.testCases.length > 0) {
      try {
        const gradeResult = await AutoGrader.gradeSubmission(code, assignment.testCases);
        
        let finalScore = gradeResult.totalScore;
        
        // Apply late penalty if applicable
        if (isLate && assignment.latePenaltyPercent > 0) {
          finalScore = finalScore * (1 - assignment.latePenaltyPercent / 100);
        }

        submission.testResults = gradeResult.testResults;
        submission.score = Math.round(finalScore);
        submission.status = 'graded';
        submission.gradedAt = new Date();
        await submission.save();

        res.status(201).json({
          success: true,
          message: 'Submission graded automatically',
          submission: {
            id: submission._id,
            score: submission.score,
            maxScore: submission.maxScore,
            testResults: submission.testResults,
            isLate: submission.isLate,
          },
        });
      } catch (gradingError: any) {
        console.error('Auto-grading error:', gradingError);
        submission.status = 'failed';
        submission.feedback = 'Auto-grading failed. Instructor will grade manually.';
        await submission.save();

        res.status(201).json({
          success: true,
          message: 'Submission received. Auto-grading failed, will be graded manually.',
          submission: {
            id: submission._id,
            status: 'pending',
          },
        });
      }
    } else {
      res.status(201).json({
        success: true,
        message: 'Submission received. Awaiting manual grading.',
        submission: {
          id: submission._id,
          status: 'pending',
        },
      });
    }
  } catch (error: any) {
    console.error('Submit assignment error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to submit assignment',
    });
  }
});

// @route   GET /api/assignments/:assignmentId/submissions
// @desc    Get all submissions for an assignment (instructor) or user's submissions (student)
// @access  Private
router.get('/:assignmentId/submissions', protect, async (req: AuthRequest, res) => {
  try {
    const { assignmentId } = req.params;
    const userId = req.userId;
    const user = req.user;

    const assignment = await Assignment.findById(assignmentId);
    if (!assignment) {
      return res.status(404).json({
        success: false,
        error: 'Assignment not found',
      });
    }

    const isInstructor = assignment.instructor.toString() === userId;

    let submissions;

    if (isInstructor) {
      // Instructor sees all submissions
      submissions = await Submission.find({ assignmentId })
        .populate('studentId', 'username firstName lastName email')
        .sort('-submittedAt');
    } else {
      // Student sees only their submissions
      submissions = await Submission.find({ assignmentId, studentId: userId }).sort('-submittedAt');
    }

    res.json({
      success: true,
      submissions,
    });
  } catch (error: any) {
    console.error('Get submissions error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch submissions',
    });
  }
});

export default router;
