import { Router } from "express";
import { authMiddleware, authorizeRole } from "../middlewares/auth.js";
import { createUser, loginUser, refreshToken, logoutUser, getAllUsers, getUserById, verifyEmailController, forgotPassword, resetPasswordController } from "../controllers/user.controller.js";
const routerUser = Router();

/**
 * @openapi
 * /api/users/auth/register:
 *   post:
 *     summary: Đăng ký user mới
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: Tạo user thành công
 */
/**
 * 
 * 
 * Auth routes (public)
 */
routerUser.post("/auth/register", createUser);
routerUser.post("/auth/login", loginUser);
routerUser.post("/auth/refresh-token", refreshToken);
routerUser.post("/auth/logout", logoutUser);

/**
 * User routes (protected)
 */
routerUser.get("/users", authMiddleware, authorizeRole("admin"), getAllUsers);
routerUser.get("/users/:id", authMiddleware, getUserById);

// Verify email
routerUser.get("/verify", verifyEmailController);

// Quên mật khẩu
routerUser.post("/forgot-password", forgotPassword);

// Reset mật khẩu
routerUser.post("/reset-password", resetPasswordController);
export default routerUser;
