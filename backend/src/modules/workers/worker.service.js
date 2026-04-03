import Worker from "./worker.model.js";
import ApiError from "../../common/utils/api-error.js";

const createWorker = async (workerData) => {
    const { name, category, block, email, phone } = workerData;

    // Check if worker with same email already exists
    const existingWorker = await Worker.findOne({ email });
    if (existingWorker) {
        throw ApiError.conflict("Worker with this email already exists");
    }

    const worker = await Worker.create({
        name,
        category,
        block,
        email,
        phone,
    });

    return worker;
};

const getWorkers = async (filters = {}) => {
    const query = { ...filters };
    const workers = await Worker.find(query).sort({ createdAt: -1 });
    return workers;
};

const getWorkerById = async (workerId) => {
    const worker = await Worker.findById(workerId);
    if (!worker) {
        throw ApiError.notFound("Worker not found");
    }
    return worker;
};

const updateWorker = async (workerId, updateData) => {
    const worker = await Worker.findByIdAndUpdate(
        workerId,
        updateData,
        { new: true, runValidators: true }
    );

    if (!worker) {
        throw ApiError.notFound("Worker not found");
    }

    return worker;
};

const deleteWorker = async (workerId) => {
    const worker = await Worker.findByIdAndDelete(workerId);
    if (!worker) {
        throw ApiError.notFound("Worker not found");
    }
    return { success: true };
};

const getWorkersByCategoryAndBlock = async (category, block) => {
    const workers = await Worker.find({
        category,
        block,
        isActive: true,
    });
    return workers;
};

export {
    createWorker,
    getWorkers,
    getWorkerById,
    updateWorker,
    deleteWorker,
    getWorkersByCategoryAndBlock,
};