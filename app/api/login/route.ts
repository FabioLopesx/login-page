import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; // ajuste o caminho se necessário
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email e senha são obrigatórios" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Usuário não encontrado" },
        { status: 404 }
      );
    }

    const senhaCorreta = await bcrypt.compare(password, user.password);

    if (!senhaCorreta) {
      return NextResponse.json({ error: "Senha incorreta" }, { status: 401 });
    }

    // Aqui poderia gerar um JWT ou setar um cookie
    return NextResponse.json({
      message: "Login bem-sucedido",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        slug: user.slug,
      },
    });
  } catch (error) {
    console.error("Erro no login:", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
