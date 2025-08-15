export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z, ZodError } from "zod";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { requireAuthAPI } from "@/lib/auth";

const bodySchema = z.object({
  oldPassword: z.string().min(6),
  newPassword: z.string().min(6),
});

export async function PUT(req: NextRequest) {
  try {
    // 1) Autenticação
    const session = await requireAuthAPI();
    if (!session) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      console.error("JWT_SECRET não configurado");
      return NextResponse.json(
        { error: "Configuração inválida" },
        { status: 500 }
      );
    }

    // 2) Validação do corpo
    const json = await req.json();
    const { oldPassword, newPassword } = bodySchema.parse(json);
    if (oldPassword === newPassword) {
      return NextResponse.json(
        { error: "A nova senha deve ser diferente da antiga" },
        { status: 400 }
      );
    }

    // 3) Buscar usuário do token
    const user = await prisma.user.findUnique({
      where: { id: session.userId },
      select: { id: true, password: true },
    });
    if (!user) {
      return NextResponse.json(
        { error: "Usuário não encontrado" },
        { status: 404 }
      );
    }

    // 4) Conferir senha antiga
    const ok = await bcrypt.compare(oldPassword, user.password);
    if (!ok) {
      return NextResponse.json(
        { error: "Senha antiga incorreta" },
        { status: 401 }
      );
    }

    // 5) Atualizar senha
    const newHash = await bcrypt.hash(newPassword, 12);
    await prisma.user.update({
      where: { id: user.id },
      data: { password: newHash },
    });

    // 6) Rotacionar token (opcional)
    const newToken = jwt.sign({ userId: user.id }, secret, { expiresIn: "7d" });

    // Em route handlers, setar cookies é via next/headers:
    const cookieStore = await import("next/headers").then((m) => m.cookies());
    (await cookieStore).set("token", newToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return NextResponse.json({ message: "Senha atualizada com sucesso" });
  } catch (err: unknown) {
    if (err instanceof ZodError) {
      return NextResponse.json(
        { error: err.issues[0]?.message ?? "Dados inválidos" },
        { status: 400 }
      );
    }
    console.error("Erro ao atualizar senha:", err);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
