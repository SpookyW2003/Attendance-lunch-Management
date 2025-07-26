const express = require('express');
const { query, validationResult } = require('express-validator');
const User = require('../models/User');
const Attendance = require('../models/Attendance');
const { auth, adminOnly } = require('../middleware/auth');

const router = express.Router();

// Get all users with filtering and pagination
router.get('/users', [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('role').optional().isIn(['admin', 'employee', 'chef']),
  query('search').optional().trim()
], auth, adminOnly, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        error: 'Validation failed', 
        details: errors.array() 
      });
    }

    const { page = 1, limit = 20, role, search } = req.query;
    const skip = (page - 1) * limit;

    // Build query
    const query = {};
    if (role) query.role = role;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { employeeId: { $regex: search, $options: 'i' } }
      ];
    }

    const [users, total] = await Promise.all([
      User.find(query)
        .select('-password')
        .sort({ createdAt: -1 })
        .limit(parseInt(limit))
        .skip(skip),
      User.countDocuments(query)
    ]);

    res.json({
      users,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / limit),
        total,
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ error: 'Server error fetching users' });
  }
});

// Get dashboard stats
router.get('/dashboard/stats', auth, adminOnly, async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [
      totalUsers,
      todayAttendance,
      activeUsers
    ] = await Promise.all([
      User.countDocuments(),
      Attendance.getAttendanceCount(today),
      User.countDocuments({ isActive: true })
    ]);

    const todayOfficeCount = await Attendance.getOfficeCount(today);

    const stats = {
      totalUsers,
      activeUsers,
      todayOfficeCount,
      todayAttendance: todayAttendance.reduce((acc, item) => {
        acc[item._id] = item.count;
        return acc;
      }, {})
    };

    res.json({ stats });
  } catch (error) {
    console.error('Get admin dashboard stats error:', error);
    res.status(500).json({ error: 'Server error fetching dashboard stats' });
  }
});

// Get attendance reports
router.get('/attendance/reports', [
  query('startDate').optional().isISO8601(),
  query('endDate').optional().isISO8601(),
  query('userId').optional().isMongoId()
], auth, adminOnly, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        error: 'Validation failed', 
        details: errors.array() 
      });
    }

    const { startDate, endDate, userId } = req.query;
    
    const defaultEndDate = new Date();
    const defaultStartDate = new Date();
    defaultStartDate.setDate(defaultStartDate.getDate() - 30);

    const query = {
      date: {
        $gte: startDate ? new Date(startDate) : defaultStartDate,
        $lte: endDate ? new Date(endDate) : defaultEndDate
      }
    };

    if (userId) {
      query.userId = userId;
    }

    const attendance = await Attendance.find(query)
      .populate('userId', 'name email employeeId department')
      .sort({ date: -1, 'userId.name': 1 });

    res.json({ attendance });
  } catch (error) {
    console.error('Get attendance reports error:', error);
    res.status(500).json({ error: 'Server error fetching attendance reports' });
  }
});

module.exports = router;
