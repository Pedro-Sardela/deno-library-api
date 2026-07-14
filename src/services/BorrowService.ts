import { IBorrow, type BorrowStatus } from "../models/Borrow/IBorrow.ts";
import { BorrowRepository } from "../models/Borrow/BorrowRepository.ts";
import { throwlhos } from "../globals/Throwlhos.ts";
import { BookService } from "./BookService.ts";
import { UserService } from "./UserService.ts";
import { startLibrarySession } from "../database/db/libraryDB.ts"
import { Time } from "../utilities/Time.ts";
import { Schema } from "mongoose";
import { BookRepository } from "../models/Book/BookRepository.ts";
import { UserRepository } from "../models/User/UserRepository.ts";

class BorrowService {
    private repository: BorrowRepository;
    private bookService = new BookService(new BookRepository(), new BorrowRepository());
    private userService = new UserService(new UserRepository(), new BorrowRepository());

    constructor(
        repository = new BorrowRepository()
    ){
        this.repository = repository;
    }

    async findAll(){
        const borrows = await this.repository.findMany({});

        if (borrows.length === 0) {
            throw throwlhos.err_notFound("Nenhum empréstimo foi encontrado");
        }

        return borrows
	}

	async findById(id:string){
		const borrow = await this.repository.findById(id);
        if (!borrow){
            throw throwlhos.err_notFound("Empréstimo não encontrado");
        }
        return borrow;
	}

	async findByUserId(userId:string){
		const borrows = await this.repository.findByUserId(userId);
        if (!borrows){
            throw throwlhos.err_notFound("O livro não possui empréstimos em andamento");
        }
        return borrows;
	}

	async findByBookId(bookId:string){
		const borrows = await this.repository.findByBookId(bookId);
        if (!borrows){
            throw throwlhos.err_notFound("O usuário não possui empréstimos em andamento");
        }
        return borrows;
	}

	async delete(id: string) {
        const borrow = await this.repository.findById(id);
        if (!borrow) {
            throw throwlhos.err_notFound("Empréstimo não encontrado");
        }
        if (borrow.status !== "returned" as BorrowStatus) throw throwlhos.err_badRequest("Apenas registros de empréstimos finalizados (devolvidos) podem ser apagados");
        const deletedBorrow = await this.repository.deleteById(id);
        return deletedBorrow;
    }

    async borrow(userId: string, bookId: string) {

        const now = Time.now().toDate();
        const dueDate = new Date(now);
        dueDate.setDate(dueDate.getDate() + 15)

        const data = {
            userId,
            bookId,
            borrowDate: now,
            dueDate,
            returnDate: null,
            status: "borrowed" as BorrowStatus,
        }

        const session = await startLibrarySession();
        try {
            const book = await this.bookService.findByIdWithSession(bookId, session);
            if(!book){
                throw throwlhos.err_notFound("Livro não encontrado");
            }
            const user = await this.userService.findByIdWithSession(userId, session);
            if(!user){
                throw throwlhos.err_notFound("Usuário não encontrado");
            }

            if (book.available < 1) {
                throw throwlhos.err_badRequest(
                    "Não há exemplares disponíveis."
                );
            }

            await this.bookService.borrow(bookId, session);
            const borrow = await this.repository.createWithSession(data, session);

            await session.commitTransaction();

            return borrow;
        } catch (error) {
            await session.abortTransaction();
            throw error;
        } finally {
            await session.endSession();
        }
    }

    async return(borrowId: string) {

        const now = Time.now().toDate();

        console.log("Tentando buscar empréstimo com ID:", borrowId);
        const session = await startLibrarySession();
        try {
            const borrow = await this.repository.findByIdWithSession(borrowId, session);
            if(!borrow){
                throw throwlhos.err_notFound("Empréstimo não encontrado");
            }
            const book = await this.bookService.findByIdWithSession(borrow.bookId, session);
            if(!book){
                throw throwlhos.err_notFound("Livro do emprétismo não encontrado")
            }

            if (book.available >= book.quantity){
                throw throwlhos.err_badRequest(
                    "Todos os exemplares já foram devolvidos."
                );
            }

            await this.bookService.return(book.id, session);

            const updatedBorrow = await this.repository.updateById(borrowId, { returnDate: now, status: "returned" as BorrowStatus }, session);

            await session.commitTransaction();

            return updatedBorrow;
        } catch (error) {
            await session.abortTransaction();
            throw error;
        } finally {
            await session.endSession();
        }

    }
}

export { BorrowService };