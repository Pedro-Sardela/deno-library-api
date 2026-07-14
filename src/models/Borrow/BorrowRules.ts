import is from "@zarco/isness";
import { BaseRules } from "../../base/BaseRules.ts";
import { Schema } from 'mongoose'

export class BorrowRules extends BaseRules {
    constructor() {
        super();

        const isValidObjectId = (value: any) => {
            if (!is.string(value)) return false;
            return is.objectId(value); 
        };

        this.rc.addRule('userId', {
            validator: isValidObjectId,
            message: 'O ID do usuário é inválido. Deve ser um ObjectId válido.',
        });

        this.rc.addRule('bookId', {
            validator: isValidObjectId,
            message: 'O ID do livro é inválido. Deve ser um ObjectId válido.',
        });
    }

    validateIds(userId: Schema.Types.ObjectId, bookId: Schema.Types.ObjectId): void {
        this.validate(
            { userId: userId, isRequiredField: true },
            { bookId: bookId, isRequiredField: true }
        );
    }
}