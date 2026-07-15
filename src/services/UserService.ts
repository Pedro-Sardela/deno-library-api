import { IUser } from "../models/User/IUser.ts";
import { UserRepository } from "../models/User/UserRepository.ts";
import bcrypt from 'bcrypt';
import { throwlhos } from "../globals/Throwlhos.ts";
import { ClientSession } from 'mongoose';
import { BorrowRepository } from "../models/Borrow/BorrowRepository.ts";

async function hashPassword(password: string): Promise<string> {
    const saltRounds = 12;
    return await bcrypt.hash(password, saltRounds);
}

class UserService {
    private repository: UserRepository;
    private borrowRepository: BorrowRepository;

    constructor(
        repository: UserRepository,
        borrowRepository: BorrowRepository
    ){
        this.repository = repository;
        this.borrowRepository = borrowRepository;
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
        const { password, ...userWithoutPassword } = user.toObject(); 

        return userWithoutPassword;
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

    async findByIdWithSession(userId: string, session: ClientSession) {
        return this.repository.findByIdWithSession(userId, session);
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
        const userBorrows = await this.borrowRepository.findByUserId(id);
        const hasActiveBorrow = userBorrows.some(borrow => borrow.status === "borrowed");
        if(hasActiveBorrow) throw throwlhos.err_badRequest("Não é possível remover um usuário com empréstimos ativos");

        const user = await this.repository.deleteById(id);
        if (!user) {
            throw throwlhos.err_notFound("Usuário não encontrado");
        }
        return user;
    }
}

export { UserService };