import Movement from "./movement.model.js";
import ApiError from "../../common/utils/api-error.js";

const createMovementRequest = async (movementData) => {
    const {
        studentId,
        regNo,
        type,
        reason,
        requestedOutTime,
        expectedReturnTime,
        block,
        roomNo,
    } = movementData;

    // Validate input
    if (!studentId || !regNo || !type || !reason || !requestedOutTime || !expectedReturnTime || !block || !roomNo) {
        throw ApiError.badRequest("All fields are required");
    }

    // Validate times
    const outTime = new Date(requestedOutTime);
    const returnTime = new Date(expectedReturnTime);

    if (outTime >= returnTime) {
        throw ApiError.badRequest("Return time must be after out time");
    }

    if (outTime <= new Date()) {
        throw ApiError.badRequest("Out time must be in the future");
    }

    const movement = await Movement.create({
        studentId,
        regNo,
        type,
        reason,
        requestedOutTime: outTime,
        expectedReturnTime: returnTime,
        block,
        roomNo,
    });

    return movement;
};

const approveMovementRequest = async (movementId, adminId) => {
    const movement = await Movement.findById(movementId);
    if (!movement) {
        throw ApiError.notFound("Movement request not found");
    }

    if (movement.status !== "PENDING") {
        throw ApiError.badRequest("Request has already been processed");
    }

    movement.status = "APPROVED";
    movement.approvedBy = adminId;
    await movement.save();

    return movement;
};

const rejectMovementRequest = async (movementId, adminId) => {
    const movement = await Movement.findById(movementId);
    if (!movement) {
        throw ApiError.notFound("Movement request not found");
    }

    if (movement.status !== "PENDING") {
        throw ApiError.badRequest("Request has already been processed");
    }

    movement.status = "REJECTED";
    movement.approvedBy = adminId;
    await movement.save();

    return movement;
};

const updateReturnTime = async (movementId, actualReturnTime, adminId) => {
    const movement = await Movement.findById(movementId);
    if (!movement) {
        throw ApiError.notFound("Movement request not found");
    }

    if (movement.status !== "APPROVED") {
        throw ApiError.badRequest("Only approved requests can have return time updated");
    }

    movement.actualReturnTime = new Date(actualReturnTime);
    await movement.save();

    return movement;
};

const getStudentMovements = async (studentId) => {
    const movements = await Movement.find({ studentId })
        .sort({ createdAt: -1 })
        .populate("approvedBy", "name");

    return movements;
};

const getAdminMovements = async (adminBlock) => {
    const movements = await Movement.find({ block: adminBlock })
        .sort({ createdAt: -1 })
        .populate("studentId", "name regNo")
        .populate("approvedBy", "name");

    return movements;
};

const getAllMovements = async () => {
    const movements = await Movement.find({})
        .sort({ createdAt: -1 })
        .populate("studentId", "name regNo")
        .populate("approvedBy", "name");

    return movements;
};

export {
    createMovementRequest,
    approveMovementRequest,
    rejectMovementRequest,
    updateReturnTime,
    getStudentMovements,
    getAdminMovements,
    getAllMovements,
};