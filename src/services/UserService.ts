import { IUser } from "../models/User/IUser.ts";
import { UserRepository } from "../models/User/UserRepository.ts";
import bcrypt from 'bcrypt';
import { throwlhos } from "../globals/Throwlhos.ts";

async function hashPassword(password: string): Promise<string> {
    const saltRounds = 12;
    return await bcrypt.hash(password, saltRounds);
}

class UserService {
    private repository: UserRepository;

    constructor(
        repository = new UserRepository()
    ){
        this.repository = repository;
    }

    async create(data:IUser){
        const exists = await this.repository.exists({
            email: data.email
        })

        if (exists){
            throw throwlhos.err_conflict('Email já cadastrado', {email: data.email  })
        }

        const passwordHash = await hashPassword(data.password);

        const user = await this.repository.createOne({
            ...data,
            password: passwordHash,
        });
        return user;
    }

    async findAll(){
		const users = await this.repository.findMany({});
        if (users.length === 0) {
            throw throwlhos.err_notFound("Nenhum usuário encontrado");
        }
        return users
	}

	async findById(id:string){
		const user = await this.repository.findById(id);
        if (!user) {
            throw throwlhos.err_notFound("Usuário não encontrado");
        }
        return user
	}

    async update(
		id:string,
		data: Partial<IUser>
	){
        const user = await this.repository.findById(id);
        if (!user) {
            throw throwlhos.err_notFound("Usuário não encontrado");
        }

		if(data.password){
			data.password = await hashPassword(data.password)
		}

		return this.repository.updateById(id, data );
	}

	async delete(id: string) {
    const user = await this.repository.deleteById(id);
    if (!user) {
        throw throwlhos.err_notFound("Usuário não encontrado");
    }
    return user;
}
}

export { UserService };