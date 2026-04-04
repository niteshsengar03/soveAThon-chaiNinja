import * as broadcastService from "./broadcast.service.js";
import ApiResponse from "../../common/utils/api-response.js";

const createBroadcast = async (req, res) => {
  const broadcast = await broadcastService.createBroadcast({
    adminId: req.user.id,
    block: req.user.hostelBlock,
    content: req.body.content,
    imageUrl: req.body.imageUrl,
  });

  ApiResponse.created(res, "Broadcast created successfully", { broadcast });
};

const getStudentBroadcasts = async (req, res) => {
  const { limit, before } = req.query;
  const result = await broadcastService.getBroadcastsForStudent({
    block: req.user.hostelBlock,
    limit,
    before,
  });

  ApiResponse.ok(res, "Broadcasts retrieved successfully", result);
};

const getAdminBroadcasts = async (req, res) => {
  const { limit, before } = req.query;
  const result = await broadcastService.getBroadcastsForAdmin({
    block: req.user.hostelBlock,
    limit,
    before,
  });

  ApiResponse.ok(res, "Broadcasts retrieved successfully", result);
};

const deleteBroadcast = async (req, res) => {
  const result = await broadcastService.deleteBroadcast(req.params.id, req.user.id);
  ApiResponse.ok(res, "Broadcast deleted successfully", result);
};

export { createBroadcast, getStudentBroadcasts, getAdminBroadcasts, deleteBroadcast };