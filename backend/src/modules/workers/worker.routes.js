import express from "express";
import * as workerController from "./worker.controller.js";
import * as authMiddleware from "../auth/auth.middleware.js";

const router = express.Router();

// All worker routes require authentication and admin role
router.use(authMiddleware.authenticate);
router.use(authMiddleware.allowRoles("ADMIN"));

router.post("/", workerController.createWorker);
router.get("/", workerController.getWorkers);
router.get("/:id", workerController.getWorkerById);
router.patch("/:id", workerController.updateWorker);
router.delete("/:id", workerController.deleteWorker);

export default router;