import Complaint from "./complaint.model.js";
import Worker from "../workers/worker.model.js";
import User from "../../models/user.model.js";
import ApiError from "../../common/utils/api-error.js";
import { sendComplaintNotification } from "../../common/config/email.js";

const createComplaint = async ({
    studentId,
    regNo,
    type,
    category,
    description,
    block,
    roomNo,
}) => {
    // Validate input
    if (!studentId || !regNo || !type || !category || !description || !block || !roomNo) {
        throw ApiError.badRequest("All fields are required");
    }

    // Find available workers for this category and block
    const availableWorkers = await Worker.find({
        category,
        block,
        isActive: true,
    });

    let status = "PENDING";
    let assignedWorker = null;

    // Auto-assign if only one worker available
    if (availableWorkers.length === 1) {
        status = "ASSIGNED";
        assignedWorker = {
            workerId: availableWorkers[0]._id,
            name: availableWorkers[0].name,
            email: availableWorkers[0].email,
            phone: availableWorkers[0].phone,
        };

        // Send notification email
        try {
            await sendComplaintNotification(
                availableWorkers[0].email,
                `New ${category} complaint assigned`,
                `Complaint details: ${description}\nBlock: ${block}\nRoom: ${roomNo}`
            );
        } catch (error) {
            console.error("Failed to send notification:", error);
        }
    }

    // Create complaint
    const complaint = await Complaint.create({
        studentId,
        regNo,
        type,
        category,
        description,
        status,
        block,
        roomNo,
        assignedWorker,
        logs: [
            {
                oldStatus: null,
                newStatus: status,
                changedBy: studentId,
                timestamp: new Date(),
            },
        ],
    });

    return {
        success: true,
        complaintId: complaint._id,
        status,
        assignedWorker: assignedWorker ? assignedWorker.name : null,
    };
};

const assignWorker = async ({ complaintId, workerId, adminId }) => {
    // Find complaint
    const complaint = await Complaint.findById(complaintId);
    if (!complaint) {
        throw ApiError.notFound("Complaint not found");
    }

    // Find worker
    const worker = await Worker.findById(workerId);
    if (!worker) {
        throw ApiError.notFound("Worker not found");
    }

    // Check if worker is active and matches category/block
    if (!worker.isActive || worker.category !== complaint.category || worker.block !== complaint.block) {
        throw ApiError.badRequest("Invalid worker assignment");
    }

    // Update complaint
    const oldStatus = complaint.status;
    complaint.status = "ASSIGNED";
    complaint.assignedWorker = {
        workerId: worker._id,
        name: worker.name,
        email: worker.email,
        phone: worker.phone,
    };
    complaint.logs.push({
        oldStatus,
        newStatus: "ASSIGNED",
        changedBy: adminId,
        timestamp: new Date(),
    });

    await complaint.save();

    // Send notification
    try {
        await sendComplaintNotification(
            worker.email,
            `Complaint assigned to you`,
            `Complaint ID: ${complaintId}\nDescription: ${complaint.description}\nBlock: ${complaint.block}\nRoom: ${complaint.roomNo}`
        );
    } catch (error) {
        console.error("Failed to send notification:", error);
    }

    return { success: true };
};

const updateComplaintStatus = async ({ complaintId, status, studentId }) => {
    // Find complaint
    const complaint = await Complaint.findById(complaintId);
    if (!complaint) {
        throw ApiError.notFound("Complaint not found");
    }

    // Verify ownership
    if (complaint.studentId.toString() !== studentId.toString()) {
        throw ApiError.forbidden("You can only update your own complaints");
    }

    // Validate status
    if (!["RESOLVED", "UNRESOLVED"].includes(status)) {
        throw ApiError.badRequest("Invalid status");
    }

    // Update complaint
    const oldStatus = complaint.status;
    complaint.status = status;
    complaint.logs.push({
        oldStatus,
        newStatus: status,
        changedBy: studentId,
        timestamp: new Date(),
    });

    if (status === "RESOLVED") {
        complaint.resolvedAt = new Date();
    }

    await complaint.save();

    return { success: true };
};

const getStudentComplaints = async (studentId) => {
    const complaints = await Complaint.find({ studentId })
        .sort({ createdAt: -1 })
        .populate("assignedWorker.workerId", "name email phone");

    return complaints;
};

const getAdminComplaints = async (adminBlock) => {
    const complaints = await Complaint.find({ block: adminBlock })
        .sort({ createdAt: -1 })
        .populate("studentId", "name regNo")
        .populate("assignedWorker.workerId", "name email phone");

    return complaints;
};

const getAllComplaints = async () => {
    const complaints = await Complaint.find({})
        .sort({ createdAt: -1 })
        .populate("studentId", "name regNo")
        .populate("assignedWorker.workerId", "name email phone");

    return complaints;
};

export {
    createComplaint,
    assignWorker,
    updateComplaintStatus,
    getStudentComplaints,
    getAdminComplaints,
    getAllComplaints,
};