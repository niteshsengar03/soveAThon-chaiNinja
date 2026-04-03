import express from "express";
import * as movementController from "./movement.controller.js";
import * as authMiddleware from "../auth/auth.middleware.js";

const router = express.Router();

// All movement routes require authentication
router.use(authMiddleware.authenticate);

// Create movement request (students only)
router.post(
    "/",
    authMiddleware.allowRoles("STUDENT"),
    movementController.createMovementRequest
);

// Approve movement request (admins only)
router.patch(
    "/:id/approve",
    authMiddleware.allowRoles("ADMIN"),
    movementController.approveMovementRequest
);

// Reject movement request (admins only)
router.patch(
    "/:id/reject",
    authMiddleware.allowRoles("ADMIN"),
    movementController.rejectMovementRequest
);

// Update return time (admins only)
router.patch(
    "/:id/return",
    authMiddleware.allowRoles("ADMIN"),
    movementController.updateReturnTime
);

// Get student's own movements
router.get(
    "/my",
    authMiddleware.allowRoles("STUDENT"),
    movementController.getMyMovements
);

// Get movements for admin's block
router.get(
    "/admin",
    authMiddleware.allowRoles("ADMIN"),
    movementController.getAdminMovements
);

// Get all movements (for debugging)
router.get("/all", movementController.getAllMovements);

export default router;