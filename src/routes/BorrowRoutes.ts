import { Router } from 'express';
import { BorrowController } from "../controllers/BorrowController.ts";
import { auth } from "../middlewares/AuthMiddle.ts";


const BorrowRouter = Router();

const controller = new BorrowController();

BorrowRouter.use(auth)


BorrowRouter.get("/borrow",controller.list);
BorrowRouter.get("/borrow/:id",controller.find);
BorrowRouter.get("/borrow/user/:userId",controller.listByUser);
BorrowRouter.get("/borrow/book/:bookId",controller.listByBook);

BorrowRouter.delete("/borrow/:id", controller.remove);

BorrowRouter.post("/borrow/:userId/:bookId", controller.borrow);
BorrowRouter.patch("/borrow/:id/return", controller.return);

export {BorrowRouter};