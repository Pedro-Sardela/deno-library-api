import { Router } from 'express';
import { BorrowController } from "../controllers/BorrowController.ts";
import { auth } from "../middlewares/AuthMiddle.ts";
import { BorrowRepository } from "../models/Borrow/BorrowRepository.ts";
import { BookRepository } from "../models/Book/BookRepository.ts";
import { UserRepository } from "../models/User/UserRepository.ts";
import { BookService } from "../services/BookService.ts";
import { UserService } from "../services/UserService.ts";
import { BorrowService } from "../services/BorrowService.ts";
import { BorrowRules } from "../models/Borrow/BorrowRules.ts";



const borrowRepo = new BorrowRepository();
const bookRepo = new BookRepository();
const userRepo = new UserRepository();

const bookService = new BookService(bookRepo, borrowRepo);
const userService = new UserService(userRepo, borrowRepo);
const borrowService = new BorrowService(borrowRepo, bookService, userService);

const controller = new BorrowController(borrowService, new BorrowRules());
const BorrowRouter = Router();

BorrowRouter.get("/borrow", auth, controller.list);
BorrowRouter.get("/borrow/:id", auth, controller.find);
BorrowRouter.get("/borrow/user/:userId", auth, controller.listByUser);
BorrowRouter.get("/borrow/book/:bookId", auth, controller.listByBook);

BorrowRouter.delete("/borrow/:id", auth, controller.remove);

BorrowRouter.post("/borrow/:userId/:bookId", auth, controller.borrow);
BorrowRouter.patch("/borrow/:id/return", auth, controller.return);

export {BorrowRouter};