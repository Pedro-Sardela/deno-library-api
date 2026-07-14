import is from "@zarco/isness";
import { BaseSchema } from "../../base/BaseSchema.ts";
import { IBook } from "./IBook.ts";
import { isValidISBN } from "../../utilities/Isbn.ts";


class BookClass implements IBook {
    title: IBook['title'];
    author: IBook['author'];
    isbn: IBook['isbn'];
    genres: IBook['genres'];
    publishedDate: IBook['publishedDate'];
    quantity: IBook['quantity'];
    available: IBook['available'];

    constructor(book: IBook) {
        this.title = book.title;
        this.author = book.author;
        this.isbn = book.isbn;
        this.genres = book.genres;
        this.publishedDate = book.publishedDate;
        this.quantity = book.quantity;
        this.available = book.available;
    }
}

class BookSchemaClass extends BaseSchema {
    constructor(){
        super({
            title: { type: String, required: [true, 'O título precisa ser informado'] },
            author: { type: String, required: [true, 'O autor precisa ser informado'] },
            isbn: { type: String,
                 required: [true, 'O isbn precisa ser informado'], 
                 validate: {
                    validator: (value: string) => isValidISBN(value),
                    message: 'O ISBN armazenado é inválido' 
                }
                },
            genres: { type: [String],
                validate: {
                    validator: (value: string[]) => value.length > 0,
                    message: 'Informe pelo menos um gênero' 
                }
            },
            publishedDate: { 
                type: Date,
                validate: {
                    validator: (value: Date) => is.date(value),
                    message: 'formato de data inválido'
                }
             },
            quantity: { type: Number, required: [true, 'A quantidade precisa ser informada'] },
            available: { type: Number },

        },
        {
            timestamps: true,
            toJSON: { getters: true },
            toObject: { getters: true },
        })
    }
}

const BookSchema = new BookSchemaClass().schema;
BookSchema.loadClass(BookClass);

export{ BookSchema };