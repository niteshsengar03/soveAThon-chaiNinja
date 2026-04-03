import express from "express";
import * as authController from "./auth.controller.js";
import * as authMiddleware from "./auth.middleware.js";
import validate from "../../common/middleware/validate.middleware.js";
import AdminLoginDto from "./dto/admin-login.dto.js";
import StudentLoginDto from "./dto/student-login.dto.js";
import StudentSignupDto from "./dto/student-signup.dto.js";

const router = express.Router();

// Student signup
router.post("/student/signup", validate(StudentSignupDto), authController.studentSignup);

// Student login
router.post("/student/login", validate(StudentLoginDto), authController.studentLogin);

// Admin login
router.post("/admin/login", validate(AdminLoginDto), authController.adminLogin);

// Example protected routes
router.get("/me", authMiddleware.authenticate, (req, res) => {
  res.json({ user: req.user });
});

router.get("/admin-only", authMiddleware.authenticate, authMiddleware.allowRoles("ADMIN"), (req, res) => {
  res.json({ message: "Admin access granted" });
});

router.get("/student-only", authMiddleware.authenticate, authMiddleware.allowRoles("STUDENT"), (req, res) => {
  res.json({ message: "Student access granted" });
});

export default router;
