import { IBaseInterface } from "../../base/IBaseInterface.ts";

export interface IBook extends IBaseInterface {
    title: string;
    author: string;
    isbn: string;
    genres: string[];
    publishedDate: Date;
    quantity: number;
    available: number;
}