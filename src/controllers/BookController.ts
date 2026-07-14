import { BookRepository } from "../models/Book/BookRepository.ts";
import { BookRules } from "../models/Book/BookRules.ts";
import { BorrowRepository } from "../models/Borrow/BorrowRepository.ts";
import { BookService } from "../services/BookService.ts";
import { NextFunction, Request, Response } from 'express';

class BookController {
    constructor(
        private service = new BookService(new BookRepository(), new BorrowRepository()),
        private rules = new BookRules(),
    ){
        this.create = this.create.bind(this);
        this.list = this.list.bind(this);
        this.find = this.find.bind(this);
        this.findByIsbn = this.findByIsbn.bind(this);
        this.patch = this.patch.bind(this);
        this.remove = this.remove.bind(this);
        this.increaseStock = this.increaseStock.bind(this);
        this.decreaseStock = this.decreaseStock.bind(this);
    }

    	async create(req:Request, res: Response, next: NextFunction){
        try {
            this.rules.validateCreate(req.body);
            const book =
                await this.service.create(req.body);
            return res.send_created('Livro criado com sucesso', book);
        } catch (error) {
            next(error);
        }

    }

	async list(req: Request, res: Response, next: NextFunction){
		try {
            const books =
                await this.service.findAll();
            return res.send_ok('Lista de livros recuperada', books);
        } catch (error) {
            next(error);
        }
	}

    async findByIsbn(req: Request, res: Response, next: NextFunction){
		try { 
            const book =
                await this.service.findByIsbn(
                    req.params.isbn
                );
            return res.send_ok('Livro encontrado', book);
        } catch (error) {
            next(error);
        }

	}

	async find(req: Request, res: Response, next: NextFunction){
		try { 
            const book =
                await this.service.findById(
                    req.params.id
                );
            return res.send_ok('Livro encontrado', book);
        } catch (error) {
            next(error);
        }

	}

	async patch(req: Request, res: Response, next: NextFunction){
		try {
            this.rules.validatePatch(req.body);
            const book =
                await this.service.patch(
                    req.params.id,
                    req.body
                );
            return res.send_ok('Livro atualizado com sucesso', book);
        } catch (error) {
            next(error);
        }

	}

	async remove(req: Request, res: Response, next: NextFunction){
		try {
            await this.service.delete(
                req.params.id
            );
            return res.send_ok("Livro removido com sucesso", req.params.id);
        } catch (error) {
            next(error);
        }
	}

    async increaseStock(req: Request, res: Response, next: NextFunction){
        try {
            this.rules.validateStockChange(req.body);
            const book = await this.service.increaseStock(
                req.params.id,
                req.body.quantity
            );
            return res.send_ok("Quantidade de livros aumentada com sucesso", book)
        } catch (error) {
            next(error);
        }
    }

    async decreaseStock(req: Request, res: Response, next: NextFunction){
        try {
            this.rules.validateStockChange(req.body);
            const book = await this.service.decreaseStock(
                req.params.id,
                req.body.quantity
            );
            return res.send_ok("Quantidade de livros diminuida com sucesso", book)
        } catch (error) {
            next(error);
        }
    }

}

export { BookController };