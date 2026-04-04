import Broadcast from "./broadcast.model.js";
import ApiError from "../../common/utils/api-error.js";

const createBroadcast = async ({ adminId, block, content, imageUrl }) => {
  if (!adminId || !block || !content) {
    throw ApiError.badRequest("adminId, block, and content are required");
  }

  const broadcast = await Broadcast.create({
    adminId,
    block,
    content,
    imageUrl,
  });

  return broadcast;
};

const getBroadcastsForStudent = async ({ block, limit = 20, before }) => {
  const query = { block };
  if (before) {
    query.createdAt = { $lt: new Date(before) };
  }

  const broadcasts = await Broadcast.find(query)
    .sort({ createdAt: -1 })
    .limit(Number(limit));

  const nextCursor = broadcasts.length ? broadcasts[broadcasts.length - 1].createdAt : null;

  return { broadcasts, nextCursor };
};

const getBroadcastsForAdmin = async ({ block, limit = 20, before }) => {
  const query = { block };
  if (before) {
    query.createdAt = { $lt: new Date(before) };
  }

  const broadcasts = await Broadcast.find(query)
    .sort({ createdAt: -1 })
    .limit(Number(limit));

  const nextCursor = broadcasts.length ? broadcasts[broadcasts.length - 1].createdAt : null;

  return { broadcasts, nextCursor };
};

const deleteBroadcast = async (broadcastId, adminId) => {
  const broadcast = await Broadcast.findById(broadcastId);
  if (!broadcast) {
    throw ApiError.notFound("Broadcast not found");
  }

  if (broadcast.adminId.toString() !== adminId.toString()) {
    throw ApiError.forbidden("You can only delete broadcasts you created");
  }

  await broadcast.deleteOne();
  return { success: true };
};

export { createBroadcast, getBroadcastsForStudent, getBroadcastsForAdmin, deleteBroadcast };