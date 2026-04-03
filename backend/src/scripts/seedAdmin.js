import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import User from "../models/user.model.js";

dotenv.config();

const admins = [
    { name: "Admin A", email: "adminA@hostel.com", hostelBlock: "A" },
    { name: "Admin B", email: "adminB@hostel.com", hostelBlock: "B" },
    { name: "Admin C", email: "adminC@hostel.com", hostelBlock: "C" },
    { name: "Admin D", email: "adminD@hostel.com", hostelBlock: "D" },
];

const seedAdmins = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Connected to MongoDB");

        for (const admin of admins) {
            const existingAdmin = await User.findOne({ email: admin.email });
            if (existingAdmin) {
                console.log(`Admin ${admin.email} already exists`);
                continue;
            }

            const hashedPassword = await bcrypt.hash("Admin@123", 12);

            await User.create({
                name: admin.name,
                email: admin.email,
                role: "ADMIN",
                password: hashedPassword,
                hostelBlock: admin.hostelBlock,
            });

            console.log(`Admin ${admin.email} created successfully`);
        }

        console.log("Admin seeding completed");
        process.exit(0);
    } catch (error) {
        console.error("Error seeding admins:", error);
        process.exit(1);
    }
};

seedAdmins();