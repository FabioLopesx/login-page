"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";

import { Mail, User, Eye, EyeClosed } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";

const formSchema = z
  .object({
    nome: z.string().min(2, "O nome deve ter pelo menos 2 caracteres"),
    email: z.string().email("Digite um e-mail válido"),
    password: z
      .string()
      .min(6, {
        message: "Senha deve ter pelo menos 6 caracteres",
      })
      .max(12, {
        message: "Senha não pode ter mais que 12 caracteres",
      }),

    confirmPassword: z
      .string()
      .min(6, {
        message: "Senha deve ter pelo menos 6 caracteres",
      })
      .max(12, {
        message: "Senha não pode ter mais que 12 caracteres",
      }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  });

function RegisterForm() {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nome: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const { reset } = form;

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Erro ao cadastrar.");
      } else {
        toast.success("Usuário criado com sucesso!");
        reset();
      }
    } catch (err) {
      console.error("Erro:", err);
      toast.error("Erro ao enviar dados.");
    }
  }

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <div className="flex min-h-screen items-center justify-center p-4 md:flex-row">
      <div className="grid w-full max-w-7xl grid-cols-1 shadow-2xl shadow-black md:grid-cols-2">
        {/* LADO ESQUERDO */}
        <div className="flex min-h-[400px] items-center justify-center bg-green-100 p-8 md:min-h-[650px]">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="w-full max-w-md space-y-5">
              <h1 className="text-center text-2xl font-semibold text-black">Cadastrar</h1>
              {/* nome */}
              <FormField
                control={form.control}
                name="nome"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="relative">
                        <User
                          className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400 hover:text-black"
                          size={18}
                        />
                        <Input type="text" placeholder="Nome" className="pl-10" {...field} />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

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
              {/* confirmar senha */}
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="relative">
                        {showConfirmPassword ? (
                          <Eye
                            className="absolute top-1/2 left-3 -translate-y-1/2 cursor-pointer text-gray-400 hover:text-black"
                            onClick={() => setShowConfirmPassword(false)}
                            size={18}
                          />
                        ) : (
                          <EyeClosed
                            className="absolute top-1/2 left-3 -translate-y-1/2 cursor-pointer text-gray-400 hover:text-black"
                            onClick={() => setShowConfirmPassword(true)}
                            size={18}
                          />
                        )}
                        <Input
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="Confirmar Senha"
                          className="pl-10"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full bg-black hover:bg-gray-700">
                Fazer cadastro
              </Button>
              <p className="mt-4 text-center text-sm text-gray-500">
                Já tem uma conta?{" "}
                <Link href="/" className="text-black hover:underline">
                  Fazer login
                </Link>
              </p>
            </form>
          </Form>
        </div>

        {/* LADO DIREITO */}
        <div className="relative h-full min-h-[400px] bg-cover md:min-h-[650px]">
          <Image src="/backgroud2.png" alt="Background Image" layout="fill" objectFit="cover" />
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-4">
            <h2 className="text-center text-3xl font-semibold text-black drop-shadow-lg">
              Muito bom te ver!
            </h2>
            <p className="text-center text-lg text-black drop-shadow-md">
              Faça seu cadastro para acessar sua conta.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegisterForm;
