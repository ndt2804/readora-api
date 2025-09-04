import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const authMiddleware = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Không có token" });
    }

    const token = authHeader.split(" ")[1];
    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(payload.userId).select("-password -refreshTokens");
        if (!user) return res.status(401).json({ message: "Người dùng không tồn tại" });

        req.user = user;
        next();
    } catch {
        return res.status(401).json({ message: "Token hết hạn hoặc không hợp lệ" });
    }
};

export const authorizeRole = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ message: "Không có quyền truy cập" });
        }
        next();
    };
};