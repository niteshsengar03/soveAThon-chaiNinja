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
      required: function () {
        return this.role === "ADMIN";
      },
      minlength: 8,
      select: false,
    },
  },
  { timestamps: true },
);

// Hash password before saving (only for ADMIN)
userSchema.pre("save", async function () {
  if (this.role === "ADMIN" && this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 12);
  }
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};


export default mongoose.model("User", userSchema);
