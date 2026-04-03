import mongoose from "mongoose";

const collegeStudentSchema = new mongoose.Schema(
    {
        regNo: {
            type: String,
            required: [true, "Registration number is required"],
            unique: true,
            trim: true,
        },
        name: {
            type: String,
            required: [true, "Name is required"],
            trim: true,
        },
        hostelBlock: {
            type: String,
            required: [true, "Hostel block is required"],
            enum: ["A", "B", "C", "D"],
        },
        roomNo: {
            type: String,
            required: [true, "Room number is required"],
            trim: true,
        },
        messType: {
            type: String,
            required: [true, "Mess type is required"],
            enum: ["VEG", "NON_VEG"],
        },
    },
    { timestamps: true },
);

export default mongoose.model("CollegeStudent", collegeStudentSchema);