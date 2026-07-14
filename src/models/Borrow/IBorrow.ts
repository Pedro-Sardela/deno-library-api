import { IBaseInterface } from "../../base/IBaseInterface.ts";

export type BorrowStatus = "borrowed" | "returned";

export interface IBorrow extends IBaseInterface {
    userId: string;
    bookId: string;
    borrowDate: Date;
    dueDate: Date;
    returnDate: Date | null;
    status: BorrowStatus;
}