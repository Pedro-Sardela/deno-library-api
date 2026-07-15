import { Router } from 'express';
import { BorrowController } from "../controllers/BorrowController.ts";
import { auth } from "../middlewares/AuthMiddle.ts";


const BorrowRouter = Router();

const controller = new BorrowController();

BorrowRouter.get("/borrow", auth, controller.list);
BorrowRouter.get("/borrow/:id", auth, controller.find);
BorrowRouter.get("/borrow/user/:userId", auth, controller.listByUser);
BorrowRouter.get("/borrow/book/:bookId", auth, controller.listByBook);

BorrowRouter.delete("/borrow/:id", auth, controller.remove);

BorrowRouter.post("/borrow/:userId/:bookId", auth, controller.borrow);
BorrowRouter.patch("/borrow/:id/return", auth, controller.return);

export {BorrowRouter};