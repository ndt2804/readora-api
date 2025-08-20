import { Router } from "express";
import { createUser, loginUser, refreshToken, logoutUser, getAllUsers, getUserById } from "../controllers/user.controller.js";
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
routerUser.post("/auth/register", createUser);
routerUser.post("/auth/login", loginUser);
routerUser.post("/auth/refresh-token", refreshToken);
routerUser.post("/auth/logout", logoutUser);
routerUser.get("/user", getAllUsers);
routerUser.get("/:id", getUserById);

export default routerUser;
