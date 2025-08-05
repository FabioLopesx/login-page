"use client";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Eye, EyeClosed, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const formSchema = z.object({
  email: z
    .string()
    .email({
      message: "Email inválido",
    })
    .min(1, {
      message: "Email é obrigatório",
    }),
  password: z
    .string()
    .min(6, {
      message: "Senha deve ter pelo menos 6 caracteres",
    })
    .max(12, {
      message: "Senha não pode ter mais que 12 caracteres",
    }),
});

export default function Home() {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const router = useRouter();
  async function onSubmitLogin(data: { email: string; password: string }) {
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();
      console.log(result);

      if (!res.ok) {
        alert(result.error || "Erro no login");
      } else {
        alert("Login bem-sucedido!");
        router.push(`/${result.user.slug}`); // ✅ redireciona para a página do usuário
      }
    } catch (err) {
      console.error(err);
      alert("Erro na requisição");
    }
  }

  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="flex min-h-screen items-center justify-center md:flex-row p-2">
      <div className="w-full max-w-7xl shadow-2xl shadow-black grid grid-cols-1 md:grid-cols-2">
        {/* LADO ESQUERDO */}
        <div className="relative h-full min-h-[400px] md:min-h-[650px] bg-cover">
          <Image
            src="/backgroud2.png"
            alt="Background Image"
            layout="fill"
            objectFit="cover"
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-4">
            <h2 className="text-3xl font-semibold drop-shadow-lg text-purple-700">
              Bem-vindo de volta!
            </h2>
            <p className="text-purple-700 text-lg drop-shadow-md">
              Estamos felizes em vê-lo novamente.
            </p>
            <p className="text-purple-700">Faça login para continuar.</p>
          </div>
        </div>

        {/* LADO DIREITO */}
        <div className="flex items-center justify-center bg-green-100 min-h-[400px] md:min-h-[650px] p-8">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmitLogin)}
              className="space-y-5 w-full max-w-md "
            >
              <h1 className="text-2xl font-semibold text-center text-purple-700">
                Login
              </h1>
              {/* email */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="relative">
                        <Mail
                          className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400 hover:text-purple-600"
                          size={18}
                        />
                        <Input
                          type="email"
                          placeholder="E-mail"
                          className="pl-10 "
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* senha */}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="relative ">
                        {showPassword ? (
                          <Eye
                            className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400 cursor-pointer hover:text-purple-600"
                            onClick={() => setShowPassword(false)}
                            size={18}
                          />
                        ) : (
                          <EyeClosed
                            className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400 cursor-pointer hover:text-purple-600"
                            onClick={() => setShowPassword(true)}
                            size={18}
                          />
                        )}
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="Senha"
                          className="pl-10"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Link
                href="/"
                className="float-right text-purple-600 hover:underline text-xs"
              >
                Esqueceu sua senha?
              </Link>
              <Button
                type="submit"
                className="w-full bg-purple-600 hover:bg-purple-900"
              >
                Entrar na minha lista
              </Button>
              <p className="text-center text-sm text-gray-500 mt-4">
                Não tem uma conta?{" "}
                <Link
                  href="/cadastro"
                  className="text-purple-600 hover:underline"
                >
                  Cadastre-se
                </Link>
              </p>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
