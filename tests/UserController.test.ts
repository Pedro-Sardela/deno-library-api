import { assertEquals } from "@std/assert";
import { UserController } from "../src/controllers/UserController.ts";
import { UserService } from "../src/services/UserService.ts";
import { UserRules } from "../src/models/User/UserRules.ts";
import { FAKE_USER, FAKE_USER_LIST, mockUserRepository, mockBorrowRepository } from "./mocks/userMocks.ts";
import { mockRequest, mockResponse, createMockNext } from "./mocks/expressMock.ts";

Deno.test({
    name: "UserController - create: Deve criar um usuário com sucesso",
    async fn() {
        const repo = mockUserRepository();
        const borrowRepo = mockBorrowRepository();
        const controller = new UserController(new UserService(repo, borrowRepo), new UserRules());
        
        const req = mockRequest({ 
            body: { 
                name: "novo", 
                email: "novo@teste.com", 
                password: "coxinha123" 
            } 
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
        const repo = mockUserRepository();
        const borrowRepo = mockBorrowRepository();
        const controller = new UserController(new UserService(repo, borrowRepo), new UserRules());
        
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
        const repo = mockUserRepository();
        const borrowRepo = mockBorrowRepository();
        const controller = new UserController(new UserService(repo, borrowRepo), new UserRules());
        
        const req = mockRequest({ params: { id: "66d088ffa9fe0987580c7f0e" } });
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
    name: "UserController - find: Deve retornar um usuário após o update",
    async fn() {
        const repo = mockUserRepository();
        const borrowRepo = mockBorrowRepository();
        const controller = new UserController(new UserService(repo, borrowRepo), new UserRules());

        const dadosAtualizados = { name: "Usuário Atualizado" };
        const req = mockRequest({ 
            params: { id: FAKE_USER._id },
            body: dadosAtualizados
        });
        const res = mockResponse();
        const next = createMockNext();

        await controller.update(req, res, next);

        assertEquals(res._getResult(), {
            message: 'Usuário atualizado com sucesso',
            data: FAKE_USER
        });
        assertEquals(next.getError(), null);
    }
});

Deno.test({
    name: "UserController - remove: Deve impedir deleção se tiver empréstimo ativo",
    async fn() {
        const borrowRepo = mockBorrowRepository({
            findByUserId: async () => [{ status: "borrowed" }] as any
        });
        
        const repo = mockUserRepository();
        const controller = new UserController(new UserService(repo, borrowRepo), new UserRules());
        
        const req = mockRequest({ params: { id: FAKE_USER._id } });
        const res = mockResponse();
        const next = createMockNext();
        
        await controller.remove(req, res, next);

        const erroCapturado = next.getError();

        assertEquals(erroCapturado.status, "BAD_REQUEST");
        assertEquals(erroCapturado.message, "Não é possível remover um usuário com empréstimos ativos");
        assertEquals(res._getResult(), null);
    }
});

