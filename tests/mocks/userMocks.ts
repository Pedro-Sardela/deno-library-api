import { UserRepository } from "../../src/models/User/UserRepository.ts";
import { BorrowRepository } from "../../src/models/Borrow/BorrowRepository.ts";

export const FAKE_USER = {
    _id: '66d088ffa9fe0987580c7f0e',
    name: 'fake',
    email: 'fake@teste.com',
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
        findById: async (_id: string) => _id === FAKE_USER._id ? FAKE_USER : null ,
        exists: async () => false,
        createOne: async (data: any) => ({ ...FAKE_USER, ...data }),
        updateById: async (_id: string, data: any) => ({ ...FAKE_USER, ...data }),
        deleteById: async (_id: string) => FAKE_USER,
        
        ...overrides
    } as any;
}

export function mockBorrowRepository(overrides: Partial<BorrowRepository> = {}) {
    return {
        findByUserId: async (_id: string) => [], 
        ...overrides
    } as unknown as BorrowRepository;
}