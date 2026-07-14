import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { UserRepository } from "../models/User/UserRepository.ts";
import { Env } from "../config/Env.ts";


class AuthService {
	constructor(
		private users = new UserRepository()
	){}

	async login(
		email:string,
		password:string
	){
		const user =
			await this.users.findOne({email}).select("+password");

		if(!user){

			throw new Error(
				"Usuário ou senha inválidos"
			);

		}

		const valid =
			await bcrypt.compare(
				password,
				user.password
			);

		if(!valid){

			throw new Error(
				"Usuário ou senha inválidos"
			);

		}

		const token =
			jwt.sign(
				{
					id:user._id,
					email:user.email
				},
				Env.jwtSecret,
				{
					expiresIn: Env.jwtExpiresIn
				}
			);

		return {
			token,
			user:{
				id:user._id,
				name:user.name,
				email:user.email
			}
		};
	}
}

export { AuthService };