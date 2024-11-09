import { UserStatus } from "@prisma/client"
import prisma from "../../../shared/prisma"
import * as bcrypt from 'bcrypt'
import { jwtHelpers } from "../../../helpers/jwtHelpers";

const loginUser = async (payload: { email: string, password: string }) => {
    const userData = await prisma.user.findUniqueOrThrow({
        where: {
            email: payload.email,
            status: UserStatus.ACTIVE
        }
    });

    const isCorrect: boolean = await bcrypt.compare(payload.password, userData.password);

    if (!isCorrect) {
        throw new Error("Incorrect password!!")
    }

    const accessToken = jwtHelpers.generateToken({
        email: userData.email,
        role: userData.role
    },
        "abcdefg",
        "5m"

    );

    const refreshToken = jwtHelpers.generateToken({
        email: userData.email,
        role: userData.role
    },
        "abcedfghr",
        "30d"
    );

    return {
        accessToken,
        refreshToken,
        needsPasswordChange: userData.needPasswordChange
    };
};

const refreshToken = async (token: string) => {
    let decodedData;
    try {
        decodedData = jwtHelpers.verifyToken(token, "abcedfghr");
    } catch (error) {
        throw new Error("You are not authorized!")
    }

    const userData = await prisma.user.findUniqueOrThrow({
        where: {
            email: decodedData.email,
            status: UserStatus.ACTIVE
        }
    });

    const accessToken = jwtHelpers.generateToken({
        email: userData.email,
        role: userData.role
    },
        "abcdefg",
        "5m"
    );

    return {
        accessToken,
        needPasswordChange: userData.needPasswordChange
    }

}

export const authService = {
    loginUser,
    refreshToken,
}