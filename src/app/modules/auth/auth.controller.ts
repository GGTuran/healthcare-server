import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import { authService } from "./auth.service";
import sendResponse from "../../../shared/sendResponse";

const loginUser = catchAsync(async (req: Request, res: Response) => {
    const result = await authService.loginUser(req.body);

    const { refreshToken } = result;

    res.cookie('refreshToken', refreshToken, {
        secure: false,
        httpOnly: true
    });

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Logged in successfully!",
        data: {
            accessToken: result.accessToken,
            needPasswordChange: result.needsPasswordChange
        }
    })
});

const refreshToken = catchAsync(async (req: Request, res: Response) => {
    const { refreshToken } = req.cookies;

    const result = await authService.refreshToken(refreshToken);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Logged in successfully!",
        data: result

    })
});

export const authController = {
    loginUser,
    refreshToken
}