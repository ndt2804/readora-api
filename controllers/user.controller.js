import { createUserService, getAllUsersService, getUserByIdService } from "../services/user.service.js";
import { createUserSchema } from "../validations/user.validation.js";

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
                }))
            });
        }

        const user = await createUserService(req.body);

        res.status(201).json({
            success: true,
            message: "Tạo người dùng thành công",
            data: {
                id: user._id,
                fullname: user.fullname,
                username: user.username,
                email: user.email,
                avatar: user.avatar,
                bio: user.bio,
                role: user.role,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt
            }
        });
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
            data: users
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
            data: user
        });
    } catch (err) {
        next(err);
    }
};
