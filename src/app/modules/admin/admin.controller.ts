import { NextFunction, Request, Response } from "express";
import { adminService } from "./admin.service";
import pick from "../../../shared/pick";
import { adminFilterableFields } from "./admin.constant";
import sendResponse from "../../../shared/sendResponse";
import catchAsync from "../../../helpers/catchAsync";

const getAll = catchAsync(async (req: Request, res: Response) => {
    // console.log(req.query)
    const filters = pick(req.query, adminFilterableFields);
    const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder'])
    console.log(options)
    const result = await adminService.getAllFromDB(filters, options)

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Admin data fetched!",
        meta: result.meta,
        data: result.data
    })
})

const getById = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;

    const result = await adminService.getByIdFromDB(id);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Admin data fetched by id!",
        data: result
    });
})


const update = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;

    const result = await adminService.updateIntoDB(id, req.body);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Admin data updated!",
        data: result
    })
})

const deleteAdmin = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;

    const result = await adminService.deleteFromDB(id);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Admin data deleted!",
        data: result
    })
})


const softDelete = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;

    const result = await adminService.softDeleteFromDB(id);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Admin data deleted!",
        data: result
    })
});

export const adminController = {
    getAll,
    getById,
    update,
    deleteAdmin,
    softDelete
}