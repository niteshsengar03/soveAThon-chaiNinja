import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const cleanupDatabase = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Connected to MongoDB");

        // Drop the users collection to start fresh
        await mongoose.connection.db.dropCollection('users');
        console.log("Dropped users collection");

        // Also drop collegeStudents if needed
        try {
            await mongoose.connection.db.dropCollection('collegestudents');
            console.log("Dropped collegeStudents collection");
        } catch (error) {
            console.log("collegeStudents collection doesn't exist or already dropped");
        }

        process.exit(0);
    } catch (error) {
        console.error("Error cleaning up database:", error);
        process.exit(1);
    }
};

cleanupDatabase();