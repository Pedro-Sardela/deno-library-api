import is from "@zarco/isness";
import { BaseRules } from "../../base/BaseRules.ts";
import { isValidISBN } from "../../utilities/Isbn.ts";
import { Time } from "../../utilities/Time.ts";


export class BookRules extends BaseRules {
    constructor() {
        super()

        this.rc.addRule('title', {
            validator: (value: string) => {
                if(!is.string(value)) return false;
                if(value.length < 1 || value.length > 200) return false;
                return true;
            },
            message: 'O título inserido é inválido (1-200 caracteres)',
        })

        this.rc.addRule('author', {
            validator: (value: string) => {
                if(!is.string(value)) return false;
                if(value.length < 3 || value.length > 80) return false;
                return true;
            },
            message: 'O autor inserido é inválido (3-80 caracteres)',
        })

        this.rc.addRule('isbn', {
            validator: (value: string) => isValidISBN(value),
            message: "O ISBN informado é inválido."
        });

        this.rc.addRule('publishedDate', {
            validator: (value: any) => {
                if (!value) return false;
                const dateValue = new Date(value);
                if (isNaN(dateValue.getTime())) return false;
                if (dateValue > Time.now().toDate()) return false;
                return true; 
            },
            message: 'A data de publicação é inválida ou não pode ser futura.'
})

        this.rc.addRule('quantity', {
            validator: (value: number) => {
                if(!is.number(value) || value < 1) return false;
                return true;
            },
            message: 'A quantidade deve ser maior que 0',
        })

        this.rc.addRule('available', {
            validator: (value: number) => {
                if(!is.number(value) || value < 1) return false;
                return true;
            },
            message: 'A quantidade disponível deve ser maior que 0',
        })

        this.rc.addRule('stockIntegrity', {
            validator: (payload: any) => {
                // Se ambos os campos existem no objeto, faz a comparação
                if (payload.available !== undefined && payload.quantity !== undefined) {
                    return payload.available <= payload.quantity;
                }
                // Se não enviou um dos dois (comum no PATCH), a regra passa.
                return true; 
            },
            message: 'A quantidade disponível não pode ser maior que o estoque total.'
        });
    }

    validateCreate(body: any): void {
        this.validate(
            { title: body.title, isRequiredField: true },
            { author: body.author, isRequiredField: true },
            { isbn: body.isbn, isRequiredField: true },
            { publishedDate: body.publishedDate, isRequiredField: true },
            { quantity: body.quantity, isRequiredField: true },
            { available: body.available, isRequiredField: true },
            { stockIntegrity: body }
        );
    }

    validatePatch(body: any): void {
        const rulesToValidate: any[] = [];
        
        if (body.title !== undefined) rulesToValidate.push({ title: body.title });
        if (body.author !== undefined) rulesToValidate.push({ author: body.author });
        if (body.isbn !== undefined) rulesToValidate.push({ isbn: body.isbn });
        if (body.publishedDate !== undefined) rulesToValidate.push({ publishedDate: body.publishedDate });
        if (body.quantity !== undefined) rulesToValidate.push({ quantity: body.quantity });
        if (body.available !== undefined) rulesToValidate.push({ available: body.available });

        if (body.quantity !== undefined || body.available !== undefined) {
             rulesToValidate.push({ stockIntegrity: body });
        }

        if (rulesToValidate.length > 0) {
            this.validate(...rulesToValidate);
        }
    }

    validateStockChange(body: any): void {
        this.validate(
            { quantity: body.quantity, isRequiredField: true }
        );
    }
}