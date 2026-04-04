import * as workerService from "./worker.service.js";
import ApiResponse from "../../common/utils/api-response.js";
import ApiError from "../../common/utils/api-error.js";

const createWorker = async (req, res, next) => {
    try {
        const worker = await workerService.createWorker(req.body);
        ApiResponse.created(res, "Worker created successfully", { worker });
    } catch (error) {
        next(error);
    }
};

const getWorkers = async (req, res, next) => {
    try {
        const filters = req.query;
        const workers = await workerService.getWorkers(filters);
        ApiResponse.ok(res, "Workers retrieved successfully", { workers });
    } catch (error) {
        next(error);
    }
};

const getWorkerById = async (req, res, next) => {
    try {
        const worker = await workerService.getWorkerById(req.params.id);
        ApiResponse.ok(res, "Worker retrieved successfully", { worker });
    } catch (error) {
        next(error);
    }
};

const updateWorker = async (req, res, next) => {
    try {
        const worker = await workerService.updateWorker(req.params.id, req.body);
        ApiResponse.ok(res, "Worker updated successfully", { worker });
    } catch (error) {
        next(error);
    }
};

const deleteWorker = async (req, res, next) => {
    try {
        const result = await workerService.deleteWorker(req.params.id);
        ApiResponse.ok(res, "Worker deleted successfully", result);
    } catch (error) {
        next(error);
    }
};

export {
    createWorker,
    getWorkers,
    getWorkerById,
    updateWorker,
    deleteWorker,
};