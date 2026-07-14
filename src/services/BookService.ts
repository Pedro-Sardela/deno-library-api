import { IBook } from "../models/Book/IBook.ts";
import { BookRepository } from "../models/Book/BookRepository.ts";
import { throwlhos } from "../globals/Throwlhos.ts";

class BookService {
    private repository: BookRepository;

    constructor(
        repository = new BookRepository()
    ){
        this.repository = repository;
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

    async patch(id: string, data: Partial<IBook>) {

        if (data.isbn) {

            const exists = await this.repository.findOne({
                isbn: data.isbn,
                _id: { $ne: id },
            });

            if (exists) {
                throw throwlhos.err_conflict("ISBN já cadastrado");
            }
        }

        const book = await this.repository.updateById(
            id,
            data,
        );

        if (!book) {
            throw throwlhos.err_notFound("Livro não encontrado");
        }

        return book;
    }

	async delete(id: string) {
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

    // async borrow(id: string) {
    //     const book = await this.findById(id);

    //     if(!book){
    //         throw throwlhos.err_notFound("Livro não encontrado");
    //     }

    //     if (book.available < 1) {
    //         throw throwlhos.err_badRequest(
    //             "Não há exemplares disponíveis."
    //         );
    //     }

    //     return this.repository.updateById(id, {
    //         $inc: {
    //             available: -1,
    //         },
    //     });
    // }

    // async return(id: string) {
    //     const book = await this.findById(id);

    //     if(!book){
    //         throw throwlhos.err_notFound("Livro não encontrado");
    //     }

    //     if (book.available >= book.quantity){
    //         throw throwlhos.err_badRequest(
    //             "Todos os livros já foram devolvidos."
    //         );
    //     }

    //     return this.repository.updateById(id, {
    //         $inc: {
    //             available: 1,
    //         },
    //     });
    // }
}

export { BookService };