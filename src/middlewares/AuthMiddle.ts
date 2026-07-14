import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { Env } from "../config/Env.ts";
import { throwlhos } from "../globals/Throwlhos.ts";

export interface JwtPayload {
    id: string;
    email: string;
}

export interface CustomRequest extends Request {
    user?: JwtPayload;
}

export function auth(
    req: Request,
    res: Response,
    next: NextFunction,
) {
    try {
        const authorization = req.headers.authorization;

        if (!authorization) {
            return next(
                throwlhos.err_unauthorized("Acesso negado.")
            );
        }

        const [bearer, token] = authorization.split(" ");

        if (bearer !== "Bearer" || !token) {
            return next(
                throwlhos.err_unauthorized("Formato de token inválido.")
            );
        }

        const decoded = jwt.verify(
            token,
            Env.jwtSecret,
        ) as JwtPayload;

        (req as CustomRequest).user = decoded;

        next();
    } catch (error) {
        if (error instanceof jwt.JsonWebTokenError) {
            return next(
                throwlhos.err_unauthorized("Token inválido.")
            );
        }

        next(error);
    }
}