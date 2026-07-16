import { Router } from 'express';
import { UserController } from "../controllers/UserController.ts";
import { auth } from "../middlewares/AuthMiddle.ts";
import { UserRepository } from "../models/User/UserRepository.ts";
import { BorrowRepository } from "../models/Borrow/BorrowRepository.ts";
import { UserService } from "../services/UserService.ts";
import { UserRules } from "../models/User/UserRules.ts";


const userRepo = new UserRepository();
const borrowRepo = new BorrowRepository();
const userService = new UserService(userRepo, borrowRepo);
const userRules = new UserRules();

const controller = new UserController(userService, userRules);

const UserRouter = Router();

/**
 * @openapi
 * /users:
 *  post:
 *      description: Cria um usuário
 *      responses:
 *          201:
 *              description: Usuário criado
 *          409:
 *              description: Email já cadastrado no sistema
 *          422:
 *              description: Campo faltante
 */
UserRouter.post("/users",controller.create);

/**
 * @openapi
 * /users:
 *  get:
 *      description: Retorna todos os usuários cadastrados
 *      responses:
 *          200:
 *              description: Usuários listados
 *          401:
 *              description: Sem autorização
 *          404:
 *              description: Sem usuários a serem listados
 */
UserRouter.get("/users", auth, controller.list);

/**
 * @openapi
 * /users/:id:
 *  get:
 *      description: Retorna um usuário -> busca por ID
 *      responses:
 *          200:
 *              description: Usuários encontrado
 *          401:
 *              description: Sem autorização
 *          404:
 *              description: Usuário não encontrado
 *          422:
 *              description: ID fornecido em formato inválido
 */
UserRouter.get("/users/:id", auth, controller.find)

/**
 * @openapi
 * /users/:id:
 *  put:
 *      description: Atualiza um usuário -> Busca por ID
 *      responses:
 *          200:
 *              description: Usuário atualizado
 *          401:
 *              description: Sem autorização
 *          404:
 *              description: Usuário não encontrado
 *          422:
 *              description: ID fornecido em formato inválido
 */
UserRouter.put("/users/:id", auth, controller.update)

/**
 * @openapi
 * /users/:id:
 *  delete:
 *      description: Remove um usuário -> Busca por ID
 *      responses:
 *          200:
 *              description: Usuário removido
 *          401:
 *              description: Sem autorização
 *          404:
 *              description: Usuário não encontrado
 *          422:
 *              description: ID fornecido em formato inválido
 */
UserRouter.delete("/users/:id", auth, controller.remove)

export {UserRouter};