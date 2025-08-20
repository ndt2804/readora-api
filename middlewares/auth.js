import jwt from "jsonwebtoken";

export const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ message: "Không có token" });

    const token = authHeader.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Token không hợp lệ" });

    try {
        const payload = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET || "accesssecret");
        req.user = payload;
        next();
    } catch {
        return res.status(401).json({ message: "Token hết hạn hoặc không hợp lệ" });
    }
};
