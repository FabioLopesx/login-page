#  Login Page — Project

Este projeto é uma aplicação Next.js **com fluxo de autenticação**, incluindo tela de **login**, **cadastro**, área **dashboard privada** e funcionalidade de **alterar senha**. Usei Next.js (App Router), Prisma, JWT e Tailwind para criar uma base segura e moderna.

---

##  Tecnologias usadas

- **Next.js** (App Router, layouts, middleware)
- **TypeScript**
- **Tailwind CSS** (com gradientes e fontes customizadas)
- **Prisma ORM** (acesso ao banco de dados)
- **Autenticação JWT** com cookies HTTP-only
- **Middleware** para proteger rotas privadas
- **next/font** para usar fontes do Google (Bungee, JetBrains Mono)
- **Toaster (sonner)** para notificações (toast) na UI

---

##  Funcionalidades

- Tela **Login** com validação de credenciais e emissão de token JWT  
- Tela **Cadastro** para novos usuários  
- **Rota privada** com dashboard, acessível apenas com token válido  
- **Logout** que limpa o token e bloqueia o acesso com `middleware`  
- Tela **Alterar Senha**, com verificação do usuário logado e proteção de rota  
- **Cache-Control** e headers anti-cache para evitar acesso após logout

---

##  Como rodar localmente

1. Clone o repositório  
   ```bash
   git clone https://github.com/FabioLopesx/login-page.git
   cd login-page

2.Instale as dependências
   npm install
   # ou yarn

3.Configure seu .env
  DATABASE_URL=...
  JWT_SECRET=...
  NEXT_PUBLIC_BASE_URL=http://localhost:3000

4.Gere o cliente Prisma e atualize o DB:
  npx prisma generate
  npx prisma migrate dev --name init

5.Rode o servidor dev:
  npm run dev

6.Acesse no navegador: http://localhost:3000
