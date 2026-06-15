# Frontend React para consumo da API

Interface web em React com Tailwind CSS para autenticar usuarios, armazenar JWT, navegar por rotas protegidas e executar CRUD de usuarios e itens consumindo a API do backend.

## Estrutura

- `src/pages`: telas da aplicacao.
- `src/components`: layout, tabelas, formularios e mensagens.
- `src/context`: controle global de autenticacao.
- `src/services`: cliente HTTP e servicos da API.
- `Dockerfile`: build do React e publicacao com Nginx.
- `docker-compose.yml`: sobe frontend e backend na mesma rede.

## Configuracao

O projeto ja acompanha um `.env` com valores padrao. Ajuste esses valores conforme o backend ou use `.env.example` como modelo:

```env
VITE_API_URL=/api
VITE_AUTH_LOGIN_PATH=/auth/login
VITE_AUTH_ME_PATH=/auth/me
VITE_USERS_PATH=/users
VITE_ITEMS_PATH=/items

FRONTEND_PORT=8080
BACKEND_PORT=3000
BACKEND_CONTEXT=./backend
BACKEND_DOCKERFILE=Dockerfile
```

O frontend chama a API usando `/api`. No container, o Nginx encaminha `/api/*` para `http://backend:3000/*`, permitindo que o navegador acesse tudo por `http://localhost:8080`.

## Como subir com Docker

1. Coloque o backend ja desenvolvido dentro da pasta configurada em `BACKEND_CONTEXT` ou altere essa variavel no `.env`.
2. Confirme que o backend escuta na porta `3000` dentro do container. Se usar outra porta interna, atualize `nginx.conf` e o `docker-compose.yml`.
3. Execute:

```bash
docker compose up --build
```

4. Acesse:

```text
http://localhost:8080
```

## Contratos esperados da API

Os caminhos podem ser alterados no `.env`. Por padrao a aplicacao usa:

- `POST /auth/login`: recebe `email` e `password`. A resposta deve conter um token em `token`, `accessToken`, `access_token` ou `jwt`.
- `GET /auth/me`: opcional, usado para recuperar dados do usuario logado.
- `GET /users`, `POST /users`, `PUT /users/:id`, `DELETE /users/:id`.
- `GET /items`, `POST /items`, `PUT /items/:id`, `DELETE /items/:id`.

Todas as rotas protegidas enviam o JWT no cabecalho:

```http
Authorization: Bearer <token>
```

## Observacoes

Caso o backend use nomes de campos diferentes, ajuste os formularios em `src/pages/UsersPage.jsx` e `src/pages/ItemsPage.jsx`. Caso use endpoints em portugues, por exemplo `/usuarios` e `/itens`, basta alterar `VITE_USERS_PATH` e `VITE_ITEMS_PATH`.
