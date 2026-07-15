import { assertEquals, assertExists } from "@std/assert";
import { BorrowController } from "../src/controllers/BorrowController.ts";
import { BorrowService } from "../src/services/BorrowService.ts";
import { BorrowRules } from "../src/models/Borrow/BorrowRules.ts";
import { BookService } from "../src/services/BookService.ts";
import { UserService } from "../src/services/UserService.ts";
import { FAKE_BORROW, FAKE_BORROW_LIST, mockBorrowRepository } from "./mocks/borrowMocks.ts";
import { FAKE_BOOK, mockBookRepository } from "./mocks/bookMocks.ts";
import { FAKE_USER, mockUserRepository } from "./mocks/userMocks.ts";
import { mockRequest, mockResponse, createMockNext } from "./mocks/expressMock.ts";

/**
 * Factory Function (makeSut) para aplicar DRY nos testes do BorrowController.
 * Injeta a árvore completa de dependências (Repositórios -> Serviços -> Controller).
 */
function makeSut(borrowOverrides: any = {}, bookOverrides: any = {}, userOverrides: any = {}) {
    // 1. Mocks dos Repositórios
    const borrowRepo = mockBorrowRepository(borrowOverrides);
    const bookRepo = mockBookRepository(bookOverrides);
    const userRepo = mockUserRepository(userOverrides);

    // 2. Instâncias dos Serviços Base
    const bookService = new BookService(bookRepo, borrowRepo);
    const userService = new UserService(userRepo, borrowRepo);

    // 3. Instância do Serviço Principal
    const service = new BorrowService(borrowRepo, bookService, userService);
    const rules = new BorrowRules();
    const controller = new BorrowController(service, rules);
    
    return { controller };
}

// ==========================================
// TESTES POSITIVOS
// ==========================================

Deno.test({
    name: "BorrowController - list: Deve listar todos os empréstimos",
    async fn() {
        const { controller } = makeSut();
        
        const req = mockRequest({});
        const res = mockResponse();
        const next = createMockNext();

        await controller.list(req, res, next);

        assertEquals(res._getStatus(), 200);
        assertEquals(res._getResult().message, 'Lista de empréstimos recuperada');
        assertEquals(next.getError(), null);
    }
});

Deno.test({
    name: "BorrowController - find: Deve encontrar um empréstimo por id",
    async fn() {
        const { controller } = makeSut();
        
        const req = mockRequest({ params: { id: FAKE_BORROW._id } });
        const res = mockResponse();
        const next = createMockNext();

        await controller.find(req, res, next);

        assertEquals(res._getResult(), {
            message: 'Empréstimo encontrado',
            data: FAKE_BORROW
        });
        assertEquals(next.getError(), null);
    }
});

Deno.test({
    name: "BorrowController - listByUser: Deve listar empréstimos por usuário",
    async fn() {
        const { controller } = makeSut();
        
        const req = mockRequest({ params: { userId: FAKE_BORROW.userId } });
        const res = mockResponse();
        const next = createMockNext();

        await controller.listByUser(req, res, next);

        assertEquals(res._getStatus(), 200);
        assertEquals(res._getResult().message, `Lista de empréstimos recuperada, usuário: ${FAKE_BORROW.userId}`);
        assertEquals(next.getError(), null);
    }
});

Deno.test({
    name: "BorrowController - listByBook: Deve listar empréstimos por livro",
    async fn() {
        const { controller } = makeSut();
        
        const req = mockRequest({ params: { bookId: FAKE_BORROW.bookId } });
        const res = mockResponse();
        const next = createMockNext();

        await controller.listByBook(req, res, next);

        assertEquals(res._getStatus(), 200);
        assertEquals(res._getResult().message, `Lista de empréstimos recuperada, livro: ${FAKE_BORROW.bookId}`);
        assertEquals(next.getError(), null);
    }
});

Deno.test({
    name: "BorrowController - borrow: Deve realizar empréstimo com sucesso usando transação",
    async fn() {
        const { controller } = makeSut(
            {
                createWithSession: async (data: any, session: any) => {
                    assertExists(session, "A sessão de banco não foi passada para o repositório");
                    return { ...FAKE_BORROW, ...data };
                }
            },
            {
                findByIdWithSession: async (id: string, session: any) => {
                    assertExists(session);
                    return { ...FAKE_BOOK, available: 5, toObject: () => FAKE_BOOK };
                },
                borrowOne: async (id: string, session: any) => {
                    assertExists(session);
                    return { ...FAKE_BOOK, available: 4 };
                }
            },
            {
                findByIdWithSession: async (id: string, session: any) => {
                    assertExists(session);
                    return FAKE_USER;
                }
            }
        );

        const req = mockRequest({ 
            params: { userId: FAKE_USER._id, bookId: FAKE_BOOK._id } 
        });
        const res = mockResponse();
        const next = createMockNext();
        
        await controller.borrow(req, res, next);

        if (next.getError()) console.error("ERRO INESPERADO NO NEXT:", next.getError());

        assertEquals(res._getStatus(), 200);
        assertEquals(res._getResult().message, "Empréstimo realizado com sucesso");
        assertEquals(next.getError(), null);
    }
});

Deno.test({
    name: "BorrowController - return: Deve realizar devolução com sucesso",
    async fn() {
        const { controller } = makeSut(
            {
                findByIdWithSession: async (id: string, session: any) => {
                    assertExists(session);
                    return FAKE_BORROW; // Retorna status "active" o que permite a devolução
                },
                updateById: async (id: string, data: any, session: any) => {
                    assertExists(session);
                    return { ...FAKE_BORROW, status: "returned" };
                }
            },
            {
                findByIdWithSession: async (id: string, session: any) => {
                    assertExists(session);
                    return { ...FAKE_BOOK, available: 4, quantity: 5 }; // available < quantity, ok!
                },
                returnOne: async (id: string, session: any) => {
                    assertExists(session);
                    return { ...FAKE_BOOK, available: 5 };
                }
            }
        );
        
        const req = mockRequest({ params: { id: FAKE_BORROW._id } });
        const res = mockResponse();
        const next = createMockNext();
        
        await controller.return(req, res, next);

        if (next.getError()) console.error("ERRO INESPERADO NO NEXT:", next.getError());

        assertEquals(res._getStatus(), 200);
        assertEquals(res._getResult().message, "Devolução realizada com sucesso");
        assertEquals(next.getError(), null);
    }
});

Deno.test({
    name: "BorrowController - remove: Deve remover empréstimo com sucesso",
    async fn() {
        const { controller } = makeSut({
            findById: async () => ({ ...FAKE_BORROW, status: "returned" }),
            deleteById: async () => FAKE_BORROW
        });
        
        const req = mockRequest({ params: { id: FAKE_BORROW._id } });
        const res = mockResponse();
        const next = createMockNext();
        
        await controller.remove(req, res, next);

        if (next.getError()) console.error("ERRO INESPERADO NO NEXT:", next.getError());

        assertEquals(res._getResult(), {
            message: "Empréstimo removido com sucesso",
            data: FAKE_BORROW._id
        });
        assertEquals(next.getError(), null);
    }
});