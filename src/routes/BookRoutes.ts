import { Router } from 'express';
import { BookController } from "../controllers/BookController.ts";
import { auth } from "../middlewares/AuthMiddle.ts";


const BookRouter = Router();

const controller = new BookController();

BookRouter.use(auth)

BookRouter.post("/books",controller.create);
BookRouter.patch("/books/stock/increase/:id", controller.increaseStock);
BookRouter.patch("/books/stock/decrease/:id", controller.decreaseStock);

BookRouter.get("/books",controller.list);

BookRouter.get("/books/:id",controller.find);

BookRouter.get("/books/isbn/:isbn",controller.findByIsbn);

BookRouter.patch("/books/:id", controller.patch);

BookRouter.delete("/books/:id", controller.remove);

export {BookRouter};