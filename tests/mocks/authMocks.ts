export const FAKE_LOGIN_CREDENTIALS = {
    email: "usuario@teste.com",
    password: "senha_super_secreta"
};

export const FAKE_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.fake_token_mockado_para_testes";

export function mockAuthService(overrides: any = {}) {
    return {
        login: async (email: string, password: string) => {
            return FAKE_TOKEN;
        },
        ...overrides
    };
}