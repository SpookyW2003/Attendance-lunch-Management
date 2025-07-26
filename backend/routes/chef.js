const express = require('express');
const Attendance = require('../models/Attendance');
const { auth, chefOrAdmin } = require('../middleware/auth');

const router = express.Router();

// Get today's office count for chef
router.get('/today-count', auth, chefOrAdmin, async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const officeCount = await Attendance.getOfficeCount(today);

    res.json({
      officeCount,
      date: today.toISOString().split('T')[0],
      lastUpdated: new Date().toISOString()
    });
  } catch (error) {
    console.error('Get today count error:', error);
    res.status(500).json({ error: 'Server error fetching today\'s count' });
  }
});

module.exports = router;
