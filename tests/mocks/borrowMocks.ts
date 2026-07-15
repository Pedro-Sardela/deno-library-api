import { BorrowRepository } from "../../src/models/Borrow/BorrowRepository.ts";

export const FAKE_BORROW = {
    _id: "66d088ffa9fe0987580c7f0e",
    bookId: "66d088ffa9fe0987580c7b1c",
    userId: "66d088ffa9fe0987580c7a1a",
    status: "active",
    dueDate: new Date(),
    createdAt: new Date(),
    updatedAt: new Date()
};

export const FAKE_BORROW_LIST = [
    FAKE_BORROW,
    {
        ...FAKE_BORROW,
        _id: "66d088ffa9fe0987580c7f0f",
        bookId: "66d088ffa9fe0987580c7b1d",
        userId: "66d088ffa9fe0987580c7a1b",
        status: "returned"
    }
];

export function mockBorrowRepository(overrides: any = {}) {
    return {
        findMany: async () => FAKE_BORROW_LIST,

        hasActiveBorrow: async (userId: string) => { return userId === "66d088ffa9fe0987580c7a1a" ? true : false; },

        findById: async (_id: string) => {
            const found = FAKE_BORROW_LIST.find(b => b._id === _id);
            return found || null;
        },

        createOne: async (data: any) => {
            return {
                ...FAKE_BORROW,
                ...data,
                toObject: function() { return this; }
            };
        },

        updateById: async (_id: string, data: any) => { return { ...FAKE_BORROW, ...data }; },

        findByUserId: async (userId: string) => { return FAKE_BORROW_LIST.filter(b => b.userId === userId); },

        findByBookId: async (bookId: string) => { return FAKE_BORROW_LIST.filter(b => b.bookId === bookId);},

        deleteById: async (_id: string) => { return FAKE_BORROW; },

        ...overrides
    } as unknown as BorrowRepository;
}