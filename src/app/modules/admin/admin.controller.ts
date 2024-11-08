import { NextFunction, Request, Response } from "express";
import { adminService } from "./admin.service";
import pick from "../../../shared/pick";
import { adminFilterableFields } from "./admin.constant";
import sendResponse from "../../../shared/sendResponse";

const getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const filters = pick(req.query, adminFilterableFields);
        const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder'])
        const result = await adminService.getAllFromDB(filters, options);

        sendResponse(res, {
            statusCode: 200,
            success: true,
            message: "Admin data fetched",
            meta: result.meta,
            data: result.data
        })

    } catch (error: any) {
        next(error)
    }
}

const getById = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    try {
        const result = await adminService.getByIdFromDB(id);

        sendResponse(res, {
            statusCode: 200,
            success: true,
            message: "Admin data fetched",
            data: result
        })
    } catch (error) {
        next(error)
    }
}

const update = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    try {
        const result = await adminService.updateIntoDB(id, req.body);

        sendResponse(res, {
            statusCode: 200,
            success: true,
            message: "Admin data updated",
            data: result
        })
    } catch (error) {
        next(error)
    }
}

const deleteAdmin = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    try {
        const result = await adminService.deleteFromDB(id);

        sendResponse(res, {
            statusCode: 200,
            success: true,
            message: "Admin data deleted",
            data: result
        })
    } catch (error) {
        next(error)
    }
}

const softDelete = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    try {
        const result = await adminService.softDeleteFromDB(id);

        sendResponse(res, {
            statusCode: 200,
            success: true,
            message: "Admin data deleted",
            data: result
        })
    } catch (error) {
        next(error)
    }
}

export const adminController = {
    getAll,
    getById,
    update,
    deleteAdmin,
    softDelete
}