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

/**
 * @openapi
 * /books:
 *  post:
 *      description: Cria um livro
 *      responses:
 *          201:
 *              description: Livro criado
 *          401:
 *              description: Sem autorização
 *          409:
 *              description: ISBN já cadastrado no sistema
 *          422:
 *              description:
 *                  Caso 1: Campo inválido
 *                  Caso 2: Campo faltante
 */
BookRouter.post("/books", auth, controller.create);

/**
 * @openapi
 * /books/stock/increase/:id:
 *  patch:
 *      description: Aumenta a quantidade de livros em estoque -> Busca por ID
 *      responses:
 *          200:
 *              description: Quantidade de livros em estoque aumentada
 *          401:
 *              description: Sem autorização
 *          404:
 *              description: Livro não encontrado
 *          422:
 *              description: Campo 'quantity' faltante ou com formato inválido
 */
BookRouter.patch("/books/stock/increase/:id", auth, controller.increaseStock);

/**
 * @openapi
 * /books/stock/decrease/:id:
 *  patch:
 *      description: Reduz a quantidade de livros em estoque -> Busca por ID
 *      responses:
 *          200:
 *              description: Quantidade de livros em estoque reduzida
 *          400:
 *              description: Quantidade a ser reduzida não pode ser maior que a quantidade de livros disponíveis
 *          401:
 *              description: Sem autorização
 *          404:
 *              description: Livro não encontrado
 *          422:
 *              description: Campo 'quantity' faltante ou com formato inválido
 */
BookRouter.patch("/books/stock/decrease/:id", auth, controller.decreaseStock);


/**
 * @openapi
 * /books:
 *  get:
 *      description: Retorna todos os livros cadastrados
 *      responses:
 *          200:
 *              description: Livros listados
 *          401:
 *              description: Sem autorização
 *          404:
 *              description: Sem Livros a serem listados
 */
BookRouter.get("/books", auth, controller.list);

/**
 * @openapi
 * /books/:id:
 *  get:
 *      description: Retorna um livro -> busca por ID
 *      responses:
 *          200:
 *              description: Livro encontrado
 *          401:
 *              description: Sem autorização
 *          404:
 *              description: Livro não encontrado
 *          422:
 *              description: ID fornecido em formato inválido
 */
BookRouter.get("/books/:id", auth, controller.find);

/**
 * @openapi
 * /books/isbn/:isbn:
 *  get:
 *      description: Retorna um livro -> busca por ISBN
 *      responses:
 *          200:
 *              description: Livro encontrado
 *          401:
 *              description: Sem autorização
 *          404:
 *              description: Livro não encontrado
 */
BookRouter.get("/books/isbn/:isbn", auth, controller.findByIsbn);

/**
 * @openapi
 * /books/:id:
 *  patch:
 *      description: Atualiza um livro -> Busca por ID
 *      responses:
 *          200:
 *              description: Livro atualizado
 *          401:
 *              description: Sem autorização
 *          404:
 *              description: Livro não encontrado
 *          422:
 *              description: ID fornecido em formato inválido
 */
BookRouter.patch("/books/:id", auth, controller.patch);


/**
 * @openapi
 * /books/:id:
 *  delete:
 *      description: Remove um livro -> Busca por ID
 *      responses:
 *          200:
 *              description: Livro removido
 *          401:
 *              description: Sem autorização
 *          404:
 *              description: Livro não encontrado
 *          422:
 *              description: ID fornecido em formato inválido
 */
BookRouter.delete("/books/:id", auth, controller.remove);

export {BookRouter};