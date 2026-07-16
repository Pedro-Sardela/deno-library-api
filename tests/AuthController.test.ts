import { assertEquals, assertExists } from "@std/assert";
import { AuthController } from "../src/controllers/AuthController.ts";
import { FAKE_LOGIN_CREDENTIALS, FAKE_TOKEN, mockAuthService } from "./mocks/authMocks.ts";
import { mockRequest, mockResponse, createMockNext } from "./mocks/expressMock.ts";

function makeSut(serviceOverrides: any = {}) {
    // Injeta o mock do AuthService no AuthController
    const service = mockAuthService(serviceOverrides);
    const controller = new AuthController(service as any);
    
    return { controller, service };
}

Deno.test({
    name: "AuthController - login: Deve realizar login com sucesso e retornar o token",
    async fn() {
        const { controller } = makeSut();
        
        const req = mockRequest({ body: FAKE_LOGIN_CREDENTIALS });
        const res = mockResponse();
        const next = createMockNext();

        await controller.login(req, res, next);

        assertEquals(res._getStatus(), 200); 
        assertEquals(res._getResult().message, "Login realizado com sucesso");
        assertEquals(res._getResult().data, FAKE_TOKEN); // Espera o token mockado
        assertEquals(next.getError(), null);
    }
});

Deno.test({
    name: "AuthController - login: Deve retornar BadRequest se email não for enviado",
    async fn() {
        const { controller } = makeSut();
        
        const req = mockRequest({ body: { password: "123" } }); // Sem e-mail
        const res = mockResponse();
        const next = createMockNext();

        await controller.login(req, res, next);

        const error = next.getError();
        assertExists(error, "Deveria ter chamado o next com um erro");
        assertEquals(error.message, "Email e senha são obrigatórios");
        assertEquals(error.status, 'BAD_REQUEST');
    }
});

Deno.test({
    name: "AuthController - login: Deve repassar o erro para o next() se o AuthService falhar",
    async fn() {
        // Sobrescreve o comportamento do mock para forçar um erro
        const { controller } = makeSut({
            login: async () => { throw new Error("Usuário ou senha inválidos"); }
        });
        
        const req = mockRequest({ body: FAKE_LOGIN_CREDENTIALS });
        const res = mockResponse();
        const next = createMockNext();

        await controller.login(req, res, next);

        const error = next.getError();
        assertExists(error);
        assertEquals(error.message, "Usuário ou senha inválidos");
    }
});