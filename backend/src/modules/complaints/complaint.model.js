import mongoose from "mongoose";

const complaintSchema = new mongoose.Schema(
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
            enum: ["ROOM", "ROOMMATE"],
            required: true,
        },
        category: {
            type: String,
            enum: ["AC", "FAN", "ELECTRICITY", "PLUMBING", "CARPENTRY", "OTHER"],
            required: true,
        },
        description: {
            type: String,
            required: true,
            trim: true,
        },
        status: {
            type: String,
            enum: ["PENDING", "ASSIGNED", "RESOLVED", "UNRESOLVED"],
            default: "PENDING",
        },
        priority: {
            type: String,
            enum: ["LOW", "MEDIUM", "HIGH"],
            default: "MEDIUM",
        },
        block: {
            type: String,
            required: true,
        },
        roomNo: {
            type: String,
            required: true,
        },
        assignedWorker: {
            workerId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Worker",
            },
            name: String,
            email: String,
            phone: String,
        },
        logs: [
            {
                oldStatus: String,
                newStatus: String,
                changedBy: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "User",
                },
                timestamp: {
                    type: Date,
                    default: Date.now,
                },
            },
        ],
        resolvedAt: Date,
    },
    { timestamps: true },
);

// Index for performance
complaintSchema.index({ studentId: 1 });
complaintSchema.index({ status: 1 });
complaintSchema.index({ block: 1, category: 1 });

export default mongoose.model("Complaint", complaintSchema);