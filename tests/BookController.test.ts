import { assertEquals, assertExists } from "@std/assert";
import { BookController } from "../src/controllers/BookController.ts";
import { BookService } from "../src/services/BookService.ts";
import { BookRules } from "../src/models/Book/BookRules.ts";
import { FAKE_BOOK, FAKE_BOOK_LIST, mockBookRepository } from "./mocks/bookMocks.ts";
import { mockRequest, mockResponse, createMockNext } from "./mocks/expressMock.ts";
import { mockBorrowRepository } from "./mocks/borrowMocks.ts";

/**
 * Factory Function (makeSut) para aplicar DRY nos testes do BookController.
 * Cria instâncias novas de Repositórios, Serviço e Controller a cada teste.
 */
function makeSut(bookOverrides: any = {}, borrowOverrides: any = {}) {
    const bookRepo = mockBookRepository(bookOverrides);
    const borrowRepo = mockBorrowRepository(borrowOverrides);
    const service = new BookService(bookRepo, borrowRepo);
    const rules = new BookRules();
    const controller = new BookController(service, rules);
    
    return { controller };
}

// ==========================================
// TESTES POSITIVOS
// ==========================================

Deno.test({
    name: "BookController - create: Deve criar um livro com sucesso",
    async fn() {
        const { controller } = makeSut();
        
        const req = mockRequest({ 
            body: { 
                title: "Hobbit",
                author: "J.R.R. Tolkien",
                isbn: "978-8578277109",
                genres: ["Fantasia", "Aventura"],
                publishedDate: new Date("2013-01-01T00:00:00.000Z"),
                quantity: 15,
                available: 15,
            } 
        });
        const res = mockResponse();
        const next = createMockNext();
        
        await controller.create(req, res, next);

        assertEquals(res._getStatus(), 201);
        assertEquals(res._getResult().message, "Livro criado com sucesso");
        assertEquals(res._getResult().data.title, "Hobbit");
        assertEquals(next.getError(), null);
    }
});

Deno.test({
    name: "BookController - list: Deve retornar todos os livros",
    async fn() {
        const { controller } = makeSut();
        
        const req = mockRequest({});
        const res = mockResponse();
        const next = createMockNext();

        await controller.list(req, res, next);

        assertEquals(res._getResult(), {
            message: 'Lista de livros recuperada',
            data: FAKE_BOOK_LIST
        });
        assertEquals(next.getError(), null);
    }
});

Deno.test({
    name: "BookController - find: Deve retornar um livro por seu id",
    async fn() {
        const { controller } = makeSut();
        
        const req = mockRequest({ params: { id: FAKE_BOOK._id } });
        const res = mockResponse();
        const next = createMockNext();

        await controller.find(req, res, next);

        assertEquals(res._getResult(), {
            message: 'Livro encontrado',
            data: FAKE_BOOK
        });
        assertEquals(next.getError(), null);
    }
});

Deno.test({
    name: "BookController - findByIsbn: Deve retornar um livro por seu isbn",
    async fn() {
        const { controller } = makeSut();
        
        const req = mockRequest({ params: { isbn: FAKE_BOOK.isbn } });
        const res = mockResponse();
        const next = createMockNext();

        await controller.findByIsbn(req, res, next);

        assertEquals(res._getResult(), {
            message: 'Livro encontrado',
            data: FAKE_BOOK
        });
        assertEquals(next.getError(), null);
    }
});

Deno.test({
    name: "BookController - update: Deve atualizar um Livro com sucesso",
    async fn() {
        const dadosAtualizados = { name: "Livro Atualizado" };

        const { controller } = makeSut({
            updateById: async (id: string, data: any) => {
                assertEquals(id, FAKE_BOOK._id);
                return { ...FAKE_BOOK, ...data };
            }
        });

        const req = mockRequest({ 
            params: { id: FAKE_BOOK._id },
            body: dadosAtualizados
        });
        const res = mockResponse();
        const next = createMockNext();

        await controller.patch(req, res, next);

        assertEquals(res._getResult(), {
            message: 'Livro atualizado com sucesso',
            data: { ...FAKE_BOOK, ...dadosAtualizados }
        });
        assertEquals(next.getError(), null);
    }
});

Deno.test({
    name: "BookController - remove: Deve remover um livro com sucesso",
    async fn() {
        const { controller } = makeSut(
            {
                deleteById: async (id: string) => {
                    assertEquals(id, FAKE_BOOK._id);
                    return FAKE_BOOK;
                }
            },
            {
                findByBookId: async () => [] 
            }
        );
        
        const req = mockRequest({ params: { id: FAKE_BOOK._id } });
        const res = mockResponse();
        const next = createMockNext();
        
        await controller.remove(req, res, next);

        assertEquals(res._getResult(), {
            message: "Livro removido com sucesso",
            data: FAKE_BOOK._id
        });
        assertEquals(next.getError(), null);
    }
});

Deno.test({
    name: "BookController - increaseStock: Deve aumentar a quantidade de livros com sucesso",
    async fn() {
        const { controller } = makeSut({
            findById: async () => ({ ...FAKE_BOOK, quantity: 10, available: 10 }),
            updateById: async (id: string, data: any) => {
                assertEquals(id, FAKE_BOOK._id);
                assertEquals(data.$inc.quantity, 5);
                assertEquals(data.$inc.available, 5);
                return { ...FAKE_BOOK, quantity: 15, available: 15 };
            }
        });
        
        const req = mockRequest({ 
            params: { id: FAKE_BOOK._id },
            body: { quantity: 5 } 
        });
        const res = mockResponse();
        const next = createMockNext();
        
        await controller.increaseStock(req, res, next);

        assertEquals(res._getStatus(), 200);
        assertEquals(res._getResult().message, "Quantidade de livros aumentada com sucesso");
        assertEquals(next.getError(), null);
    }
});

Deno.test({
    name: "BookController - decreaseStock: Deve diminuir a quantidade de livros com sucesso",
    async fn() {
        const { controller } = makeSut({
            findById: async () => ({ ...FAKE_BOOK, available: 5 }),
            updateById: async (id: string, data: any) => {
                assertEquals(data.$inc.quantity, -2);
                return { ...FAKE_BOOK, quantity: 3, available: 3 };
            }
        });
        
        const req = mockRequest({ 
            params: { id: FAKE_BOOK._id },
            body: { quantity: 2 }
        });
        const res = mockResponse();
        const next = createMockNext();
        
        await controller.decreaseStock(req, res, next);

        assertEquals(res._getStatus(), 200);
        assertEquals(res._getResult().message, "Quantidade de livros diminuida com sucesso");
        assertEquals(next.getError(), null);
    }
});

// ==========================================
// TESTES NEGATIVOS
// ==========================================

Deno.test({
    name: "BookController - create: Deve falhar se o ISBN já estiver cadastrado (Conflict)",
    async fn() {
        const { controller } = makeSut({
            exists: async () => true
        });
        
        const req = mockRequest({ 
            body: { 
                title: "Hobbit",
                author: "J.R.R. Tolkien",
                isbn: "978-8578277109",
                genres: ["Fantasia", "Aventura"],
                publishedDate: new Date("2013-01-01T00:00:00.000Z"),
                quantity: 15,
                available: 15,
            } 
        });
        const res = mockResponse();
        const next = createMockNext();
        
        await controller.create(req, res, next);

        const error = next.getError();
        assertExists(error, "O erro deveria ter sido capturado pelo next()");

        assertEquals(error.status, "CONFLICT");
        assertEquals(error.message, "ISBN do livro já cadastrado");
    }
});

Deno.test({
    name: "BookController - list: Deve falhar se não houver livros (Not Found)",
    async fn() {
        const { controller } = makeSut({ findMany: async () => [] });
        
        const req = mockRequest({});
        const res = mockResponse();
        const next = createMockNext();

        await controller.list(req, res, next);

        const error = next.getError();
        assertExists(error, "O erro deveria ter sido capturado pelo next()");

        assertEquals(error.status, "NOT_FOUND");
        assertEquals(error.message, "Nenhum livro foi encontrado");
    }
});

Deno.test({
    name: "BookController - find: Deve falhar se o livro não existir (Not Found)",
    async fn() {
        const { controller } = makeSut({ findById: async () => null });
        
        const req = mockRequest({ params: { id: "6a57b2b5b1a85d0858c92c98" } });
        const res = mockResponse();
        const next = createMockNext();

        await controller.find(req, res, next);

        const error = next.getError();
        assertExists(error, "O erro deveria ter sido capturado pelo next()");

        assertEquals(error.status, "NOT_FOUND");
    }
});

Deno.test({
    name: "BookController - findByIsbn: Deve falhar se o ISBN não existir (Not Found)",
    async fn() {
        const { controller } = makeSut({ findByIsbn: async () => null });
        
        const req = mockRequest({ params: { isbn: "000" } });
        const res = mockResponse();
        const next = createMockNext();

        await controller.findByIsbn(req, res, next);

        const error = next.getError();
        assertExists(error, "O erro deveria ter sido capturado pelo next()");

        assertEquals(error.status, "NOT_FOUND");
    }
});

Deno.test({
    name: "BookController - update: Deve falhar ao atualizar livro inexistente (Not Found)",
    async fn() {
        const { controller } = makeSut({ findById: async () => null });

        const req = mockRequest({ 
            params: { id: "66d088ffa9fe0987580c7f0e" }, 
            body: { title: "X" } 
        });
        const res = mockResponse();
        const next = createMockNext();

        await controller.patch(req, res, next);

        const error = next.getError();
        assertExists(error, "O erro deveria ter sido capturado pelo next()");

        assertEquals(error.status, "NOT_FOUND");
    }
});

Deno.test({
    name: "BookController - remove: Deve impedir remoção se houver empréstimos ativos (Bad Request)",
    async fn() {
        const { controller } = makeSut(
            {}, 
            { findByBookId: async () => [{ status: "borrowed" }] }
        );
        
        const req = mockRequest({ params: { id: FAKE_BOOK._id } });
        const res = mockResponse();
        const next = createMockNext();
        
        await controller.remove(req, res, next);

        const error = next.getError();
        assertExists(error, "O erro deveria ter sido capturado pelo next()");

        assertEquals(error.status, "BAD_REQUEST");
        assertEquals(error.message, "Não é possível remover um livro com empréstimos ativos");
    }
});

Deno.test({
    name: "BookController - decreaseStock: Deve falhar se tentar remover mais que o disponível (Bad Request)",
    async fn() {
        const { controller } = makeSut({
            findById: async () => ({ ...FAKE_BOOK, available: 1 })
        });
        
        const req = mockRequest({ 
            params: { id: FAKE_BOOK._id }, 
            body: { quantity: 10 } 
        });
        const res = mockResponse();
        const next = createMockNext();
        
        await controller.decreaseStock(req, res, next);

        const error = next.getError();
        assertExists(error, "O erro deveria ter sido capturado pelo next()");

        assertEquals(error.status, "BAD_REQUEST");
        assertEquals(error.message, "Não é possível remover mais exemplares do que os disponíveis.");
    }
});