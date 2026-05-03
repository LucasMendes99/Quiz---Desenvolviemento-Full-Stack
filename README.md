# Quiz Full Stack

Plataforma full stack em português para estudar desenvolvimento de software com quiz, flashcards, jornada de estudos, progresso local e gamificação.

## Funcionalidades

- Quiz funcional de Git e GitHub.
- Fluxo Home -> escolha da trilha -> escolha do modo -> estudo.
- Tela de trilhas com busca e filtros.
- Quiz rápido com 5 perguntas aleatórias.
- Explicação após cada resposta.
- Resultado final com acertos, erros e porcentagem.
- Progresso salvo no navegador com `localStorage`.
- Histórico de tentativas salvo localmente.
- Flashcards de estudo com frente e verso.
- Jornada de estudos Full Stack.
- Revisão de perguntas erradas.
- Perguntas favoritas para revisar depois.
- XP, nível e conquistas.
- Página Sobre e tela 404 personalizada.
- Backend preparado para PostgreSQL com Prisma.

## Tecnologias

- React + Vite no frontend
- Node.js + Express no backend
- Prisma ORM
- PostgreSQL online via `DATABASE_URL`

## Estrutura dos dados

No frontend, os dados de apoio ficam separados em:

- `client/src/data/topics.js`
- `client/src/data/questions.js`
- `client/src/data/flashcards.js`
- `client/src/data/journey.js`

No backend, as perguntas reais do quiz vêm da API e podem ser carregadas do PostgreSQL ou do modo memória.

## Como rodar

1. Instale as dependências:

```bash
npm install
```

2. Copie o arquivo de ambiente do backend:

```bash
cp server/.env.example server/.env
```

3. Preencha `server/.env` com a URL do seu PostgreSQL online.

Você pode usar Neon, Supabase ou outro PostgreSQL hospedado. O importante é ter uma URL no formato `postgresql://...`.

```env
DATABASE_URL="postgresql://usuario:senha@host:5432/banco?schema=public"
PORT=3001
```

Sem `DATABASE_URL`, o backend roda em modo memória para estudo. Com `DATABASE_URL`, ele usa PostgreSQL de verdade.

4. Gere as tabelas no PostgreSQL e coloque os dados iniciais:

```bash
npm run db:migrate
npm run db:seed
```

Use `npm run db:deploy` no lugar de `npm run db:migrate` quando for aplicar migrations em um banco de produção ou hospedado sem ambiente interativo.

5. Inicie frontend e backend:

```bash
npm run dev
```

Frontend: `http://localhost:5173`

Backend: `http://localhost:3001`

## Comandos do banco

```bash
npm run db:migrate
```

Cria ou atualiza as tabelas no PostgreSQL durante desenvolvimento.

```bash
npm run db:seed
```

Cria os temas e as 10 perguntas iniciais sobre Git e GitHub.

```bash
npm run db:studio
```

Abre uma interface visual para olhar as tabelas do banco.

## Deploy

Sugestão de deploy:

- Frontend: Vercel ou Netlify
- Backend: Render, Railway ou Fly.io
- Banco: Neon ou Supabase

Passos gerais:

1. Suba o projeto para o GitHub.
2. Configure o deploy do frontend apontando para a pasta `client`.
3. Configure o deploy do backend apontando para a pasta `server`.
4. Adicione a variável `DATABASE_URL` no ambiente do backend.
5. Rode as migrations no ambiente hospedado:

```bash
npm run db:deploy
npm run db:seed
```

6. Configure o frontend para chamar a URL pública do backend em produção.
