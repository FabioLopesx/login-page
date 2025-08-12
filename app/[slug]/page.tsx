// app/[slug]/page.tsx
import { prisma } from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
// opcional: se for proteger via cookie/JWT
// import { cookies } from "next/headers";
// import jwt from "jsonwebtoken";

interface Props {
  params: { slug: string };
}

// se a página depende do banco sempre:
export const dynamic = "force-dynamic";

export default async function DashboardBySlug({ params }: Props) {
  // (opcional) valida cookie/JWT aqui e redireciona se precisar
  // const token = cookies().get("token")?.value;
  // if (!token) redirect("/");

  const user = await prisma.user.findUnique({
    where: { slug: params.slug },
    // include: { mercados: true, listas: true } // se tiver
  });

  if (!user) return notFound();

  return (
    <div className="max-w-4xl mx-auto p-6 h-full">
      <h1 className="text-3xl font-bold">Olá, {user.name}! 👋</h1>

      <div className="mt-6">
        <h2 className="text-xl font-semibold">Resumo</h2>
        <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="rounded-lg border p-4">
            <p className="text-sm text-gray-500">E-mail</p>
            <p className="font-medium">{user.email}</p>
          </div>
          <div className="rounded-lg border p-4">
            <p className="text-sm text-gray-500">Slug</p>
            <p className="font-medium">{user.slug}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
