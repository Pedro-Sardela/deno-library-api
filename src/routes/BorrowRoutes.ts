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

/**
 * @openapi
 * /borrow:
 *  get:
 *      description: Retorna todos os registros de empréstimos
 *      responses:
 *          200:
 *              description: Empréstimos listados
 *          401:
 *              description: Sem autorização
 *          404:
 *              description: Sem empréstimos a serem listados
 */
BorrowRouter.get("/borrow", auth, controller.list);

/**
 * @openapi
 * /borrow/:id:
 *  get:
 *      description: Retorna um empréstimo -> busca por ID
 *      responses:
 *          200:
 *              description: Empréstimo encontrado
 *          401:
 *              description: Sem autorização
 *          404:
 *              description: Empréstimo não encontrado
 *          422:
 *              description: ID fornecido em formato inválido
 */
BorrowRouter.get("/borrow/:id", auth, controller.find);

/**
 * @openapi
 * /borrow/user/:userId:
 *  get:
 *      description: Retorna todos os empréstimos de um usuário -> busca por ID de um usuário
 *      responses:
 *          200:
 *              description: Empréstimos encontrados
 *          401:
 *              description: Sem autorização
 *          422:
 *              description: ID fornecido em formato inválido
 */
BorrowRouter.get("/borrow/user/:userId", auth, controller.listByUser);

/**
 * @openapi
 * /borrow/book/:bookId:
 *  get:
 *      description: Retorna todos os empréstimos de um livro -> busca por ID de um livro
 *      responses:
 *          200:
 *              description: Empréstimos encontrados
 *          401:
 *              description: Sem autorização
 *          422:
 *              description: ID fornecido em formato inválido
 */
BorrowRouter.get("/borrow/book/:bookId", auth, controller.listByBook);

/**
 * @openapi
 * /borrow/:id:
 *  delete:
 *      description: Remove o registro de um empréstimo -> busca por ID
 *      responses:
 *          200:
 *              description: Empréstimo removido
 *          401:
 *              description: Sem autorização
 *          404:
 *              description: Empréstimo não encontrado
 *          422:
 *              description: ID fornecido em formato inválido
 */
BorrowRouter.delete("/borrow/:id", auth, controller.remove);

/**
 * @openapi
 * /borrow/:userId/:bookId:
 *  post:
 *      description: Empresta um livro: gera um registro de empréstimo e reduz em 1 o campo 'available' do livro.
 * Caso alguma das ações falhe, aborta a operação por completo.
 *      responses:
 *          200:
 *              description: Empréstimo realizado
 *          401:
 *              description: Sem autorização
 *          404:
 *              description: Empréstimo não encontrado
 *          422:
 *              description: 
 *                  Caso 1: ID do usuário fornecido em formato inválido
 *                  Caso 2: ID do livro fornecido em formato inválido
 */
BorrowRouter.post("/borrow/:userId/:bookId", auth, controller.borrow);

/**
 * @openapi
 * /borrow/:id/return":
 *  patch:
 *      description: Devolve um livro: altera o status do registro de empréstimo para 'returned' e aumenta em 1
 * o campo 'available' do livro. Caso alguma das ações falhe, aborta a operação por completo.
 *      responses:
 *          200:
 *              description: Devolução realizada
 *          400:
 *              description: Nenhum empréstimo pendente de devolução para aquele livro (quantity = available)
 *          401:
 *              description: Sem autorização
 *          404:
 *              description: Empréstimo não encontrado
 *          422:
 *              description: ID fornecido em formato inválido
 */
BorrowRouter.patch("/borrow/:id/return", auth, controller.return);

export {BorrowRouter};