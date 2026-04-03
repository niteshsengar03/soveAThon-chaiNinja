import * as authService from "./auth.service.js";
import ApiResponse from "../../common/utils/api-response.js";

const adminLogin = async (req, res) => {
  const { user, token } = await authService.adminLogin(req.body);
  ApiResponse.ok(res, "Admin login successful", { user, token });
};

const studentLogin = async (req, res) => {
  const { user, token } = await authService.studentLogin(req.body);
  ApiResponse.ok(res, "Student login successful", { user, token });
};

export { adminLogin, studentLogin };
