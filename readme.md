# API GERENCIAMENTO DE BIBLIOTECA
## _Sistema de Controle e Empréstimo de Livros_

Essa é uma API minimalista construída com a biblioteca Express rodando no ambiente Deno, projetada para gerenciar uma biblioteca, incluindo usuários, acervo de livros e controle de empréstimos.

- Express web framework
- TypeScript como linguagem principal
- Deno runtime
- Autenticação JWT e middlewares de segurança
- Mongoose ODM
- Mongo DB - Altas

## Funcionalidades

- CRUD completo para Usuários e Livros
- Controle de estoque de livros (incremento e decremento)
- Sistema de Empréstimos (Borrow) e Devolução (Return) de livros
- Autenticação baseada em identidade do usuário (JWT)
- Rotas protegidas exigindo autenticação para operações sensíveis

## Como executar
- clone este repositório
    ```bash
    git clone git@github.com:pedro-sardela/deno-library-api.git
    cd deno-library-api
    ```
    
- Instale Deno (se necessário)
    ```bash
    curl -fsSL [https://deno.land/install.sh](https://deno.land/install.sh) | sh
    # Adicione Deno ao PATH (se instalado via script)
    export PATH="$HOME/.deno/bin:$PATH"
    ```
- Instale dependências
    ```bash
    deno install
    # Para iniciar o servidor
    deno run dev
    ```
- Execute testes    
    ```bash    
    deno run test:watch
    ```


## Rotas do sistema
## API Endpoints

### Auth (`/api/auth`)

| Método | Rota | Auth | Descrição |
|--------|------|------|-----------|
| `POST` | `/login` | ❌ | Autentica usuário e retorna Token |

### Users (`/api/users`)

| Método | Rota | Auth | Descrição |
|--------|------|------|-----------|
| `POST` | `/users` | ❌ | Cria novo usuário (registro público) |
| `GET` | `/users` | ✅ | Lista todos os usuários |
| `GET` | `/users/:id` | ✅ | Busca usuário específico por ID |
| `PUT` | `/users/:id` | ✅ | Atualiza dados do usuário |
| `DELETE` | `/users/:id` | ✅ | Remove o usuário do sistema |

### Books (`/api/books`)

| Método | Rota | Auth | Descrição |
|--------|------|------|-----------|
| `POST` | `/books` | ✅ | Cadastra um novo livro no acervo |
| `GET` | `/books` | ✅ | Lista todos os livros |
| `GET` | `/books/:id` | ✅ | Busca um livro específico por ID |
| `GET` | `/books/isbn/:isbn` | ✅ | Busca um livro específico pelo seu ISBN |
| `PATCH` | `/books/:id` | ✅ | Atualiza informações parciais de um livro |
| `PATCH` | `/books/stock/increase/:id` | ✅ | Aumenta o estoque de um livro específico |
| `PATCH` | `/books/stock/decrease/:id` | ✅ | Diminui o estoque de um livro específico |
| `DELETE` | `/books/:id` | ✅ | Remove o livro do acervo |

### Borrow - Empréstimos (`/api/borrow`)

| Método | Rota | Auth | Descrição |
|--------|------|------|-----------|
| `POST` | `/borrow/:userId/:bookId` | ✅ | Registra o empréstimo de um livro para um usuário |
| `GET` | `/borrow` | ✅ | Lista todos os registros de empréstimos |
| `GET` | `/borrow/:id` | ✅ | Busca um registro de empréstimo por ID |
| `GET` | `/borrow/user/:userId` | ✅ | Lista todos os empréstimos realizados por um usuário |
| `GET` | `/borrow/book/:bookId` | ✅ | Lista todos os empréstimos atrelados a um livro |
| `PATCH` | `/borrow/:id/return` | ✅ | Registra a devolução de um empréstimo ativo |
| `DELETE` | `/borrow/:id` | ✅ | Remove o registro de um empréstimo |

**Legenda:**
- ✅ = Requerido
- ❌ = Não requerido
- **Auth** = Autenticação JWT (Middleware `auth`)