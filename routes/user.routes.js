import { Router } from "express";
import { createUser, loginUser, refreshToken, logoutUser, getAllUsers, getUserById } from "../controllers/user.controller.js";
const routerUser = Router();

routerUser.post("/auth/register", createUser);
routerUser.post("/auth/login", loginUser);
routerUser.post("/auth/refresh-token", refreshToken);
routerUser.post("/auth/logout", logoutUser);
routerUser.get("/", getAllUsers);
routerUser.get("/:id", getUserById);

export default routerUser;
