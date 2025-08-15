// lib/auth.ts
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { redirect } from "next/navigation";

type JwtPayload = { userId: string };

/** Lê o cookie e valida o JWT. Retorna { userId } ou null. */
export async function getSession(): Promise<{ userId: string } | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  if (!token) return null;

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
    return { userId: payload.userId };
  } catch {
    return null;
  }
}

/**redireciona para /login se não autenticado. */
export async function requireAuthPage() {
  const session = await getSession();
  if (!session) redirect("/");
  return session;
}

/** retorna 401 se não autenticado*/
export async function requireAuthAPI() {
  return getSession();
}
