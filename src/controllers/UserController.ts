import { UserService } from "../services/UserService.ts";
import { UserRules } from "../models/User/UserRules.ts";
import { NextFunction, Request, Response } from 'express';

class UserController {
	constructor(
		private service: UserService,
        private rules: UserRules,
	){
        this.create = this.create.bind(this);
        this.list = this.list.bind(this);
        this.find = this.find.bind(this);
        this.update = this.update.bind(this);
        this.remove = this.remove.bind(this);
    }

	async create(req:Request, res: Response, next: NextFunction){
        try {
            this.rules.validateCreate(req.body);
            const user =
                await this.service.create(req.body);
            return res.send_created('Usuário criado com sucesso', user);
        } catch (error) {
            next(error);
        }

    }

	async list(req: Request, res: Response, next: NextFunction){
		try {
            const users =
                await this.service.findAll();
            return res.send_ok('Lista de usuários recuperada', users);
        } catch (error) {
            next(error);
        }
	}

	async find(req: Request, res: Response, next: NextFunction){
		try { 
            this.rules.validateId(req.params.id)
            const user =
                await this.service.findById(
                    req.params.id
                );
            return res.send_ok('Usuário encontrado', user);
        } catch (error) {
            next(error);
        }

	}

	async update(req: Request, res: Response, next: NextFunction){
		try {
            this.rules.validateId(req.params.id);
            this.rules.validateUpdate(req.body);
            const user =
                await this.service.update(
                    req.params.id,
                    req.body
                );
            return res.send_ok('Usuário atualizado com sucesso', user);
        } catch (error) {
            next(error);
        }

	}

	async remove(req: Request, res: Response, next: NextFunction){
		try {
            this.rules.validateId(req.params.id);
            await this.service.delete(
                req.params.id
            );
            return res.send_ok("Usuário removido com sucesso", req.params.id);
        } catch (error) {
            next(error);
        }

	}

}

export { UserController };