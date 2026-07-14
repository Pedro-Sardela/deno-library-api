import { Router } from 'express';
import { UserController } from "../controllers/UserController.ts";


const UserRouter = Router();

const controller = new UserController();

UserRouter.post("/users",controller.create);

UserRouter.get("/users",controller.list);

UserRouter.get("/users/:id",controller.find)

UserRouter.put("/users/:id",controller.update)

UserRouter.delete("/users/:id",controller.remove)

export {UserRouter};