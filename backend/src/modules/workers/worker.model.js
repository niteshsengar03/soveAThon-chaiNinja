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
            enum: ["AC", "ELECTRICITY", "FURNITURE", "WASHROOM", "WATER_COOLER"],
            required: [true, "Worker category is required"],
        },
        block: {
            type: String,
            required: false,
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
            required: false,
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