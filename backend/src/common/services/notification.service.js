import { Queue, Worker } from 'bullmq';
import redisClient from '../config/redis.config.js';
import { sendComplaintNotification } from '../config/email.js';
import logger from '../config/logger.config.js';

export const NOTIFICATION_QUEUE = 'complaint-notifications';

// Create notification queue
export const notificationQueue = new Queue(NOTIFICATION_QUEUE, {
  connection: {
    host: process.env.REDIS_HOST || 'localhost',
    port: process.env.REDIS_PORT || 6379,
  },
});

// Worker to process notification jobs
const notificationWorker = new Worker(
  NOTIFICATION_QUEUE,
  async (job) => {
    const { type, data } = job.data;

    try {
      switch (type) {
        case 'complaint-assigned':
          await sendComplaintNotification(
            data.workerEmail,
            `Complaint Assigned: ${data.complaintId}`,
            `
            <h2>New Complaint Assigned</h2>
            <p><strong>Complaint ID:</strong> ${data.complaintId}</p>
            <p><strong>Category:</strong> ${data.category}</p>
            <p><strong>Description:</strong> ${data.description}</p>
            <p><strong>Block:</strong> ${data.block}</p>
            <p><strong>Room:</strong> ${data.roomNo}</p>
            <p><strong>Student:</strong> ${data.studentName} (${data.regNo})</p>
            <p>Please visit the location to resolve the issue.</p>
            `
          );
          break;

        case 'complaint-resolved-alert':
          await sendComplaintNotification(
            data.headEmail,
            `Resolved Complaint Alert: ${data.complaintId}`,
            `
            <h2>Resolved Complaint Alert</h2>
            <p><strong>Complaint ID:</strong> ${data.complaintId}</p>
            <p><strong>Category:</strong> ${data.category}</p>
            <p><strong>Description:</strong> ${data.description}</p>
            <p><strong>Block:</strong> ${data.block}</p>
            <p><strong>Room:</strong> ${data.roomNo}</p>
            <p><strong>Resolved Date:</strong> ${data.resolvedAt}</p>
            <p><strong>Days Since Resolution:</strong> ${data.daysSinceResolved}</p>
            <p>This complaint has been resolved for more than 2 days. Please verify the resolution.</p>
            `
          );
          break;

        default:
          logger.warn(`Unknown notification type: ${type}`);
      }

      logger.info(`Notification sent successfully: ${type} for complaint ${data.complaintId}`);
    } catch (error) {
      logger.error(`Failed to send notification: ${error.message}`);
      throw error;
    }
  },
  {
    connection: {
      host: process.env.REDIS_HOST || 'localhost',
      port: process.env.REDIS_PORT || 6379,
    },
  }
);

// Event listeners for worker
notificationWorker.on('completed', (job) => {
  logger.info(`Notification job ${job.id} completed`);
});

notificationWorker.on('failed', (job, err) => {
  logger.error(`Notification job ${job.id} failed: ${err.message}`);
});

// Function to add notification to queue
export const queueNotification = async (type, data) => {
  try {
    await notificationQueue.add('send-notification', { type, data });
    logger.info(`Notification queued: ${type}`);
  } catch (error) {
    logger.error(`Failed to queue notification: ${error.message}`);
    throw error;
  }
};

export default notificationQueue;