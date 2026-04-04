import express from "express";
import * as broadcastController from "./broadcast.controller.js";
import * as authMiddleware from "../auth/auth.middleware.js";
import validate from "../../common/middleware/validate.middleware.js";
import CreateBroadcastDto from "./dto/create-broadcast.dto.js";

const router = express.Router();

router.use(authMiddleware.authenticate);

// Student timeline feed
router.get("/", authMiddleware.allowRoles("STUDENT"), broadcastController.getStudentBroadcasts);

// Admin create and manage broadcasts
router.post(
  "/",
  authMiddleware.allowRoles("ADMIN"),
  validate(CreateBroadcastDto),
  broadcastController.createBroadcast,
);
router.get("/admin", authMiddleware.allowRoles("ADMIN"), broadcastController.getAdminBroadcasts);
router.delete("/:id", authMiddleware.allowRoles("ADMIN"), broadcastController.deleteBroadcast);

export default router;