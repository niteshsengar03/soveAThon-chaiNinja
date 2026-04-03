import cookieParser from "cookie-parser";
import express from "express";
import authRoute from "./modules/auth/auth.routes.js";
import complaintRoute from "./modules/complaints/complaint.routes.js";
import movementRoute from "./modules/movement/movement.routes.js";
import workerRoute from "./modules/workers/worker.routes.js";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/auth", authRoute);
app.use("/api/complaints", complaintRoute);
app.use("/api/workers", workerRoute);
app.use("/api/movements", movementRoute);

// Catch-all for undefined routes
app.use((req, res) => {
  throw ApiError.notFound(`Route ${req.originalUrl} not found`);
});
export default app;
