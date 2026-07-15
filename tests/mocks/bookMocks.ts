import { BookRepository } from "../../src/models/Book/BookRepository.ts";

export const FAKE_BOOK = {
    _id: "66d088ffa9fe0987580c7b1c",
    title: "O Senhor dos Anéis: A Sociedade do Anel",
    author: "J.R.R. Tolkien",
    isbn: "978-8533613379",
    genres: ["Fantasia", "Aventura"],
    publishedDate: new Date("1954-07-29T00:00:00.000Z"),
    quantity: 5,
    available: 5,
    createdAt: new Date(),
    updatedAt: new Date()
};

export const FAKE_BOOK_LIST = [
    FAKE_BOOK,
    {
        ...FAKE_BOOK,
        _id: "66d088ffa9fe0987580c7b1b",
        title: "1984",
        author: "George Orwell",
        isbn: "978-8535914849",
        genres: ["Ficção Científica", "Distopia"],
        quantity: 3,
        available: 3,
    }
];


export function mockBookRepository(overrides: any = {}) {
    return {
        findMany: async () => FAKE_BOOK_LIST,
        
        findById: async (_id: string) => _id === FAKE_BOOK._id ? FAKE_BOOK : null,
        
        exists: async () => false,
        
        createOne: async (data: any) => {
            const result = { ...FAKE_BOOK, ...data };
            return {
                ...result,
                toObject: () => result
            };
        },
        
        updateById: async (_id: string, data: any) => ({ ...FAKE_BOOK, ...data }),
        
        deleteById: async (_id: string) => FAKE_BOOK,

        findByIsbn: async (isbn: string) => isbn === FAKE_BOOK.isbn ? FAKE_BOOK : null,

        borrowOne: async (id: string, session: any) => {
            return {
                ...FAKE_BOOK,
                available: FAKE_BOOK.available - 1,
                toObject: function() { return this; }
            };
        },

        returnOne: async (id: string, session: any) => {
            return {
                ...FAKE_BOOK,
                available: FAKE_BOOK.available + 1,
                toObject: function() { return this; }
            };
        },

        findByIdWithSession: async (id: string, session: any) => {
            if (id === FAKE_BOOK._id) {
                return { ...FAKE_BOOK, toObject: () => FAKE_BOOK };
            }
            return null;
        },

        ...overrides
    } as unknown as BookRepository;
}