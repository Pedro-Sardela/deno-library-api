import { Router } from "express";
import { AuthController } from "../controllers/AuthController.ts";

const AuthRouter = Router();

const controller =
	new AuthController();

AuthRouter.post(
	"/login",
	controller.login
);

export { AuthRouter };