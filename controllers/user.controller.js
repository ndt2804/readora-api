import { forgotPasswordService, createUserService, getAllUsersService, getUserByIdService, loginService, refreshTokenService, logoutService, sendVerificationEmail, verifyEmail, sendResetPasswordEmail, resetPassword } from "../services/user.service.js";
import { createUserSchema } from "../validations/user.validation.js";
import User from "../models/user.model.js";
export const createUser = async (req, res, next) => {
    try {
        const { error } = createUserSchema.validate(req.body, { abortEarly: false });
        if (error) {
            return res.status(400).json({
                success: false,
                message: "Dữ liệu không hợp lệ",
                errors: error.details.map(err => ({
                    field: err.context.key,
                    message: err.message
                })),
            });
        }

        const user = await createUserService(req.body);
        await sendVerificationEmail(user);
        res.status(201).json({
            success: true,
            message: "Tạo người dùng thành công",
            data: user,
        });
    } catch (err) {
        next(err);
    }
};
export const loginUser = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const result = await loginService({ email, password });
        res.json({ success: true, ...result });
    } catch (err) {
        next(err);
    }
};

export const refreshToken = async (req, res, next) => {
    try {
        const { refreshToken } = req.body;
        const tokens = await refreshTokenService(refreshToken);
        res.json({ success: true, ...tokens });
    } catch (err) {
        next(err);
    }
};

export const logoutUser = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        await logoutService(token);
        res.json({ success: true, message: "Đăng xuất thành công" });
    } catch (err) {
        next(err);
    }
};
export const getAllUsers = async (req, res, next) => {
    try {
        const users = await getAllUsersService();
        res.status(200).json({
            success: true,
            message: "Lấy danh sách người dùng thành công",
            data: users,
        });
    } catch (err) {
        next(err);
    }
};

export const getUserById = async (req, res, next) => {
    try {
        const user = await getUserByIdService(req.params.id);
        res.status(200).json({
            success: true,
            message: "Lấy thông tin người dùng thành công",
            data: user,
        });
    } catch (err) {
        next(err);
    }
};


export const verifyEmailController = async (req, res) => {
    try {
        const { token } = req.query;
        await verifyEmail(token);
        res.json({ message: "Xác thực email thành công" });
    } catch (err) {
        res.status(400).json({ message: "Token không hợp lệ hoặc đã hết hạn" });
    }
};

export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const result = await forgotPasswordService(email);
        res.json(result);
    } catch (err) {
        res.status(404).json({ message: err.message });
    }
};

export const resetPasswordController = async (req, res) => {
    try {
        const { token, newPassword } = req.body;
        await resetPassword(token, newPassword);
        res.json({ message: "Đổi mật khẩu thành công" });
    } catch (err) {
        res.status(400).json({ message: "Token không hợp lệ hoặc đã hết hạn" });
    }
};