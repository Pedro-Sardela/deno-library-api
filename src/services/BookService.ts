import { IBook } from "../models/Book/IBook.ts";
import { BookRepository } from "../models/Book/BookRepository.ts";
import { throwlhos } from "../globals/Throwlhos.ts";
import { ClientSession } from 'mongoose';
import { BorrowRepository } from "../models/Borrow/BorrowRepository.ts";

class BookService {
    private repository: BookRepository;
    private borrowRepository: BorrowRepository;

    constructor(
        repository: BookRepository,
        borrowRepository: BorrowRepository
    ){
        this.repository = repository;
        this.borrowRepository = borrowRepository;
    }

    async create(data:IBook){
        const exists = await this.repository.exists({
            isbn: data.isbn
        })

        if (exists){
            throw throwlhos.err_conflict('ISBN do livro já cadastrado', {isbn: data.isbn })
        }

        return this.repository.createOne(data);
    }

    async findAll(){
        const books = await this.repository.findMany({});

        if (books.length === 0) {
            throw throwlhos.err_notFound("Nenhum livro foi encontrado");
        }

        return books
	}

	async findById(id:string){
		const book = await this.repository.findById(id);
        if (!book){
            throw throwlhos.err_notFound("Livro não encontrado");
        }
        return book;
	}

    async findByIsbn(isbn:string){
        const book = await this.repository.findByIsbn(isbn);
        if (!book){
            throw throwlhos.err_notFound("Livro não encontrado");
        }
        return book;
    }

    async findByIdWithSession(id: string, session: ClientSession) {
        return this.repository.findByIdWithSession(id, session);
    }

    async patch(id: string, data: Partial<IBook>) {
        const book = await this.repository.findById(id);

        if (!book) {
            throw throwlhos.err_notFound("Livro não encontrado");
        }

        if (data.isbn) {

            const exists = await this.repository.findOne({
                isbn: data.isbn,
                _id: { $ne: id },
            });

            if (exists) {
                throw throwlhos.err_conflict("ISBN já cadastrado");
            }
        }

        const updatedBook = await this.repository.updateById(
            id,
            data,
        );

        return updatedBook;
    }

	async delete(id: string) {
        const bookBorrows = await this.borrowRepository.findByBookId(id);
        const hasActiveBorrow = bookBorrows.some(borrow => borrow.status === "borrowed");
        if(hasActiveBorrow) throw throwlhos.err_badRequest("Não é possível remover um livro com empréstimos ativos");


        const book = await this.repository.deleteById(id);
        if (!book) {
            throw throwlhos.err_notFound("Livro não encontrado");
        }
        return book;
    }

    async increaseStock(id: string, qt: number) {
        const book = await this.findById(id);

        if(!book){
            throw throwlhos.err_notFound("Livro não encontrado");
        }

        if (qt <= 0) {
            throw throwlhos.err_badRequest("Quantidade inválida.");
        }

        return this.repository.updateById(id, {
            $inc: {
                quantity: qt,
                available: qt,
            },
        });
    }

    async decreaseStock(id: string, qt: number) {
        const book = await this.findById(id);

        if(!book){
            throw throwlhos.err_notFound("Livro não encontrado");
        }

        if (qt <= 0) {
            throw throwlhos.err_badRequest("Quantidade inválida.");
        }

        if (book.available< qt) {
            throw throwlhos.err_badRequest(
                "Não é possível remover mais exemplares do que os disponíveis."
            );
        }

        return this.repository.updateById(id, {
            $inc: {
                quantity: -qt,
                available: -qt,
            },
        });
    }

    async borrow(id: string, session: ClientSession) {
        const book = await this.repository.findByIdWithSession(id, session);
        if(!book) throw throwlhos.err_notFound("Livro não encontrado");

        if (book.available < 1) throw throwlhos.err_badRequest("Não restam livros disponíveis para empréstimo");

        return this.repository.borrowOne(id, session);
    }
    
    async return(id: string, session: ClientSession) {
        const book = await this.repository.findByIdWithSession(id, session);
        if(!book) throw throwlhos.err_notFound("Livro não encontrado");

        if (book.available === book.quantity) throw throwlhos.err_badRequest("Todos os livros já foram devolvidos");

        return this.repository.returnOne(id, session);
    }
}

export { BookService };