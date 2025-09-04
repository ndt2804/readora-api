import { hash, compare } from "bcrypt";
import User from "../models/user.model.js";
import { sendMail } from "./mail.service.js";
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



export const sendVerificationEmail = async (user) => {
    const token = jwt.sign(
        { id: user.id, email: user.email },
        process.env.EMAIL_VERIFY_SECRET || "verifysecret",
        { expiresIn: "30m" }
    );

    const link = `${process.env.CLIENT_URL}/verify?token=${token}`;

    await sendMail(
        user.email,
        "Verify your email",
        `<p>Click vào link để xác thực email:</p>
         <a href="${link}">${link}</a>`
    );
};

// Verify email
export const verifyEmail = async (token) => {
    const payload = jwt.verify(token, process.env.EMAIL_VERIFY_SECRET || "verifysecret");
    await User.update({ isActive: true }, { where: { id: payload.id } });
};

// Gửi mail reset password
export const sendResetPasswordEmail = async (user) => {
    const token = jwt.sign(
        { id: user.id, email: user.email },
        process.env.RESET_PASSWORD_SECRET || "resetsecret",
        { expiresIn: "15m" }
    );

    const link = `${process.env.CLIENT_URL}/reset-password?token=${token}`;

    await sendMail(
        user.email,
        "Reset Password",
        `<p>Click vào link để đặt lại mật khẩu:</p>
         <a href="${link}">${link}</a>`
    );
};

export const forgotPasswordService = async (email) => {
    const user = await User.findOne({ email });
    if (!user) {
        const error = new Error("Không tìm thấy user");
        error.statusCode = 404;
        throw error;
    }

    const resetToken = jwt.sign(
        { id: user._id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: "15m" }
    );

    const resetUrl = `${process.env.CLIENT_URL}/reset-password?token=${resetToken}`;

    const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 8px;">
      <h2 style="color: #333;">🔒 Đặt lại mật khẩu</h2>
      <p>Xin chào <b>${user.fullname}</b>,</p>
      <p>Chúng tôi nhận được yêu cầu đặt lại mật khẩu cho tài khoản của bạn. Nhấn vào nút bên dưới để tiến hành:</p>
      <div style="text-align: center; margin: 20px 0;">
        <a href="${resetUrl}" style="display: inline-block; padding: 12px 20px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 5px; font-weight: bold;">
          Đặt lại mật khẩu
        </a>
      </div>
      <p>Nếu nút không hoạt động, hãy copy link sau và dán vào trình duyệt:</p>
      <p style="word-break: break-all; color: #555;">${resetUrl}</p>
      <p style="margin-top: 30px; color: #888; font-size: 14px;">⏳ Link này chỉ có hiệu lực trong <b>15 phút</b>. Nếu bạn không yêu cầu, hãy bỏ qua email này.</p>
      <hr style="margin: 20px 0;">
      <p style="font-size: 12px; color: #aaa; text-align: center;">© ${new Date().getFullYear()} My App. All rights reserved.</p>
    </div>
  `;

    await sendMail(user.email, "Đặt lại mật khẩu", html);
};
// Reset password
export const resetPassword = async (token, newPassword) => {
    const payload = jwt.verify(token, process.env.RESET_PASSWORD_SECRET || "resetsecret");

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await User.update({ password: hashedPassword }, { where: { id: payload.id } });
};