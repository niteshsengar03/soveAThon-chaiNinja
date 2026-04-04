import express from "express";
import * as complaintController from "./complaint.controller.js";
import * as authMiddleware from "../auth/auth.middleware.js";

const router = express.Router();

// All complaint routes require authentication
router.use(authMiddleware.authenticate);

// Create complaint (students only)
router.post(
    "/",
    authMiddleware.allowRoles("STUDENT"),
    complaintController.createComplaint
);

// Update complaint status (students only)
router.patch(
    "/:id/status",
    authMiddleware.allowRoles("STUDENT"),
    complaintController.updateComplaintStatus
);

// Assign worker to complaint (admins only)
router.patch(
    "/:id/assign",
    authMiddleware.allowRoles("ADMIN"),
    complaintController.assignWorker
);

// Get student's own complaints
router.get(
    "/my",
    authMiddleware.allowRoles("STUDENT"),
    complaintController.getMyComplaints
);

// Get complaints for admin's block
router.get(
    "/admin",
    authMiddleware.allowRoles("ADMIN"),
    complaintController.getAdminComplaints
);

// Get available workers for assignment (admins only)
router.get(
    "/available-workers",
    authMiddleware.allowRoles("ADMIN"),
    complaintController.getAvailableWorkers
);

// Get all complaints (super admin or for debugging)
router.get("/all", complaintController.getAllComplaints);

export default router;