import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
    {
        regNo: {
            type: String,
            required: function () {
                return this.role === "STUDENT";
            },
            unique: true,
            trim: true,
            sparse: true,
        },
        name: {
            type: String,
            required: [true, "Name is required"],
            trim: true,
            minlength: 2,
            maxlength: 50,
        },
        email: {
            type: String,
            required: function () {
                return this.role === "ADMIN";
            },
            unique: true,
            lowercase: true,
            trim: true,
        },
        phone: {
            type: String,
            trim: true,
        },
        role: {
            type: String,
            enum: ["STUDENT", "ADMIN"],
            required: [true, "Role is required"],
        },
        password: {
            type: String,
            required: [true, "Password is required"],
            minlength: 8,
            select: false,
        },
        hostelBlock: {
            type: String,
            enum: ["A", "B", "C", "D"],
            required: [true, "Hostel block is required"],
        },
        roomNo: {
            type: String,
            trim: true,
        },
        messType: {
            type: String,
            enum: ["VEG", "NON_VEG"],
        },
    },
    { timestamps: true },
);

// Hash password before saving
userSchema.pre("save", async function () {
    if (this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, 12);
    }
});

userSchema.methods.comparePassword = async function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model("User", userSchema);