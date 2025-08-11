import { hash } from "bcrypt";
import User from "../models/user.model.js";

export const createUserService = async (userData) => {
    const { username, email, password } = userData;

    // Kiểm tra username đã tồn tại
    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
        const error = new Error("Username đã được sử dụng");
        error.statusCode = 400;
        throw error;
    }

    // Kiểm tra email đã tồn tại
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
        const error = new Error("Email đã được sử dụng");
        error.statusCode = 400;
        throw error;
    }

    // Hash password
    const hashedPassword = await hash(password, 10);

    const user = new User({
        ...userData,
        password: hashedPassword
    });

    return await user.save();
};

export const getAllUsersService = async () => {
    return await User.find().select("-password");
};

export const getUserByIdService = async (id) => {
    const user = await User.findById(id).select("-password");
    if (!user) {
        const error = new Error("Không tìm thấy người dùng");
        error.statusCode = 404;
        throw error;
    }
    return user;
};
