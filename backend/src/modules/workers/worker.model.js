import mongoose from "mongoose";

const workerSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Worker name is required"],
            trim: true,
        },
        category: {
            type: String,
            enum: ["ELECTRICIAN", "PLUMBER", "CARPENTER", "OTHER"],
            required: [true, "Worker category is required"],
        },
        block: {
            type: String,
            required: [true, "Block is required"],
            enum: ["A", "B", "C", "D"],
        },
        email: {
            type: String,
            required: [true, "Email is required"],
            unique: true,
            lowercase: true,
            trim: true,
        },
        phone: {
            type: String,
            required: [true, "Phone number is required"],
            trim: true,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    { timestamps: true },
);

// Index for performance
workerSchema.index({ category: 1, block: 1, isActive: 1 });

export default mongoose.model("Worker", workerSchema);