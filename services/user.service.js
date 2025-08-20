import { hash, compare } from "bcrypt";
import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
export const createUserService = async (userData) => {
    const { username, email, password } = userData;

    // Kiểm tra tồn tại username, email
    if (await User.findOne({ username })) {
        const error = new Error("Username đã được sử dụng");
        error.statusCode = 400;
        throw error;
    }
    if (await User.findOne({ email })) {
        const error = new Error("Email đã được sử dụng");
        error.statusCode = 400;
        throw error;
    }

    // Hash password
    const hashedPassword = await hash(password, 10);

    const user = new User({
        ...userData,
        password: hashedPassword,
    });

    const savedUser = await user.save();

    // Query lại user đã lưu (mặc định password ẩn)
    const userWithoutPassword = await User.findById(savedUser._id);
    return userWithoutPassword;
};

export const loginService = async ({ email, password }) => {
    const user = await User.findOne({ email }).select("+password +refreshTokens");
    if (!user) {
        const error = new Error("Email hoặc mật khẩu không đúng");
        error.statusCode = 401;
        throw error;
    }

    const isMatch = await compare(password, user.password);
    if (!isMatch) {
        const error = new Error("Email hoặc mật khẩu không đúng");
        error.statusCode = 401;
        throw error;
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    user.refreshTokens.push(refreshToken);
    await user.save();

    const userObj = user.toObject();
    delete userObj.password;
    delete userObj.refreshTokens;

    return {
        user: userObj,
        accessToken,
        refreshToken,
    };
};

export const refreshTokenService = async (token) => {
    if (!token) {
        const error = new Error("Refresh token không được cung cấp");
        error.statusCode = 401;
        throw error;
    }

    let payload;
    try {
        payload = jwt.verify(token, REFRESH_TOKEN_SECRET);
    } catch {
        const error = new Error("Refresh token không hợp lệ hoặc đã hết hạn");
        error.statusCode = 401;
        throw error;
    }

    const user = await User.findById(payload.userId).select("+refreshTokens");
    if (!user || !user.refreshTokens.includes(token)) {
        const error = new Error("Refresh token không hợp lệ");
        error.statusCode = 401;
        throw error;
    }

    const accessToken = generateAccessToken(user);
    const newRefreshToken = generateRefreshToken(user);

    user.refreshTokens = user.refreshTokens.filter(rt => rt !== token);
    user.refreshTokens.push(newRefreshToken);
    await user.save();

    return { accessToken, refreshToken: newRefreshToken };
};
export const logoutService = async (token) => {
    if (!token) return;

    const payload = jwt.decode(token);
    if (!payload) return;

    const user = await User.findById(payload.userId).select("+refreshTokens");
    if (!user) return;

    user.refreshTokens = user.refreshTokens.filter(rt => rt !== token);
    await user.save();
};
export const getUserByIdService = async (id) => {
    const user = await User.findById(id);
    if (!user) {
        const error = new Error("Không tìm thấy người dùng");
        error.statusCode = 404;
        throw error;
    }
    return user;
};

export const getAllUsersService = async () => {
    return await User.find();
};

const generateAccessToken = (user) => {
    return jwt.sign(
        { userId: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "15m" }
    );
};

// Tạo refresh token (expire lâu hơn, ví dụ 7 ngày)
const generateRefreshToken = (user) => {
    return jwt.sign(
        { userId: user._id, role: user.role },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: "7d" }
    );
};
