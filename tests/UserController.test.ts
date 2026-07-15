import { assertEquals, assertExists } from "@std/assert";
import { UserController } from "../src/controllers/UserController.ts";
import { UserService } from "../src/services/UserService.ts";
import { UserRules } from "../src/models/User/UserRules.ts";
import { FAKE_USER, FAKE_USER_LIST, mockUserRepository, mockBorrowRepository } from "./mocks/userMocks.ts";
import { mockRequest, mockResponse, createMockNext } from "./mocks/expressMock.ts";

/**
 * Função utilitária para aplicar o DRY (Don't Repeat Yourself).
 * Instancia o Controller e suas dependências de forma limpa para cada teste.
 * Permite injetar comportamentos específicos (overrides) quando necessário.
 */
function makeSut(userOverrides: any = {}, borrowOverrides: any = {}) {
    const userRepo = mockUserRepository(userOverrides);
    const borrowRepo = mockBorrowRepository(borrowOverrides);
    const service = new UserService(userRepo, borrowRepo);
    const rules = new UserRules();
    const controller = new UserController(service, rules);
    
    return { controller };
}

// ==========================================
// TESTES POSITIVOS
// ==========================================

Deno.test({
    name: "UserController - create: Deve criar um usuário com sucesso",
    async fn() {
        const { controller } = makeSut();
        
        const req = mockRequest({ 
            body: { name: "novo", email: "novo@teste.com", password: "coxinha123" } 
        });
        const res = mockResponse();
        const next = createMockNext();
        
        await controller.create(req, res, next);

        assertEquals(res._getStatus(), 201);
        assertEquals(res._getResult().message, "Usuário criado com sucesso");
        assertEquals(res._getResult().data.email, "novo@teste.com");
        assertEquals(next.getError(), null);
    }
});

Deno.test({
    name: "UserController - list: Deve retornar todos os usuários",
    async fn() {
        const { controller } = makeSut();
        
        const req = mockRequest({});
        const res = mockResponse();
        const next = createMockNext();

        await controller.list(req, res, next);

        assertEquals(res._getResult(), {
            message: 'Lista de usuários recuperada',
            data: FAKE_USER_LIST
        });
        assertEquals(next.getError(), null);
    }
});

Deno.test({
    name: "UserController - find: Deve retornar um usuário por seu id",
    async fn() {
        const { controller } = makeSut();
        
        const req = mockRequest({ params: { id: FAKE_USER._id } });
        const res = mockResponse();
        const next = createMockNext();

        await controller.find(req, res, next);

        assertEquals(res._getResult(), {
            message: 'Usuário encontrado',
            data: FAKE_USER
        });
        assertEquals(next.getError(), null);
    }
});

Deno.test({
    name: "UserController - update: Deve atualizar um usuário com sucesso",
    async fn() {
        const dadosAtualizados = { name: "Usuário Atualizado" };

        const { controller } = makeSut({
            updateById: async (id: string, data: any) => {
                assertEquals(id, FAKE_USER._id);
                return { ...FAKE_USER, ...data };
            }
        });

        const req = mockRequest({ 
            params: { id: FAKE_USER._id },
            body: dadosAtualizados
        });
        const res = mockResponse();
        const next = createMockNext();

        await controller.update(req, res, next);

        assertEquals(res._getResult(), {
            message: 'Usuário atualizado com sucesso',
            data: { ...FAKE_USER, ...dadosAtualizados }
        });
        assertEquals(next.getError(), null);
    }
});

Deno.test({
    name: "UserController - remove: Deve remover um usuário com sucesso",
    async fn() {
        const { controller } = makeSut({
            deleteById: async (id: string) => {
                assertEquals(id, FAKE_USER._id);
                return FAKE_USER;
            }
        });
        
        const req = mockRequest({ params: { id: FAKE_USER._id } });
        const res = mockResponse();
        const next = createMockNext();
        
        await controller.remove(req, res, next);

        assertEquals(res._getResult(), {
            message: "Usuário removido com sucesso",
            data: FAKE_USER._id
        });
        assertEquals(next.getError(), null);
    }
});

// ==========================================
// TESTES NEGATIVOS
// ==========================================

Deno.test({
    name: "UserController - create: Deve falhar se o email já estiver cadastrado (Conflict)",
    async fn() {
        const { controller } = makeSut({
            exists: async () => true 
        });
        
        const req = mockRequest({ 
            body: { name: "Teste", email: "jaexiste@teste.com", password: "coxinha123" } 
        });
        const res = mockResponse();
        const next = createMockNext();
        
        await controller.create(req, res, next);

        const error = next.getError();
        assertExists(error, "O erro deveria ter sido capturado pelo next()");
        
        assertEquals(error.status, "CONFLICT");
        assertEquals(error.message, "Email já cadastrado");
    }
});

Deno.test({
    name: "UserController - list: Deve falhar se nenhum usuário for encontrado (Not Found)",
    async fn() {
        const { controller } = makeSut({
            findMany: async () => [] 
        });
        
        const req = mockRequest({});
        const res = mockResponse();
        const next = createMockNext();

        await controller.list(req, res, next);

        const error = next.getError();
        assertExists(error, "O erro deveria ter sido capturado pelo next()");

        assertEquals(error.status, "NOT_FOUND");
        assertEquals(error.message, "Nenhum usuário encontrado");
    }
});

Deno.test({
    name: "UserController - find: Deve falhar se o usuário não existir (Not Found)",
    async fn() {
        const { controller } = makeSut({
            findById: async () => null 
        });
        
        const req = mockRequest({ params: { id: "6a57b2b5b1a85d0858c92c98" } });
        const res = mockResponse();
        const next = createMockNext();

        await controller.find(req, res, next);

        const error = next.getError();
        assertExists(error, "O erro deveria ter sido capturado pelo next()");

        assertEquals(error.status, "NOT_FOUND");
        assertEquals(error.message, "Usuário não encontrado");
    }
});

Deno.test({
    name: "UserController - update: Deve falhar ao tentar atualizar um usuário inexistente (Not Found)",
    async fn() {
        const { controller } = makeSut({
            findById: async () => null
        });

        const req = mockRequest({ 
            params: { id: "6a57b2b5b1a85d0858c92c98" },
            body: { name: "Tentativa de Atualização" }
        });
        const res = mockResponse();
        const next = createMockNext();

        await controller.update(req, res, next);

        const error = next.getError();
        assertExists(error, "O erro deveria ter sido capturado pelo next()");

        assertEquals(error.status, "NOT_FOUND");
        assertEquals(error.message, "Usuário não encontrado");
    }
});

Deno.test({
    name: "UserController - remove: Deve impedir deleção se o usuário tiver empréstimo ativo (Bad Request)",
    async fn() {
        const { controller } = makeSut(
            {}, 
            { findByUserId: async () => [{ status: "borrowed" }] }
        );
        
        const req = mockRequest({ params: { id: FAKE_USER._id } });
        const res = mockResponse();
        const next = createMockNext();
        
        await controller.remove(req, res, next);

        const error = next.getError();
        assertExists(error, "O erro deveria ter sido capturado pelo next()");

        assertEquals(error.status, "BAD_REQUEST");
        assertEquals(error.message, "Não é possível remover um usuário com empréstimos ativos");
    }
});