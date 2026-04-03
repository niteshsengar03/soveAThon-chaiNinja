import * as workerService from "./worker.service.js";
import ApiResponse from "../../common/utils/api-response.js";

const createWorker = async (req, res) => {
    const worker = await workerService.createWorker(req.body);
    ApiResponse.created(res, "Worker created successfully", { worker });
};

const getWorkers = async (req, res) => {
    const filters = req.query;
    const workers = await workerService.getWorkers(filters);
    ApiResponse.ok(res, "Workers retrieved successfully", { workers });
};

const getWorkerById = async (req, res) => {
    const worker = await workerService.getWorkerById(req.params.id);
    ApiResponse.ok(res, "Worker retrieved successfully", { worker });
};

const updateWorker = async (req, res) => {
    const worker = await workerService.updateWorker(req.params.id, req.body);
    ApiResponse.ok(res, "Worker updated successfully", { worker });
};

const deleteWorker = async (req, res) => {
    const result = await workerService.deleteWorker(req.params.id);
    ApiResponse.ok(res, "Worker deleted successfully", result);
};

export {
    createWorker,
    getWorkers,
    getWorkerById,
    updateWorker,
    deleteWorker,
};