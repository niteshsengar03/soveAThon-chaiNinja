import cookieParser from "cookie-parser";
import express from "express";
import ApiError from "./common/utils/api-error.js";
import authRoute from "./modules/auth/auth.routes.js";
import broadcastRoute from "./modules/broadcast/broadcast.routes.js";
import broadcastTestRoute from "./modules/broadcast/broadcast.test.routes.js";
import complaintRoute from "./modules/complaints/complaint.routes.js";
import movementRoute from "./modules/movement/movement.routes.js";
import workerRoute from "./modules/workers/worker.routes.js";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/auth", authRoute);
app.use("/api/broadcasts/test", broadcastTestRoute);
app.use("/api/broadcasts", broadcastRoute);



app.use("/api/complaints", complaintRoute);
app.use("/api/workers", workerRoute);
app.use("/api/movements", movementRoute);

// Catch-all for undefined routes
app.use((req, res) => {
  throw ApiError.notFound(`Route ${req.originalUrl} not found`);
});

// Global error handler middleware
app.use((err, req, res, next) => {
  console.error("Error:", err);

  // Check if it's an ApiError instance
  if (err.statusCode && err.message) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      error: process.env.NODE_ENV === 'development' ? err : undefined,
    });
  }

  // Handle Mongoose validation errors
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors)
      .map(e => e.message)
      .join(', ');
    return res.status(400).json({
      success: false,
      message: messages || 'Validation error',
    });
  }

  // Handle Mongoose duplicate key errors
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern)[0];
    return res.status(409).json({
      success: false,
      message: `${field} already exists`,
    });
  }

  // Default error response
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
});

export default app;
