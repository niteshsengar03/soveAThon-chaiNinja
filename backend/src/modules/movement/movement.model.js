import mongoose from "mongoose";

const movementSchema = new mongoose.Schema(
    {
        studentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        regNo: {
            type: String,
            required: true,
        },
        type: {
            type: String,
            enum: ["GARAGE", "PRAYER"],
            required: true,
        },
        reason: {
            type: String,
            required: true,
            trim: true,
        },
        requestedOutTime: {
            type: Date,
            required: true,
        },
        expectedReturnTime: {
            type: Date,
            required: true,
        },
        actualReturnTime: {
            type: Date,
        },
        status: {
            type: String,
            enum: ["PENDING", "APPROVED", "REJECTED"],
            default: "PENDING",
        },
        approvedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        block: {
            type: String,
            required: true,
        },
        roomNo: {
            type: String,
            required: true,
        },
    },
    { timestamps: true },
);

// Index for performance
movementSchema.index({ studentId: 1 });
movementSchema.index({ status: 1 });
movementSchema.index({ block: 1 });

export default mongoose.model("Movement", movementSchema);