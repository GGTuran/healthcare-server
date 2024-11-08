import { Admin, Prisma, UserStatus } from "@prisma/client"
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

    const total = await prisma.admin.count({
        where: whereConditions
    });

    return {
        meta: {
            page,
            limit,
            total
        },
        data: result
    };
}

const getByIdFromDB = async (id: string): Promise<Admin | null> => {
    const result = await prisma.admin.findUnique({
        where: {
            id,
            isDeleted: false
        }
    })

    return result;
}

const updateIntoDB = async (id: string, data: Partial<Admin>): Promise<Admin> => {

    await prisma.admin.findUniqueOrThrow({
        where: {
            id,
            isDeleted: false
        }
    });

    const result = await prisma.admin.update({
        where: {
            id
        },
        data
    });

    return result;
};

const deleteFromDB = async (id: string): Promise<Admin | null> => {
    await prisma.admin.findUniqueOrThrow({
        where: {
            id
        }
    });

    const result = await prisma.$transaction(async (transactionClient) => {
        const adminDeleted = await transactionClient.admin.delete({
            where: {
                id
            }
        });

        await transactionClient.user.delete({
            where: {
                email: adminDeleted.email
            }
        })
        return adminDeleted;
    });

    return result;
}

const softDeleteFromDB = async (id: string): Promise<Admin | null> => {
    await prisma.admin.findUniqueOrThrow({
        where: {
            id,
            isDeleted: false
        }

    })
    const result = await prisma.$transaction(async (transactionClient) => {
        const adminDeleted = await transactionClient.admin.update({
            where: {
                id
            },
            data: {
                isDeleted: true
            }
        });

        await transactionClient.user.update({
            where: {
                email: adminDeleted.email
            },
            data: {
                status: UserStatus.DELETED
            }
        });

        return adminDeleted;
    });

    return result;
}

export const adminService = {
    getAllFromDB,
    getByIdFromDB,
    updateIntoDB,
    deleteFromDB,
    softDeleteFromDB
};