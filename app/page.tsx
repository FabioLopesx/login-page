"use client";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Eye, EyeClosed, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { toast } from "sonner";

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
  const onSubmitLogin = async (data: { email: string; password: string }) => {
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        credentials: "include",
        body: JSON.stringify(data),
      });

      type LoginResponse = {
        error?: string;
        message?: string;
        user?: { slug?: string };
      };
      let result: LoginResponse | null = null;
      try {
        result = await res.json();
      } catch {
        console.error("Erro ao parsear JSON da resposta");
      }

      if (!res.ok) {
        const msg = result?.error || result?.message || "Erro no login";
        toast.error(msg);
        return;
      }

      toast.success("Login bem-sucedido!");

      if (result?.user?.slug) {
        router.push(`/${result.user.slug}`);
      } else {
        router.push("/dashboard");
      }
    } catch (err) {
      console.error(err);
      toast.error("Erro na requisição");
    }
  };

  const [showPassword, setShowPassword] = useState(false);

  return (
    <section className="flex min-h-screen items-center justify-center p-4 md:flex-row">
      <div className="grid w-full max-w-7xl grid-cols-1 shadow-2xl shadow-black md:grid-cols-2">
        {/* LADO ESQUERDO */}
        <div className="relative h-full min-h-[400px] bg-cover md:min-h-[650px]">
          <Image src="/backgroud2.png" alt="Background Image" layout="fill" objectFit="cover" />
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-4">
            <h2 className="text-center text-3xl font-semibold text-black drop-shadow-lg">
              Bem-vindo de volta!
            </h2>
            <p className="text-center text-lg text-black drop-shadow-md">
              Estamos felizes em vê-lo novamente.
            </p>
            <p className="text-center text-black">Faça login para continuar.</p>
          </div>
        </div>

        {/* LADO DIREITO */}
        <div className="flex min-h-[400px] items-center justify-center bg-green-100 p-8 md:min-h-[650px]">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmitLogin)} className="w-full max-w-md space-y-5">
              <h1 className="text-center text-2xl font-semibold text-black">Login</h1>
              {/* email */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="relative">
                        <Mail
                          className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400 hover:text-black"
                          size={18}
                        />
                        <Input type="email" placeholder="E-mail" className="pl-10" {...field} />
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
                      <div className="relative">
                        {showPassword ? (
                          <Eye
                            className="absolute top-1/2 left-3 -translate-y-1/2 cursor-pointer text-gray-400 hover:text-black"
                            onClick={() => setShowPassword(false)}
                            size={18}
                          />
                        ) : (
                          <EyeClosed
                            className="absolute top-1/2 left-3 -translate-y-1/2 cursor-pointer text-gray-400 hover:text-black"
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
              <Link href="/" className="float-right text-xs text-black hover:underline">
                Esqueceu sua senha?
              </Link>
              <Button
                type="submit"
                className="w-full bg-black hover:bg-gray-700"
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting ? "Entrando..." : "Entrar na minha lista"}
              </Button>
              <p className="mt-4 text-center text-sm text-gray-500">
                Não tem uma conta?{" "}
                <Link href="/register-user" className="text-black hover:underline">
                  Cadastre-se
                </Link>
              </p>
            </form>
          </Form>
        </div>
      </div>
    </section>
  );
}
