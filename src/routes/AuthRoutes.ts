import { Router } from "express";
import { AuthController } from "../controllers/AuthController.ts";

const AuthRouter = Router();

const controller =
	new AuthController();


/**
 * @openapi
 * /login:
 *  post:
 *      description: Autentica um usuário e devolve um Bearer Token
 *      responses:
 *          200:
 *              description: Login realizado
 *          400:
 *              description: 
 * 					Caso 1: Email ou senha faltantes
 * 					Caso 2: Email ou senha inválidos
 */
AuthRouter.post(
	"/login",
	controller.login
);

export { AuthRouter };