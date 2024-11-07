import { Prisma } from "@prisma/client"
import prisma from "../../../shared/prisma"
import { calculatePagination } from "../../../helpers/pagination"
import { adminSearchAbleFields } from "./admin.constant";


const getAllFromDB = async (params: any, options: any) => {
    const { searchTerm, ...filterData } = params;
    const { page, limit, skip, sortBy, sortOrder } = calculatePagination(options)
    const andConditions: Prisma.AdminWhereInput[] = []

    if (params.searchTerm) {
        andConditions.push({
            OR: adminSearchAbleFields.map((field) => ({
                [field]: {
                    contains: params.searchTerm,
                    mode: 'insensitive'
                }
            }))
        })
    };

    if (Object.keys(filterData).length > 0) {
        andConditions.push({
            AND: Object.keys(filterData).map(key => ({
                [key]: {
                    equals: filterData[key]
                }
            }))
        })
    }

    const whereConditions: Prisma.AdminWhereInput = { AND: andConditions }

    const result = await prisma.admin.findMany({
        where: whereConditions,
        skip,
        take: limit,
        orderBy: options.sortBy && options.sortOrder ? {
            [options.sortBy]: options.sortOrder
        } : {
            createdAt: 'desc'
        }
    })

    return result;
}

export const adminService = {
    getAllFromDB,
};