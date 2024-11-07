import { PrismaClient, UserRole } from "@prisma/client";
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const createAdminIntoDB = async (payload: any) => {
    //hash the password
    const hashedPassword: string = await bcrypt.hash(payload.password, 10);

    const userData = {
        email: payload.admin.email,
        password: hashedPassword,
        role: UserRole.ADMIN,
    };

    const result = await prisma.$transaction(async (transactionClient) => {
        await transactionClient.user.create({
            data: userData
        });

        const adminData = await transactionClient.admin.create({
            data: payload.admin
        });
        return adminData;

    })

    return result;
}

export const userService = {
    createAdminIntoDB,
}