import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma"; // Ajuste o caminho se necessário

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { nome, email, password, confirmPassword } = body;
    console.log(body);

    // Validação simples (você já usa zod no front)
    if (!nome || !email || !password || password !== confirmPassword) {
      return NextResponse.json({ error: "Dados inválidos" }, { status: 400 });
    }

    // Verifica se o email já existe
    const userExists = await prisma.user.findUnique({
      where: { email },
    });

    if (userExists) {
      return NextResponse.json(
        { error: "E-mail já cadastrado" },
        { status: 409 }
      );
    }

    // Criptografa a senha
    const hashedPassword = await bcrypt.hash(password, 10);

    // Cria o novo usuário
    const newUser = await prisma.user.create({
      data: {
        name: nome,
        email,
        password: hashedPassword,
      },
    });

    return NextResponse.json(
      { message: "Usuário criado com sucesso", user: newUser },
      { status: 201 }
    );
  } catch (error) {
    console.error("Erro ao criar usuário:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
