import { Metadata } from "next";
import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { FileCode2, Atom, Braces, Server } from "lucide-react";
import LogoutButton from "./button-logout/page";
import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { Button } from "@/components/ui/button";

interface Props {
  params: Promise<{ slug: string }>;
}

export const metadata: Metadata = {
  title: "Dashboard",
};

type Card = {
  title: string;
  description: string;
  href: string;
  icon: LucideIcon;
  color: string;
};

const cards: Card[] = [
  {
    title: "HTML & CSS",
    description: "Domine a base do desenvolvimento web.",
    href: "https://www.youtube.com/watch?v=bCFTv8a59PE&list=PLbIBj8vQhvm00J3f3rD33tRuNLem8EgEA",
    icon: FileCode2,
    color: "border-orange-400/60 hover:border-orange-400",
  },
  {
    title: "React",
    description: "Componentes, estado, hooks e boas práticas.",
    href: "https://www.youtube.com/watch?v=2RWsLmu8yVc&t=1s",
    icon: Atom,
    color: "border-sky-400/60 hover:border-sky-400",
  },
  {
    title: "TypeScript",
    description: "Tipos, interfaces e segurança em escala.",
    href: "https://www.youtube.com/watch?v=w2BA05gabP0",
    icon: Braces,
    color: "border-indigo-400/60 hover:border-indigo-400",
  },
  {
    title: "Node.js",
    description: "API, Express e autenticação na prática.",
    href: "https://www.youtube.com/watch?v=PyrMT0GA3sE&t=1s",
    icon: Server,
    color: "border-emerald-400/60 hover:border-emerald-400",
  },
];

export default async function DashBoardBySlug({ params }: Props) {
  const { slug } = await params;

  // 1) Autenticação
  const cookieStore = await cookies(); // Next 14+
  const token = cookieStore.get("token")?.value;
  if (!token) redirect("/");

  let userIdFromToken: string;
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: string;
    };
    userIdFromToken = payload.userId;
  } catch {
    redirect("/");
  }

  // 2) Buscar dono do slug
  const user = await prisma.user.findUnique({
    where: { slug },
    select: { id: true, name: true, slug: true },
  });

  if (!user) notFound();

  // 4) Autorização
  if (user.id !== userIdFromToken) {
    notFound();
  }

  return (
    <section className="font-bungee flex min-h-screen items-center justify-center p-4">
      <div className="h-full w-full max-w-7xl space-y-4 bg-white p-5 shadow-2xl shadow-black md:h-[80vh]">
        <header className="flex justify-between pb-2">
          <Button variant="default" asChild>
            <Link href={`/${slug}/update-password`}>Alterar senha</Link>
          </Button>
          <LogoutButton />
        </header>

        {/* Saudação */}
        <div className="space-y-4 text-center">
          <h1 className="text-2xl tracking-tight sm:text-3xl">Olá, {user?.name} 👋</h1>

          <p className="px-5 text-base text-gray-500">
            Seja bem-vindo ao seu dashboard.
            {"  "}
            Separei alguns conteúdos especiais para acelerar seu aprendizado. Explore os cards
            abaixo e avance no seu ritmo 🚀
          </p>
        </div>

        {/* GRID DE CARDS */}
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map((c) => (
            <Link
              key={c.title}
              href={c.href}
              target="_blank"
              className={`group relative overflow-hidden rounded-2xl border ${c.color} bg-gradient-to-b from-white to-white/90 p-5 shadow transition-all hover:-translate-y-0.5 hover:shadow-lg focus-visible:ring-2 focus-visible:ring-black/20 focus-visible:outline-none`}
            >
              <div className="flex items-center gap-3">
                <c.icon className="size-6 opacity-80 transition-opacity group-hover:opacity-100" />
                <h3 className="text-lg font-bold tracking-tight">{c.title}</h3>
              </div>
              <p className="mt-2 text-sm text-gray-500">{c.description}</p>

              <span className="mt-4 inline-flex items-center text-sm font-medium opacity-80">
                Acessar
                <svg
                  className="ml-1 size-4 translate-x-0 transition-transform group-hover:translate-x-0.5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M5 12h14" />
                  <path d="m12 5 7 7-7 7" />
                </svg>
              </span>

              <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity group-hover:opacity-100">
                <div className="absolute -inset-1 -z-10 bg-gradient-to-tr from-transparent via-white/30 to-transparent blur-2xl" />
              </div>
            </Link>
          ))}
        </div>

        {/* Rodapé */}
        <div className="mt-10 w-full max-w-7xl rounded-2xl bg-white p-3 text-center text-sm text-gray-500 shadow-md ring-1 shadow-black ring-black/5 md:mt-16">
          Continue estudando e evoluindo. Cada linha de código é um passo para o sucesso. Você
          consegue! 💪
        </div>
      </div>
    </section>
  );
}
