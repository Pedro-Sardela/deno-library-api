import { Router } from 'express';
import { UserController } from "../controllers/UserController.ts";
import { auth } from "../middlewares/AuthMiddle.ts";


const UserRouter = Router();

const controller = new UserController();

UserRouter.post("/users",controller.create);

UserRouter.get("/users", auth, controller.list);

UserRouter.get("/users/:id", auth, controller.find)

UserRouter.put("/users/:id", auth, controller.update)

UserRouter.delete("/users/:id", auth, controller.remove)

export {UserRouter};