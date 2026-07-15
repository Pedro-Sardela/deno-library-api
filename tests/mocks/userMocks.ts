import { UserRepository } from "../../src/models/User/UserRepository.ts";
import { BorrowRepository } from "../../src/models/Borrow/BorrowRepository.ts";

export const FAKE_USER = {
    _id: '66d088ffa9fe0987580c7f0e',
    name: 'novo',
    email: 'novo@teste.com',
    passowrd: 'coxinha123',
    createdAt: '2024-08-29T14:43:11.279Z',
    updatedAt: '2024-08-29T14:43:11.279Z',
    __v: 0
};

export const FAKE_USER2 = {
    _id: '22',
    name: 'novo',
    email: 'novo@teste.com',
    passowrd: 'coxinha123',
    createdAt: '2024-08-29T14:43:11.279Z',
    updatedAt: '2024-08-29T14:43:11.279Z',
    __v: 0
};


export const FAKE_USER_LIST = [
    FAKE_USER,
    { ...FAKE_USER, _id: '12345', name: 'Another User' }
];

export function mockUserRepository(overrides: Partial<UserRepository> = {}) {
    return {
        findMany: async () => FAKE_USER_LIST,
        findById: async (_id: string) => _id === FAKE_USER._id ? FAKE_USER : null,
        exists: async () => false,
        
        createOne: async (data: any) => {
            const result = { ...FAKE_USER, ...data };
            return {
                ...result,
                toObject: () => result
            };
        },
        
        updateById: async (_id: string, data: any) => ({ ...FAKE_USER, ...data }),
        deleteById: async (_id: string) => FAKE_USER,
        
        ...overrides
    } as unknown as UserRepository;
}
export function mockBorrowRepository(overrides: Partial<BorrowRepository> = {}) {
    return {
        findByUserId: async (_id: string) => [], 
        ...overrides
    } as unknown as BorrowRepository;
}