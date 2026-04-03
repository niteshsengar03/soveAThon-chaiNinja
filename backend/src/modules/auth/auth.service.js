import User from "../../models/user.model.js";
import CollegeStudent from "../../models/collegeStudent.model.js";
import ApiError from "../../common/utils/api-error.js";
import { generateToken } from "../../common/utils/jwt.utils.js";

const studentSignup = async ({ regNo, password }) => {
  // Find student in college database
  const collegeStudent = await CollegeStudent.findOne({ regNo });
  if (!collegeStudent) {
    throw ApiError.notFound("Student not found in college database");
  }

  // Check if user already exists
  const existingUser = await User.findOne({ regNo });
  if (existingUser) {
    throw ApiError.conflict("User already exists");
  }

  // Create user with college data
  const user = await User.create({
    regNo: collegeStudent.regNo,
    name: collegeStudent.name,
    role: "STUDENT",
    password,
    hostelBlock: collegeStudent.hostelBlock,
    roomNo: collegeStudent.roomNo,
    messType: collegeStudent.messType,
  });

  const token = generateToken({
    userId: user._id,
    role: user.role,
    regNo: user.regNo,
    hostelBlock: user.hostelBlock
  });

  const userObj = user.toObject();
  delete userObj.password;

  return { user: userObj, token };
};

const studentLogin = async ({ regNo, password }) => {
  const user = await User.findOne({ regNo, role: "STUDENT" }).select("+password");
  if (!user) throw ApiError.unauthorized("Invalid registration number or password");

  const isPasswordValid = await user.comparePassword(password);
  if (!isPasswordValid) throw ApiError.unauthorized("Invalid registration number or password");

  const token = generateToken({
    userId: user._id,
    role: user.role,
    regNo: user.regNo,
    hostelBlock: user.hostelBlock
  });

  const userObj = user.toObject();
  delete userObj.password;

  return { user: userObj, token };
};

const adminLogin = async ({ email, password }) => {
  const user = await User.findOne({ email, role: "ADMIN" }).select("+password");
  if (!user) throw ApiError.unauthorized("Invalid email or password");

  const isPasswordValid = await user.comparePassword(password);
  if (!isPasswordValid) throw ApiError.unauthorized("Invalid email or password");

  const token = generateToken({
    userId: user._id,
    role: user.role,
    hostelBlock: user.hostelBlock
  });

  const userObj = user.toObject();
  delete userObj.password;

  return { user: userObj, token };
};

export { studentSignup, studentLogin, adminLogin };
