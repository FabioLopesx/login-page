import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { requireAuthPage } from "@/lib/auth";
import UpdatePasswordForm from "./_components/update-password-form";
import { KeyRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Metadata } from "next";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ slug: string }>;
}
export const metadata: Metadata = {
  title: "Update Password",
};

export default async function UpdatePasswordPage({ params }: Props) {
  const { slug } = await params;

  const { userId } = await requireAuthPage();

  const user = await prisma.user.findUnique({
    where: { slug },
    select: { id: true, name: true, slug: true },
  });
  if (!user) notFound();

  if (user.id !== userId) {
    notFound();
  }

  return (
    <section className="font-bungee flex min-h-screen items-center justify-center p-4">
      <div className="min-h-[80vh] w-full max-w-5xl bg-white shadow-2xl shadow-black">
        <Button variant="default" className="m-4" asChild>
          <Link href={`/${user.slug}`}>Voltar</Link>
        </Button>
        <div className="mb-12 flex items-center justify-center">
          <KeyRound className="text-muted-foreground h-5 w-5" fill="orange" color="black" />
          <h1 className="pl-1 text-center text-2xl">Alterar senha</h1>
        </div>

        <p className="text-center text-lg">
          Olá {user.name}! Esse é o nosso formulário para{" "}
          <span className="text-red-600">alteração de senha.</span>
        </p>
        <div>
          <UpdatePasswordForm />
        </div>
      </div>
    </section>
  );
}
