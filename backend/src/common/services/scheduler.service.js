import cron from 'node-cron';
import Complaint from '../../modules/complaints/complaint.model.js';
import { queueNotification } from './notification.service.js';
import logger from '../config/logger.config.js';

// Check for resolved complaints older than 2 days
const checkResolvedComplaints = async () => {
  try {
    const twoDaysAgo = new Date();
    twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

    // Find complaints that are resolved and haven't been checked recently
    const resolvedComplaints = await Complaint.find({
      status: 'RESOLVED',
      resolvedAt: { $lt: twoDaysAgo },
      // Add a field to track if alert was sent (we'll add this to the model)
      alertSent: { $ne: true }
    }).populate('studentId', 'name regNo');

    for (const complaint of resolvedComplaints) {
      // Get head of hostels email (you might want to store this in config or database)
      const headEmail = process.env.HEAD_OF_HOSTELS_EMAIL || 'head@hostel.edu';

      await queueNotification('complaint-resolved-alert', {
        complaintId: complaint._id,
        category: complaint.category,
        description: complaint.description,
        block: complaint.block,
        roomNo: complaint.roomNo,
        resolvedAt: complaint.resolvedAt.toISOString(),
        daysSinceResolved: Math.floor((new Date() - complaint.resolvedAt) / (1000 * 60 * 60 * 24)),
        headEmail,
        studentName: complaint.studentId?.name || 'Unknown',
        regNo: complaint.studentId?.regNo || 'Unknown'
      });

      // Mark alert as sent
      complaint.alertSent = true;
      await complaint.save();

      logger.info(`Alert queued for resolved complaint: ${complaint._id}`);
    }
  } catch (error) {
    logger.error(`Error checking resolved complaints: ${error.message}`);
  }
};

// Schedule the job to run daily at 9 AM
export const startScheduler = () => {
  // Run every day at 9:00 AM
  cron.schedule('0 9 * * *', () => {
    logger.info('Running daily resolved complaints check');
    checkResolvedComplaints();
  });

  // Also run on startup for testing
  if (process.env.NODE_ENV === 'development') {
    setTimeout(() => {
      logger.info('Running initial resolved complaints check');
      checkResolvedComplaints();
    }, 5000); // 5 seconds after startup
  }

  logger.info('Complaint scheduler started');
};

export default { startScheduler };