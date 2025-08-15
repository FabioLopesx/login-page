export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { z, ZodError } from "zod";

const bodySchema = z.object({
  email: z.string().email("E-mail inválido"),
  password: z.string().min(6, "Senha deve ter ao menos 6 caracteres"),
});

type JwtPayload = { userId: string };

export async function POST(req: NextRequest) {
  try {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      console.error("JWT_SECRET não configurado");
      return NextResponse.json(
        { error: "Configuração inválida" },
        { status: 500 }
      );
    }

    // Validação do corpo
    const json = await req.json();
    const { email, password } = bodySchema.parse(json);

    // Buscar usuário
    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true, name: true, email: true, password: true, slug: true },
    });

    // Conferir credenciais
    if (!user) {
      return NextResponse.json(
        { error: "Credenciais inválidas" },
        { status: 401 }
      );
    }

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) {
      return NextResponse.json(
        { error: "Credenciais inválidas" },
        { status: 401 }
      );
    }

    //  Gerar JWT
    const token = jwt.sign({ userId: user.id } satisfies JwtPayload, secret, {
      expiresIn: "1h",
    });

    // Definir cookie HttpOnly
    const cookieStore = await cookies();
    cookieStore.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 dias
    });

    return NextResponse.json({
      message: "Login bem-sucedido",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        slug: user.slug,
      },
    });
  } catch (err: unknown) {
    if (err instanceof ZodError) {
      return NextResponse.json(
        { error: err.issues[0]?.message ?? "Dados inválidos" },
        { status: 400 }
      );
    }
    console.error("Erro no login:", err);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
