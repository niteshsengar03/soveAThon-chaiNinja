import * as movementService from "./movement.service.js";
import ApiResponse from "../../common/utils/api-response.js";

const createMovementRequest = async (req, res) => {
    const movementData = {
        studentId: req.user.id,
        regNo: req.user.regNo,
        type: req.body.type,
        reason: req.body.reason,
        requestedOutTime: req.body.requestedOutTime,
        expectedReturnTime: req.body.expectedReturnTime,
        block: req.user.hostelBlock,
        roomNo: req.body.roomNo,
    };

    const movement = await movementService.createMovementRequest(movementData);
    ApiResponse.created(res, "Movement request created successfully", { movement });
};

const approveMovementRequest = async (req, res) => {
    const movement = await movementService.approveMovementRequest(
        req.params.id,
        req.user.id
    );
    ApiResponse.ok(res, "Movement request approved successfully", { movement });
};

const rejectMovementRequest = async (req, res) => {
    const movement = await movementService.rejectMovementRequest(
        req.params.id,
        req.user.id
    );
    ApiResponse.ok(res, "Movement request rejected successfully", { movement });
};

const updateReturnTime = async (req, res) => {
    const { actualReturnTime } = req.body;
    const movement = await movementService.updateReturnTime(
        req.params.id,
        actualReturnTime,
        req.user.id
    );
    ApiResponse.ok(res, "Return time updated successfully", { movement });
};

const getMyMovements = async (req, res) => {
    const movements = await movementService.getStudentMovements(req.user.id);
    ApiResponse.ok(res, "Movements retrieved successfully", { movements });
};

const getAdminMovements = async (req, res) => {
    const movements = await movementService.getAdminMovements(req.user.hostelBlock);
    ApiResponse.ok(res, "Movements retrieved successfully", { movements });
};

const getAllMovements = async (req, res) => {
    const movements = await movementService.getAllMovements();
    ApiResponse.ok(res, "All movements retrieved successfully", { movements });
};

export {
    createMovementRequest,
    approveMovementRequest,
    rejectMovementRequest,
    updateReturnTime,
    getMyMovements,
    getAdminMovements,
    getAllMovements,
};