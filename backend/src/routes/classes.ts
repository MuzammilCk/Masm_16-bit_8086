import express from 'express';
import { Class } from '../models/Class';
import { User } from '../models/User';
import { protect, authorize, AuthRequest } from '../middleware/auth';

const router = express.Router();

// @route   POST /api/classes
// @desc    Create a new class
// @access  Private (Instructor only)
router.post('/', protect, authorize('instructor', 'admin'), async (req: AuthRequest, res) => {
  try {
    const { name, description, semester, year, settings } = req.body;
    const instructorId = req.userId;

    if (!name) {
      return res.status(400).json({
        success: false,
        error: 'Class name is required',
      });
    }

    const newClass = await Class.create({
      name,
      description,
      instructor: instructorId,
      semester,
      year,
      settings,
    });

    res.status(201).json({
      success: true,
      message: 'Class created successfully',
      class: newClass,
    });
  } catch (error: any) {
    console.error('Create class error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create class',
    });
  }
});

// @route   GET /api/classes
// @desc    Get all classes for the user
// @access  Private
router.get('/', protect, async (req: AuthRequest, res) => {
  try {
    const userId = req.userId;
    const user = req.user;

    let classes;

    if (user?.role === 'instructor' || user?.role === 'admin') {
      // Instructors see classes they teach
      classes = await Class.find({ instructor: userId })
        .populate('students', 'username firstName lastName email')
        .sort('-createdAt');
    } else {
      // Students see classes they're enrolled in
      classes = await Class.find({ students: userId })
        .populate('instructor', 'username firstName lastName')
        .sort('-createdAt');
    }

    res.json({
      success: true,
      classes,
    });
  } catch (error: any) {
    console.error('Get classes error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch classes',
    });
  }
});

// @route   GET /api/classes/:classId
// @desc    Get class details
// @access  Private
router.get('/:classId', protect, async (req: AuthRequest, res) => {
  try {
    const { classId } = req.params;
    const userId = req.userId;

    const classData = await Class.findById(classId)
      .populate('instructor', 'username firstName lastName email avatar')
      .populate('students', 'username firstName lastName email avatar');

    if (!classData) {
      return res.status(404).json({
        success: false,
        error: 'Class not found',
      });
    }

    // Check if user has access to this class
    const isInstructor = classData.instructor._id.toString() === userId;
    const isStudent = classData.students.some((s: any) => s._id.toString() === userId);

    if (!isInstructor && !isStudent) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to access this class',
      });
    }

    res.json({
      success: true,
      class: classData,
    });
  } catch (error: any) {
    console.error('Get class error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch class details',
    });
  }
});

// @route   POST /api/classes/join
// @desc    Join a class using class code
// @access  Private (Student)
router.post('/join', protect, async (req: AuthRequest, res) => {
  try {
    const { code } = req.body;
    const studentId = req.userId;

    if (!code) {
      return res.status(400).json({
        success: false,
        error: 'Class code is required',
      });
    }

    const classData = await Class.findOne({ code: code.toUpperCase(), isActive: true });

    if (!classData) {
      return res.status(404).json({
        success: false,
        error: 'Invalid class code or class is not active',
      });
    }

    // Check if already enrolled
    if (classData.students.some((s) => s.toString() === studentId)) {
      return res.status(400).json({
        success: false,
        error: 'You are already enrolled in this class',
      });
    }

    // Add student to class
    classData.students.push(studentId as any);
    await classData.save();

    res.json({
      success: true,
      message: `Successfully joined ${classData.name}`,
      class: {
        id: classData._id,
        name: classData.name,
        description: classData.description,
      },
    });
  } catch (error: any) {
    console.error('Join class error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to join class',
    });
  }
});

// @route   DELETE /api/classes/:classId/students/:studentId
// @desc    Remove student from class
// @access  Private (Instructor only)
router.delete('/:classId/students/:studentId', protect, authorize('instructor', 'admin'), async (req: AuthRequest, res) => {
  try {
    const { classId, studentId } = req.params;
    const instructorId = req.userId;

    const classData = await Class.findById(classId);

    if (!classData) {
      return res.status(404).json({
        success: false,
        error: 'Class not found',
      });
    }

    // Check if requester is the instructor
    if (classData.instructor.toString() !== instructorId) {
      return res.status(403).json({
        success: false,
        error: 'Only the class instructor can remove students',
      });
    }

    // Remove student
    classData.students = classData.students.filter((s) => s.toString() !== studentId);
    await classData.save();

    res.json({
      success: true,
      message: 'Student removed from class',
    });
  } catch (error: any) {
    console.error('Remove student error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to remove student',
    });
  }
});

// @route   PUT /api/classes/:classId
// @desc    Update class details
// @access  Private (Instructor only)
router.put('/:classId', protect, authorize('instructor', 'admin'), async (req: AuthRequest, res) => {
  try {
    const { classId } = req.params;
    const instructorId = req.userId;
    const { name, description, semester, year, isActive, settings } = req.body;

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
        error: 'Only the class instructor can update class details',
      });
    }

    // Update fields
    if (name !== undefined) classData.name = name;
    if (description !== undefined) classData.description = description;
    if (semester !== undefined) classData.semester = semester;
    if (year !== undefined) classData.year = year;
    if (isActive !== undefined) classData.isActive = isActive;
    if (settings !== undefined) {
      classData.settings = { ...classData.settings, ...settings };
    }

    await classData.save();

    res.json({
      success: true,
      message: 'Class updated successfully',
      class: classData,
    });
  } catch (error: any) {
    console.error('Update class error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update class',
    });
  }
});

// @route   DELETE /api/classes/:classId
// @desc    Delete a class
// @access  Private (Instructor only)
router.delete('/:classId', protect, authorize('instructor', 'admin'), async (req: AuthRequest, res) => {
  try {
    const { classId } = req.params;
    const instructorId = req.userId;

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
        error: 'Only the class instructor can delete the class',
      });
    }

    await Class.findByIdAndDelete(classId);

    res.json({
      success: true,
      message: 'Class deleted successfully',
    });
  } catch (error: any) {
    console.error('Delete class error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete class',
    });
  }
});

export default router;
