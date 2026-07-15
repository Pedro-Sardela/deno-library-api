import is from "@zarco/isness";
import { BaseRules } from "../../base/BaseRules.ts";
import { throwlhos } from "../../globals/Throwlhos.ts";

export class UserRules extends BaseRules {
    constructor() {
        super()

        this.rc.addRule('name', {
            validator: (value: any) => {
                if(!is.string(value)) return false;
                if(value.length < 3 || value.length > 80) return false;
                return true
            },
            message: "O nome inserido é inválido (3-80 caracteres)"
        })

        this.rc.addRule('email', {
            validator: (value: string) => {
                if(!is.string(value) || !is.email(value)) return false;
                return true
            },
            message: "O email inserido é inválido"
        })

        this.rc.addRule('password', {
            validator: (value:any) => {
                if(!is.string(value)) return false;
                if(value.length < 10) return false;
                return true;
            },
            message: 'A senha deve ter no mínimo 10 caracteres.',
        })

        this.rc.addRule('id', {
            validator: (value: string) => is.objectId(value),
            message: "O ID fornecido não está em um formato válido."
        });
    }

    validateCreate(body: any): void {
        this.validate(
            { name: body.name, isRequiredField: true },
            { email: body.email, isRequiredField: true },
            { password: body.password, isRequiredField: true }
        );
    }

    validateUpdate(body: any): void {
        const rulesToValidate: any[] = [];
        if (body.name !== undefined) {
            rulesToValidate.push({ name: body.name });
        }
        if (body.email !== undefined) {
            rulesToValidate.push({ email: body.email });
        }
        if (body.password !== undefined) {
            rulesToValidate.push({ password: body.password });
        }
        // Só chama a validação se houver pelo menos um campo para atualizar
        if (rulesToValidate.length > 0) {
            this.validate(...rulesToValidate);
        }
    }

    validateId(id: string | undefined): void {
        if (!id) {
            throw throwlhos.err_badRequest("O ID é obrigatório.");
        }

        this.validate({ id: id });
    }
}