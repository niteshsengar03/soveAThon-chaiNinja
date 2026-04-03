import mongoose from "mongoose";
import dotenv from "dotenv";
import CollegeStudent from "../models/collegeStudent.model.js";

dotenv.config();

const collegeStudents = [
    { regNo: "21BCS001", name: "Rahul Sharma", hostelBlock: "A", roomNo: "101", messType: "VEG" },
    { regNo: "21BCS002", name: "Amit Kumar", hostelBlock: "A", roomNo: "102", messType: "NON_VEG" },
    { regNo: "21BCS003", name: "Neha Singh", hostelBlock: "B", roomNo: "201", messType: "VEG" },
    { regNo: "21BCS004", name: "Priya Verma", hostelBlock: "B", roomNo: "202", messType: "NON_VEG" },
    { regNo: "21BCS005", name: "Rohit Gupta", hostelBlock: "C", roomNo: "301", messType: "VEG" },
    { regNo: "21BCS006", name: "Ankit Jain", hostelBlock: "C", roomNo: "302", messType: "NON_VEG" },
    { regNo: "21BCS007", name: "Simran Kaur", hostelBlock: "A", roomNo: "103", messType: "VEG" },
    { regNo: "21BCS008", name: "Karan Mehta", hostelBlock: "B", roomNo: "203", messType: "NON_VEG" },
    { regNo: "21BCS009", name: "Sneha Reddy", hostelBlock: "C", roomNo: "303", messType: "VEG" },
    { regNo: "21BCS010", name: "Vikram Singh", hostelBlock: "A", roomNo: "104", messType: "NON_VEG" },
    { regNo: "21BCS011", name: "Pooja Patel", hostelBlock: "B", roomNo: "204", messType: "VEG" },
    { regNo: "21BCS012", name: "Arjun Rao", hostelBlock: "C", roomNo: "304", messType: "NON_VEG" },
    { regNo: "21BCS013", name: "Kavita Joshi", hostelBlock: "D", roomNo: "401", messType: "VEG" },
    { regNo: "21BCS014", name: "Rajesh Kumar", hostelBlock: "D", roomNo: "402", messType: "NON_VEG" },
    { regNo: "21BCS015", name: "Meera Iyer", hostelBlock: "D", roomNo: "403", messType: "VEG" },
];

const seedCollegeData = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Connected to MongoDB");

        const count = await CollegeStudent.countDocuments();
        if (count > 0) {
            console.log("College data already seeded");
            process.exit(0);
        }

        await CollegeStudent.insertMany(collegeStudents);
        console.log("College data seeded successfully");

        process.exit(0);
    } catch (error) {
        console.error("Error seeding college data:", error);
        process.exit(1);
    }
};

seedCollegeData();