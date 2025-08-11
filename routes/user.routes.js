import { Router } from "express";
import { createUser, getAllUsers, getUserById } from "../controllers/user.controller.js";
const routerUser = Router();

routerUser.post("/auth/register", createUser);
routerUser.get("/", getAllUsers);
routerUser.get("/:id", getUserById);

export default routerUser;
