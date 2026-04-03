import ApiError from "../../common/utils/api-error.js";
import { verifyToken } from "../../common/utils/jwt.utils.js";
import User from "../../models/user.model.js";

// Authenticates using JWT from Authorization header
const authenticate = async (req, res, next) => {
  let token;

  if (req.headers.authorization?.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) throw ApiError.unauthorized("Not authenticated");

  const decoded = verifyToken(token);
  const user = await User.findById(decoded.userId);
  if (!user) throw ApiError.unauthorized("User no longer exists");

  req.user = {
    id: user._id,
    role: user.role,
    name: user.name,
    email: user.email,
    regNo: user.regNo,
    hostelBlock: user.hostelBlock,
  };
  next();
};

// Higher-order function — returns middleware configured with allowed roles
const allowRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      throw ApiError.forbidden(
        "You do not have permission to perform this action",
      );
    }
    next();
  };
};

// Middleware to check if admin has access to specific block
const allowBlockAccess = (req, res, next) => {
  // Students can only access their own data
  if (req.user.role === "STUDENT") {
    // For student routes, they should only access their own data
    // This will be checked in the service layer
    return next();
  }

  // Admins can only access their assigned block
  if (req.user.role === "ADMIN") {
    // Block access will be validated in service layer based on req.user.hostelBlock
    return next();
  }

  throw ApiError.forbidden("Access denied");
};

export { authenticate, allowRoles, allowBlockAccess };
