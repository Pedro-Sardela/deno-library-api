import { Router } from 'express';
import { BookController } from "../controllers/BookController.ts";
import { auth } from "../middlewares/AuthMiddle.ts";
import { BookRules } from "../models/Book/BookRules.ts";
import { BookService } from "../services/BookService.ts";
import { BorrowRepository } from "../models/Borrow/BorrowRepository.ts";
import { BookRepository } from "../models/Book/BookRepository.ts";


const bookRepo = new BookRepository();
const borrowRepo = new BorrowRepository();
const bookService = new BookService(bookRepo, borrowRepo);

const bookRules = new BookRules();
const controller = new BookController(bookService, bookRules);

const BookRouter = Router();

BookRouter.post("/books", auth, controller.create);
BookRouter.patch("/books/stock/increase/:id", auth, controller.increaseStock);
BookRouter.patch("/books/stock/decrease/:id", auth, controller.decreaseStock);

BookRouter.get("/books", auth, controller.list);

BookRouter.get("/books/:id", auth, controller.find);

BookRouter.get("/books/isbn/:isbn", auth, controller.findByIsbn);

BookRouter.patch("/books/:id", auth, controller.patch);

BookRouter.delete("/books/:id", auth, controller.remove);

export {BookRouter};