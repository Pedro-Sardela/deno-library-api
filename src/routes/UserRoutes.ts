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

UserRouter.post("/users",controller.create);

UserRouter.get("/users", auth, controller.list);

UserRouter.get("/users/:id", auth, controller.find)

UserRouter.put("/users/:id", auth, controller.update)

UserRouter.delete("/users/:id", auth, controller.remove)

export {UserRouter};