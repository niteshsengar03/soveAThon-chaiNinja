import User from "../../models/user.model.js";
import ApiError from "../../common/utils/api-error.js";
import { generateToken } from "../../common/utils/jwt.utils.js";

const adminLogin = async ({ email, password }) => {
  const user = await User.findOne({ email, role: "ADMIN" }).select("+password");
  if (!user) throw ApiError.unauthorized("Invalid email or password");

  const isPasswordValid = await user.comparePassword(password);
  if (!isPasswordValid) throw ApiError.unauthorized("Invalid email or password");

  const token = generateToken({ userId: user._id, role: user.role });

  const userObj = user.toObject();
  delete userObj.password;

  return { user: userObj, token };
};

const studentLogin = async ({ regNo, name }) => {
  let user = await User.findOne({ regNo, role: "STUDENT" });

  if (!user) {
    // Create new student user
    user = await User.create({
      regNo,
      name: name || `Student ${regNo}`,
      role: "STUDENT",
    });
  }

  const token = generateToken({ userId: user._id, role: user.role });

  return { user, token };
};

export { adminLogin, studentLogin };
