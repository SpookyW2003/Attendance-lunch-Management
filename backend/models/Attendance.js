const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['office', 'home', 'leave'],
    required: true
  },
  markedAt: {
    type: Date,
    default: Date.now
  },
  isLateMarking: {
    type: Boolean,
    default: false
  },
  notes: {
    type: String,
    trim: true,
    maxlength: 500
  },
  // For future planning
  isPlanned: {
    type: Boolean,
    default: false
  },
  planDate: {
    type: Date,
    default: null
  },
  // Tracking modifications
  modificationHistory: [{
    previousStatus: String,
    newStatus: String,
    modifiedAt: {
      type: Date,
      default: Date.now
    },
    modifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    reason: String
  }]
}, {
  timestamps: true
});

// Compound index for efficient queries
attendanceSchema.index({ userId: 1, date: 1 }, { unique: true });
attendanceSchema.index({ date: 1, status: 1 });
attendanceSchema.index({ userId: 1, date: -1 });

// Static method to get attendance count for a specific date
attendanceSchema.statics.getAttendanceCount = async function(date) {
  const startDate = new Date(date);
  startDate.setHours(0, 0, 0, 0);
  
  const endDate = new Date(date);
  endDate.setHours(23, 59, 59, 999);

  return await this.aggregate([
    {
      $match: {
        date: {
          $gte: startDate,
          $lte: endDate
        }
      }
    },
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 }
      }
    }
  ]);
};

// Static method to get office attendance count for chef notification
attendanceSchema.statics.getOfficeCount = async function(date) {
  const startDate = new Date(date);
  startDate.setHours(0, 0, 0, 0);
  
  const endDate = new Date(date);
  endDate.setHours(23, 59, 59, 999);

  const result = await this.countDocuments({
    date: {
      $gte: startDate,
      $lte: endDate
    },
    status: 'office'
  });

  return result;
};

// Method to check if marking is late (after 9:30 AM)
attendanceSchema.methods.checkLateMarking = function() {
  const markedTime = this.markedAt;
  const cutoffTime = new Date(this.date);
  cutoffTime.setHours(9, 30, 0, 0);
  
  this.isLateMarking = markedTime > cutoffTime;
  return this.isLateMarking;
};

// Pre-save middleware to check late marking
attendanceSchema.pre('save', function(next) {
  if (this.isNew) {
    this.checkLateMarking();
  }
  next();
});

// Static method to get user attendance history
attendanceSchema.statics.getUserAttendanceHistory = async function(userId, startDate, endDate) {
  return await this.find({
    userId,
    date: {
      $gte: new Date(startDate),
      $lte: new Date(endDate)
    }
  })
  .populate('userId', 'name email employeeId')
  .sort({ date: -1 });
};

// Static method to get attendance analytics
attendanceSchema.statics.getAttendanceAnalytics = async function(startDate, endDate) {
  return await this.aggregate([
    {
      $match: {
        date: {
          $gte: new Date(startDate),
          $lte: new Date(endDate)
        }
      }
    },
    {
      $group: {
        _id: {
          date: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
          status: "$status"
        },
        count: { $sum: 1 }
      }
    },
    {
      $group: {
        _id: "$_id.date",
        statusCounts: {
          $push: {
            status: "$_id.status",
            count: "$count"
          }
        },
        totalCount: { $sum: "$count" }
      }
    },
    {
      $sort: { _id: 1 }
    }
  ]);
};

module.exports = mongoose.model('Attendance', attendanceSchema);
