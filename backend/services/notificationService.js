const admin = require('firebase-admin');
const nodemailer = require('nodemailer');
const User = require('../models/User');

// Initialize Firebase Admin SDK
let firebaseApp = null;

const initializeFirebase = () => {
  if (!firebaseApp && process.env.FIREBASE_PROJECT_ID) {
    try {
      const serviceAccount = {
        type: "service_account",
        project_id: process.env.FIREBASE_PROJECT_ID,
        private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        client_email: process.env.FIREBASE_CLIENT_EMAIL,
      };

      firebaseApp = admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        projectId: process.env.FIREBASE_PROJECT_ID,
      });

      console.log('Firebase Admin SDK initialized successfully');
    } catch (error) {
      console.error('Firebase initialization error:', error);
    }
  }
};

// Initialize nodemailer transporter
const createEmailTransporter = () => {
  return nodemailer.createTransporter({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

// Send push notification
const sendPushNotification = async (token, title, body, data = {}) => {
  if (!firebaseApp) {
    initializeFirebase();
  }

  if (!firebaseApp) {
    console.warn('Firebase not initialized, skipping push notification');
    return false;
  }

  try {
    const message = {
      notification: {
        title,
        body,
      },
      data: {
        ...data,
        timestamp: new Date().toISOString(),
      },
      token,
    };

    const response = await admin.messaging().send(message);
    console.log('Push notification sent successfully:', response);
    return true;
  } catch (error) {
    console.error('Error sending push notification:', error);
    return false;
  }
};

// Send email notification
const sendEmailNotification = async (to, subject, html, text = null) => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.warn('Email configuration not found, skipping email notification');
    return false;
  }

  try {
    const transporter = createEmailTransporter();
    
    const mailOptions = {
      from: `"Attendance System" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
      text: text || html.replace(/<[^>]*>/g, ''), // Strip HTML tags for text version
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', info.messageId);
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
};

// Send notification to chef about office count
const sendNotificationToChef = async (officeCount) => {
  try {
    // Get all chefs
    const chefs = await User.find({ 
      role: 'chef', 
      isActive: true 
    });

    if (chefs.length === 0) {
      console.warn('No active chefs found for notification');
      return;
    }

    const title = 'Daily Lunch Count';
    const body = `${officeCount} employees working from office today`;
    const currentDate = new Date().toDateString();
    
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333; text-align: center;">Daily Lunch Count Notification</h2>
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #495057; margin-top: 0;">Today's Office Attendance</h3>
          <p style="font-size: 18px; color: #28a745; margin: 10px 0;">
            <strong>${officeCount}</strong> employees are working from office
          </p>
          <p style="color: #6c757d; margin: 0;">
            Date: ${currentDate}
          </p>
        </div>
        <div style="background-color: #e9ecef; padding: 15px; border-radius: 5px; margin-top: 20px;">
          <p style="margin: 0; font-size: 14px; color: #6c757d;">
            This notification is sent automatically at 9:30 AM to help with lunch planning.
          </p>
        </div>
      </div>
    `;

    for (const chef of chefs) {
      // Send push notification if chef has FCM token and enabled push notifications
      if (chef.fcmToken && chef.pushNotifications) {
        await sendPushNotification(
          chef.fcmToken,
          title,
          body,
          {
            type: 'lunch_count',
            count: officeCount.toString(),
            date: currentDate
          }
        );
      }

      // Send email notification if chef has enabled email notifications
      if (chef.emailNotifications && chef.email) {
        await sendEmailNotification(
          chef.email,
          `Daily Lunch Count - ${currentDate}`,
          emailHtml
        );
      }
    }

    console.log(`Notifications sent to ${chefs.length} chef(s) - Office count: ${officeCount}`);
  } catch (error) {
    console.error('Error sending chef notifications:', error);
    throw error;
  }
};

// Send general notification to user
const sendNotificationToUser = async (userId, title, body, data = {}) => {
  try {
    const user = await User.findById(userId);
    if (!user || !user.isActive) {
      console.warn('User not found or inactive:', userId);
      return false;
    }

    let notificationSent = false;

    // Send push notification
    if (user.fcmToken && user.pushNotifications) {
      const pushSent = await sendPushNotification(user.fcmToken, title, body, data);
      notificationSent = notificationSent || pushSent;
    }

    // Send email notification
    if (user.emailNotifications && user.email) {
      const emailHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">${title}</h2>
          <p style="font-size: 16px; color: #495057;">${body}</p>
          <div style="background-color: #e9ecef; padding: 15px; border-radius: 5px; margin-top: 20px;">
            <p style="margin: 0; font-size: 14px; color: #6c757d;">
              Sent from Attendance and Lunch Management System
            </p>
          </div>
        </div>
      `;
      
      const emailSent = await sendEmailNotification(user.email, title, emailHtml);
      notificationSent = notificationSent || emailSent;
    }

    return notificationSent;
  } catch (error) {
    console.error('Error sending notification to user:', error);
    return false;
  }
};

// Send bulk notifications
const sendBulkNotifications = async (userIds, title, body, data = {}) => {
  const results = await Promise.allSettled(
    userIds.map(userId => sendNotificationToUser(userId, title, body, data))
  );

  const successful = results.filter(result => result.status === 'fulfilled' && result.value).length;
  const failed = results.length - successful;

  console.log(`Bulk notifications sent: ${successful} successful, ${failed} failed`);
  return { successful, failed };
};

// Initialize services
const initializeNotificationService = () => {
  initializeFirebase();
  console.log('Notification service initialized');
};

module.exports = {
  sendPushNotification,
  sendEmailNotification,
  sendNotificationToChef,
  sendNotificationToUser,
  sendBulkNotifications,
  initializeNotificationService
};
