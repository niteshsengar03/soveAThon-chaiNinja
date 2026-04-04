import express from "express";
import * as broadcastController from "./broadcast.controller.js";

const router = express.Router();

// Use this only for local development/testing to bypass JWT and role checks.
const testAdminUser = {
  id: "69d0874d94c09ae90af2521a",
  role: "ADMIN",
  hostelBlock: "A",
  name: "Admin User",
  email: "admin@gmail.com",
};

const testStudentUser = {
  id: "000000000000000000000000",
  role: "STUDENT",
  hostelBlock: "A",
  name: "Test Student",
  email: "test.student@example.com",
};

const setAdminUser = (req, res, next) => {
  req.user = testAdminUser;
  next();
};

const setStudentUser = (req, res, next) => {
  req.user = testStudentUser;
  next();
};

router.post("/create", setAdminUser, broadcastController.createBroadcast);
router.get("/admin", setAdminUser, broadcastController.getAdminBroadcasts);
router.get("/student", setStudentUser, broadcastController.getStudentBroadcasts);
router.delete("/:id", setAdminUser, broadcastController.deleteBroadcast);

export default router;
