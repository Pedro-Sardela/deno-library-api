import is from "@zarco/isness";
import { BaseSchema } from "../../base/BaseSchema.ts";
import { IBorrow } from "./IBorrow.ts";
import { Schema } from 'mongoose';


class BorrowClass implements IBorrow {
    userId: IBorrow['userId'];
    bookId: IBorrow['bookId'];
    borrowDate: IBorrow['borrowDate'];
    dueDate: IBorrow['dueDate'];
    returnDate: IBorrow['returnDate'];
    status: IBorrow['status'];
    
    constructor(borrow: IBorrow) {
        this.userId = borrow.userId;
        this.bookId = borrow.bookId;
        this.borrowDate = borrow.borrowDate;
        this.dueDate = borrow.dueDate;
        this.returnDate = borrow.returnDate;
        this.status = borrow.status;
    }
}

class BorrowSchemaClass extends BaseSchema {
    constructor(){
        super({
            userId: { type: Schema.Types.ObjectId, required: [true, 'O Id do usuário deve ser informado']},
            bookId: { type: Schema.Types.ObjectId, required: [true, 'O Id do livro deve ser informado']},
            borrowDate: { 
                type: Date,
                validate: {
                    validator: (value: Date) => is.date(value),
                    message: 'formato de data inválido'
                },
                required: [true, 'A data do empréstimo deve ser informada']
            },
            dueDate: { 
                type: Date,
                validate: {
                    validator: (value: Date) => is.date(value),
                    message: 'formato de data inválido'
                },
                required: [true, 'A data de devolução deve ser informada']
            },
            returnDate: { 
                type: Date,
                validate: {
                    validator: (value: Date) => is.date(value),
                    message: 'formato de data inválido'
                },
                default: null
             },
            status: { 
                type: String,
                enum: ["borrowed", "returned"], 
                required: [true, 'O status do empréstimo deve ser informado']},
        },
    {
        timestamps: true,
        toJSON: { getters: true },
        toObject: { getters: true },
    })
    }
}

const BorrowSchema = new BorrowSchemaClass().schema;
BorrowSchema.loadClass(BorrowClass);

export { BorrowSchema };