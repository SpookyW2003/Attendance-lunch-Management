// Check if a date falls on weekend (Saturday = 6, Sunday = 0)
const isWeekend = (date) => {
  const day = date.getDay();
  return day === 0 || day === 6; // Sunday or Saturday
};

// Check if current time is after 9:30 AM cutoff
const isAfterCutoff = (customTime = null) => {
  const now = customTime || new Date();
  const cutoffTime = new Date(now);
  cutoffTime.setHours(9, 30, 0, 0); // 9:30 AM
  
  return now > cutoffTime;
};

// Get next working day (skip weekends)
const getNextWorkingDay = (date = new Date()) => {
  const nextDay = new Date(date);
  nextDay.setDate(nextDay.getDate() + 1);
  
  while (isWeekend(nextDay)) {
    nextDay.setDate(nextDay.getDate() + 1);
  }
  
  return nextDay;
};

// Get previous working day (skip weekends)
const getPreviousWorkingDay = (date = new Date()) => {
  const prevDay = new Date(date);
  prevDay.setDate(prevDay.getDate() - 1);
  
  while (isWeekend(prevDay)) {
    prevDay.setDate(prevDay.getDate() - 1);
  }
  
  return prevDay;
};

// Format date for display (YYYY-MM-DD)
const formatDate = (date) => {
  return date.toISOString().split('T')[0];
};

// Get date range for a specific month
const getMonthDateRange = (year, month) => {
  const startDate = new Date(year, month - 1, 1); // month is 0-indexed
  const endDate = new Date(year, month, 0); // Last day of month
  
  return { startDate, endDate };
};

// Get working days in a month (excluding weekends)
const getWorkingDaysInMonth = (year, month) => {
  const { startDate, endDate } = getMonthDateRange(year, month);
  const workingDays = [];
  
  const currentDate = new Date(startDate);
  while (currentDate <= endDate) {
    if (!isWeekend(currentDate)) {
      workingDays.push(new Date(currentDate));
    }
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  return workingDays;
};

// Check if it's time to send chef notification (exactly 9:30 AM)
const isChefNotificationTime = (customTime = null) => {
  const now = customTime || new Date();
  const hour = now.getHours();
  const minute = now.getMinutes();
  
  return hour === 9 && minute === 30;
};

// Get time until next cutoff (for UI display)
const getTimeUntilCutoff = (customTime = null) => {
  const now = customTime || new Date();
  const cutoffTime = new Date(now);
  cutoffTime.setHours(9, 30, 0, 0);
  
  if (now > cutoffTime) {
    // Next cutoff is tomorrow
    cutoffTime.setDate(cutoffTime.getDate() + 1);
  }
  
  const timeDiff = cutoffTime - now;
  const hours = Math.floor(timeDiff / (1000 * 60 * 60));
  const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
  
  return { hours, minutes, isAfterCutoff: isAfterCutoff(now) };
};

// Create date from date string (handles timezone issues)
const createDateFromString = (dateString) => {
  const date = new Date(dateString);
  date.setHours(0, 0, 0, 0);
  return date;
};

// Check if two dates are the same day
const isSameDay = (date1, date2) => {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
};

// Get week range (Monday to Sunday)
const getWeekRange = (date = new Date()) => {
  const startOfWeek = new Date(date);
  const day = startOfWeek.getDay();
  const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1); // Monday as start
  startOfWeek.setDate(diff);
  startOfWeek.setHours(0, 0, 0, 0);
  
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);
  endOfWeek.setHours(23, 59, 59, 999);
  
  return { startOfWeek, endOfWeek };
};

module.exports = {
  isWeekend,
  isAfterCutoff,
  getNextWorkingDay,
  getPreviousWorkingDay,
  formatDate,
  getMonthDateRange,
  getWorkingDaysInMonth,
  isChefNotificationTime,
  getTimeUntilCutoff,
  createDateFromString,
  isSameDay,
  getWeekRange
};
