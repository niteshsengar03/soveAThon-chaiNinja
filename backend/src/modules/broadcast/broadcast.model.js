import mongoose from "mongoose";

const broadcastSchema = new mongoose.Schema(
  {
    adminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    block: {
      type: String,
      required: true,
      enum: ["A", "B", "C", "D"],
    },
    content: {
      type: String,
      required: [true, "Broadcast content is required"],
      trim: true,
      maxlength: 1000,
    },
    imageUrl: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true },
);

broadcastSchema.index({ block: 1, createdAt: -1 });

export default mongoose.model("Broadcast", broadcastSchema);
