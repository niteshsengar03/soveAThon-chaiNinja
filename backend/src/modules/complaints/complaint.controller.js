import * as complaintService from "./complaint.service.js";
import ApiResponse from "../../common/utils/api-response.js";

const createComplaint = async (req, res) => {
    const complaintData = {
        studentId: req.user.id,
        regNo: req.user.regNo,
        type: req.body.type,
        category: req.body.category,
        description: req.body.description,
        block: req.user.hostelBlock,
        roomNo: req.body.roomNo,
    };

    const result = await complaintService.createComplaint(complaintData);
    ApiResponse.created(res, "Complaint created successfully", result);
};

const assignWorker = async (req, res) => {
    const { workerId } = req.body;
    const result = await complaintService.assignWorker({
        complaintId: req.params.id,
        workerId,
        adminId: req.user.id,
    });

    ApiResponse.ok(res, "Worker assigned successfully", result);
};

const updateComplaintStatus = async (req, res) => {
    const { status } = req.body;
    const result = await complaintService.updateComplaintStatus({
        complaintId: req.params.id,
        status,
        studentId: req.user.id,
    });

    ApiResponse.ok(res, "Complaint status updated successfully", result);
};

const getMyComplaints = async (req, res) => {
    const complaints = await complaintService.getStudentComplaints(req.user.id);
    ApiResponse.ok(res, "Complaints retrieved successfully", { complaints });
};

const getAdminComplaints = async (req, res) => {
    const complaints = await complaintService.getAdminComplaints(req.user.hostelBlock);
    ApiResponse.ok(res, "Complaints retrieved successfully", { complaints });
};

const getAllComplaints = async (req, res) => {
    const complaints = await complaintService.getAllComplaints();
    ApiResponse.ok(res, "All complaints retrieved successfully", { complaints });
};

export {
    createComplaint,
    assignWorker,
    updateComplaintStatus,
    getMyComplaints,
    getAdminComplaints,
    getAllComplaints,
};