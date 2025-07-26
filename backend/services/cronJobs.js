const cron = require('node-cron');
const Attendance = require('../models/Attendance');
const { isWeekend, isChefNotificationTime } = require('../utils/dateUtils');
const { sendNotificationToChef } = require('./notificationService');

// Send notification to chef at 9:30 AM
const scheduleChefNotification = () => {
  cron.schedule('30 9 * * 1-5', async () => { // 9:30 AM Monday to Friday
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (isWeekend(today)) return;

      const officeCount = await Attendance.getOfficeCount(today);
      await sendNotificationToChef(officeCount);
    } catch (error) {
      console.error('Error sending chef notification:', error);
    }
  });
};

// Start the scheduled tasks
const startScheduledTasks = () => {
  scheduleChefNotification();
  console.log('✓ Cron jobs initialized');
};

// Auto-start cron jobs when module is loaded
startScheduledTasks();

module.exports = { startScheduledTasks };
