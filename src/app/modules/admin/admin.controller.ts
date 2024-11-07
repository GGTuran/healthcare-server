import { Request, Response } from "express";
import { adminService } from "./admin.service";
import pick from "../../../shared/pick";
import { adminFilterableFields } from "./admin.constant";

const getAll = async (req: Request, res: Response) => {
    try {
        const filters = pick(req.query, adminFilterableFields);
        const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder'])
        const result = await adminService.getAllFromDB(filters, options);
        res.status(200).json({
            success: true,
            message: "Admin's data fetched successfully!!",
            data: result
        })

    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error?.name || "Something went wrong",
            error: error,
        })
    }
}

export const adminController = {
    getAll,
}