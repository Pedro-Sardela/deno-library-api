import { Router } from 'express';
import { BookController } from "../controllers/BookController.ts";
import { auth } from "../middlewares/AuthMiddle.ts";


const BookRouter = Router();

const controller = new BookController();

BookRouter.post("/books", auth, controller.create);
BookRouter.patch("/books/stock/increase/:id", auth, controller.increaseStock);
BookRouter.patch("/books/stock/decrease/:id", auth, controller.decreaseStock);

BookRouter.get("/books", auth, controller.list);

BookRouter.get("/books/:id", auth, controller.find);

BookRouter.get("/books/isbn/:isbn", auth, controller.findByIsbn);

BookRouter.patch("/books/:id", auth, controller.patch);

BookRouter.delete("/books/:id", auth, controller.remove);

export {BookRouter};