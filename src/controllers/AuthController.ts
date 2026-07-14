import { AuthService } from "../services/AuthService.ts";
import { NextFunction, Request, Response } from 'express';


class AuthController{
    constructor(
        private service = new AuthService()
    ){
        this.login = this.login.bind(this);
    }

    async login (req: Request, res: Response, next: NextFunction){
        try {
            if(!req.body.email || !req.body.password) {
                return res.send_badRequest('Email e senha são obrigatórios')
            }

            const result = 
                await this.service.login(
                    req.body.email,
                    req.body.password
                );
                return res.send_ok("Login realizado com sucesso", result);
        } catch (error) {
            next(error);
        }
    }
}

export { AuthController };