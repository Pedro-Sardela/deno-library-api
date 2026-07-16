import { BorrowRules } from "../models/Borrow/BorrowRules.ts";
import { BorrowService } from "../services/BorrowService.ts";
import { NextFunction, Request, Response } from 'express';

class BorrowController {
    constructor(
        private service: BorrowService,
        private rules: BorrowRules,
    ){
        this.list = this.list.bind(this);
        this.find = this.find.bind(this);
        this.listByUser = this.listByUser.bind(this);
        this.listByBook = this.listByBook.bind(this);
        this.remove = this.remove.bind(this);
        this.borrow = this.borrow.bind(this);
        this.return = this.return.bind(this);
    }
        
        async list(req: Request, res: Response, next: NextFunction){
            try {
                const borrows =
                await this.service.findAll();
                return res.send_ok('Lista de empréstimos recuperada', borrows);
            } catch (error) {
                next(error);
            }
        }
        
        async listByUser(req: Request, res: Response, next: NextFunction){
            try {
                this.rules.validateSingleId(req.params.userId);
                const borrows =
                await this.service.findByUserId(req.params.userId);
                return res.send_ok(`Lista de empréstimos recuperada, usuário: ${req.params.userId}`, borrows);
            } catch (error) {
                next(error);
            }
        }

        async find(req: Request, res: Response, next: NextFunction){
            try { 
                this.rules.validateSingleId(req.params.id);
                const borrow =
                    await this.service.findById(
                        req.params.id
                    );
                return res.send_ok('Empréstimo encontrado', borrow);
            } catch (error) {
                next(error);
            }
        }
        
        async listByBook(req: Request, res: Response, next: NextFunction){
            try {
                this.rules.validateSingleId(req.params.bookId);
                const borrows =
                    await this.service.findByBookId(req.params.bookId);
                return res.send_ok(`Lista de empréstimos recuperada, livro: ${req.params.bookId}`, borrows);
            } catch (error) {
                next(error);
            }
        }

        async remove(req: Request, res: Response, next: NextFunction){
            try {
                this.rules.validateSingleId(req.params.id);
                await this.service.delete(
                    req.params.id
                );
                return res.send_ok("Empréstimo removido com sucesso", req.params.id);
            } catch (error) {
                next(error);
            }
        }

        async borrow(req: Request, res: Response, next: NextFunction){
            try {
                this.rules.validateIds(req.params.userId, req.params.bookId);
                const data = await this.service.borrow(
                    req.params.userId,
                    req.params.bookId
                );
                return res.send_ok("Empréstimo realizado com sucesso", data);
            } catch (error) {
                next(error);
            }
        }

        async return(req: Request, res: Response, next: NextFunction){
            try {
                this.rules.validateSingleId(req.params.id);
                const data = await this.service.return(req.params.id);
                return res.send_ok("Devolução realizada com sucesso", data);
            } catch (error) {
                next(error);
            }
        }


}

export { BorrowController };