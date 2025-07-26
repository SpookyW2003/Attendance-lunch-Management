const express = require('express');
const { body, validationResult, query } = require('express-validator');
const Attendance = require('../models/Attendance');
const { auth, employeeOrAdmin } = require('../middleware/auth');
const { isWeekend, isAfterCutoff } = require('../utils/dateUtils');

const router = express.Router();

// Mark attendance for today or future date
router.post('/mark', [
  body('status').isIn(['office', 'home', 'leave']).withMessage('Invalid status'),
  body('date').optional().isISO8601().withMessage('Invalid date format'),
  body('notes').optional().trim().isLength({ max: 500 }).withMessage('Notes too long')
], auth, employeeOrAdmin, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        error: 'Validation failed', 
        details: errors.array() 
      });
    }

    const { status, notes } = req.body;
    let { date } = req.body;

    // If no date provided, use today
    if (!date) {
      date = new Date();
    } else {
      date = new Date(date);
    }

    // Set time to start of day for consistency
    date.setHours(0, 0, 0, 0);

    // Check if it's weekend
    if (isWeekend(date)) {
      return res.status(400).json({ 
        error: 'Cannot mark attendance for weekends (Saturday & Sunday)' 
      });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Determine if this is for today or future planning
    const isToday = date.getTime() === today.getTime();
    const isFuture = date > today;
    const isPast = date < today;

    // Handle past dates - only admin can mark for past dates
    if (isPast && req.user.role !== 'admin') {
      return res.status(400).json({ 
        error: 'Cannot mark attendance for past dates. Contact admin if needed.' 
      });
    }

    // For today's attendance, check cutoff time
    let willBeConsideredForTomorrow = false;
    if (isToday && isAfterCutoff()) {
      // After 9:30 AM, consider it for tomorrow
      date.setDate(date.getDate() + 1);
      willBeConsideredForTomorrow = true;
      
      // Check if tomorrow is weekend
      if (isWeekend(date)) {
        return res.status(400).json({ 
          error: 'Cannot mark attendance after 9:30 AM as tomorrow is weekend' 
        });
      }
    }

    // Check if attendance already exists for this date
    const existingAttendance = await Attendance.findOne({
      userId: req.user._id,
      date: date
    });

    if (existingAttendance) {
      // Update existing attendance
      const previousStatus = existingAttendance.status;
      existingAttendance.status = status;
      existingAttendance.notes = notes;
      existingAttendance.markedAt = new Date();
      
      // Add to modification history
      existingAttendance.modificationHistory.push({
        previousStatus,
        newStatus: status,
        modifiedBy: req.user._id,
        reason: 'User update'
      });

      await existingAttendance.save();

      return res.json({
        message: willBeConsideredForTomorrow 
          ? 'Attendance updated for tomorrow (after 9:30 AM cutoff)'
          : 'Attendance updated successfully',
        attendance: existingAttendance,
        forTomorrow: willBeConsideredForTomorrow
      });
    }

    // Create new attendance record
    const attendance = new Attendance({
      userId: req.user._id,
      date,
      status,
      notes,
      isPlanned: isFuture || willBeConsideredForTomorrow,
      planDate: isFuture || willBeConsideredForTomorrow ? new Date() : null
    });

    await attendance.save();

    res.status(201).json({
      message: willBeConsideredForTomorrow 
        ? 'Attendance marked for tomorrow (after 9:30 AM cutoff)'
        : isFuture 
          ? 'Attendance planned successfully'
          : 'Attendance marked successfully',
      attendance,
      forTomorrow: willBeConsideredForTomorrow
    });

  } catch (error) {
    console.error('Mark attendance error:', error);
    res.status(500).json({ error: 'Server error marking attendance' });
  }
});

// Get user's attendance for a specific date
router.get('/date/:date', auth, employeeOrAdmin, async (req, res) => {
  try {
    const date = new Date(req.params.date);
    date.setHours(0, 0, 0, 0);

    const attendance = await Attendance.findOne({
      userId: req.user._id,
      date: date
    }).populate('userId', 'name email employeeId');

    if (!attendance) {
      return res.status(404).json({ error: 'No attendance record found for this date' });
    }

    res.json({ attendance });
  } catch (error) {
    console.error('Get attendance by date error:', error);
    res.status(500).json({ error: 'Server error fetching attendance' });
  }
});

// Get user's attendance history
router.get('/history', [
  query('startDate').optional().isISO8601().withMessage('Invalid start date'),
  query('endDate').optional().isISO8601().withMessage('Invalid end date'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be at least 1')
], auth, employeeOrAdmin, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        error: 'Validation failed', 
        details: errors.array() 
      });
    }

    const { startDate, endDate, limit = 30, page = 1 } = req.query;
    const skip = (page - 1) * limit;

    // Default to last 30 days if no date range provided
    const defaultEndDate = new Date();
    const defaultStartDate = new Date();
    defaultStartDate.setDate(defaultStartDate.getDate() - 30);

    const query = {
      userId: req.user._id,
      date: {
        $gte: startDate ? new Date(startDate) : defaultStartDate,
        $lte: endDate ? new Date(endDate) : defaultEndDate
      }
    };

    const [attendance, total] = await Promise.all([
      Attendance.find(query)
        .populate('userId', 'name email employeeId')
        .sort({ date: -1 })
        .limit(parseInt(limit))
        .skip(skip),
      Attendance.countDocuments(query)
    ]);

    res.json({
      attendance,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / limit),
        total,
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Get attendance history error:', error);
    res.status(500).json({ error: 'Server error fetching attendance history' });
  }
});

// Get today's attendance status
router.get('/today', auth, employeeOrAdmin, async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const attendance = await Attendance.findOne({
      userId: req.user._id,
      date: today
    }).populate('userId', 'name email employeeId');

    const canMarkToday = !isWeekend(today) && !isAfterCutoff();
    const nextAvailableDate = canMarkToday ? today : (() => {
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      // Skip weekends
      while (isWeekend(tomorrow)) {
        tomorrow.setDate(tomorrow.getDate() + 1);
      }
      return tomorrow;
    })();

    res.json({
      attendance,
      canMarkToday,
      nextAvailableDate,
      isAfterCutoff: isAfterCutoff(),
      message: isAfterCutoff() 
        ? 'After 9:30 AM cutoff - attendance will be marked for next working day'
        : 'Can mark attendance for today'
    });
  } catch (error) {
    console.error('Get today attendance error:', error);
    res.status(500).json({ error: 'Server error fetching today\'s attendance' });
  }
});

// Get attendance statistics for user
router.get('/stats', [
  query('month').optional().isInt({ min: 1, max: 12 }).withMessage('Invalid month'),
  query('year').optional().isInt({ min: 2020, max: 2030 }).withMessage('Invalid year')
], auth, employeeOrAdmin, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        error: 'Validation failed', 
        details: errors.array() 
      });
    }

    const { month, year } = req.query;
    const currentDate = new Date();
    const targetMonth = month ? parseInt(month) - 1 : currentDate.getMonth();
    const targetYear = year ? parseInt(year) : currentDate.getFullYear();

    // Get start and end of month
    const startDate = new Date(targetYear, targetMonth, 1);
    const endDate = new Date(targetYear, targetMonth + 1, 0);

    const attendance = await Attendance.find({
      userId: req.user._id,
      date: {
        $gte: startDate,
        $lte: endDate
      }
    });

    // Calculate statistics
    const stats = {
      totalDays: attendance.length,
      office: attendance.filter(a => a.status === 'office').length,
      home: attendance.filter(a => a.status === 'home').length,
      leave: attendance.filter(a => a.status === 'leave').length,
      lateMarkings: attendance.filter(a => a.isLateMarking).length,
      month: targetMonth + 1,
      year: targetYear
    };

    res.json({ stats });
  } catch (error) {
    console.error('Get attendance stats error:', error);
    res.status(500).json({ error: 'Server error fetching attendance statistics' });
  }
});

// Delete attendance (only for future dates or same day before cutoff)
router.delete('/date/:date', auth, employeeOrAdmin, async (req, res) => {
  try {
    const date = new Date(req.params.date);
    date.setHours(0, 0, 0, 0);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const isToday = date.getTime() === today.getTime();
    const isFuture = date > today;

    // Only allow deletion for today (before cutoff) or future dates
    if (!isFuture && (!isToday || isAfterCutoff())) {
      return res.status(400).json({ 
        error: 'Can only delete attendance for today (before 9:30 AM) or future dates' 
      });
    }

    const attendance = await Attendance.findOneAndDelete({
      userId: req.user._id,
      date: date
    });

    if (!attendance) {
      return res.status(404).json({ error: 'No attendance record found for this date' });
    }

    res.json({ message: 'Attendance record deleted successfully' });
  } catch (error) {
    console.error('Delete attendance error:', error);
    res.status(500).json({ error: 'Server error deleting attendance' });
  }
});

module.exports = router;
