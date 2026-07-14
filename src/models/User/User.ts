import { BaseSchema } from "../../base/BaseSchema.ts";
import { IUser } from "./IUser.ts";
import is from '@zarco/isness';

class UserClass implements IUser {
    name: IUser['name'];
    email: IUser['email'];
    password: IUser['password'];

    constructor(user: IUser){
        this.name = user.name;
        this.email = user.email;
        this.password = user.password;
    }
}

class UserSchemaClass extends BaseSchema {
    constructor(){
        super({
            name: { type: String, required: [true, 'O nome precisa ser informado'] },
            email: { 
                type: String, 
                validate: {
                    validator: function (v: any){
                        return is.email(v);
                    },
                    message: (props: any) => `${props.value} não é um email válido`
                },
                required: [true, 'O email precisa ser informado'] 
            },
            password: { type: String, required: true, minlength: [10, 'Mínimo de 10 caracteres'], select: false },
        },
    {
        timestamps: true,
        toJSON: { getters: true },
        toObject: { getters: true },
    })
    }
}

const UserSchema = new UserSchemaClass().schema;
UserSchema.loadClass(UserClass);
// UserSchema.plugin

export { UserSchema };