"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";

import { Mail, User, Eye, EyeClosed } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

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

function CadastroForm() {
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
      const res = await fetch("/api/cadastro", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Erro ao cadastrar.");
      } else {
        alert("Usuário criado com sucesso!");
        reset();
      }
    } catch (err) {
      console.error("Erro:", err);
      alert("Erro ao enviar dados.");
    }
  }

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <div className="flex min-h-screen items-center justify-center md:flex-row p-2">
      <div className="w-full max-w-7xl shadow-2xl shadow-black grid grid-cols-1 md:grid-cols-2">
        {/* LADO ESQUERDO */}
        <div className="flex items-center justify-center bg-green-100 min-h-[400px] md:min-h-[650px] p-8">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-5 w-full max-w-md "
            >
              <h1 className="text-2xl font-semibold text-center text-purple-700">
                Login
              </h1>
              {/* nome */}
              <FormField
                control={form.control}
                name="nome"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="relative">
                        <User
                          className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400 hover:text-purple-600"
                          size={18}
                        />
                        <Input
                          type="text"
                          placeholder="Nome"
                          className="pl-10 "
                          {...field}
                        />
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
              {/* confirmar senha */}
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="relative ">
                        {showConfirmPassword ? (
                          <Eye
                            className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400 cursor-pointer hover:text-purple-600"
                            onClick={() => setShowConfirmPassword(false)}
                            size={18}
                          />
                        ) : (
                          <EyeClosed
                            className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400 cursor-pointer hover:text-purple-600"
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

              <Button
                type="submit"
                className="w-full bg-purple-600 hover:bg-purple-900"
              >
                Fazer cadastro
              </Button>
              <p className="text-center text-sm text-gray-500 mt-4">
                Já tem uma conta?{" "}
                <Link href="/" className="text-purple-600 hover:underline">
                  Fazer login
                </Link>
              </p>
            </form>
          </Form>
        </div>

        {/* LADO DIREITO */}
        <div className="relative h-full min-h-[400px] md:min-h-[650px] bg-cover">
          <Image
            src="/backgroud2.png"
            alt="Background Image"
            layout="fill"
            objectFit="cover"
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-4">
            <h2 className="text-3xl font-semibold drop-shadow-lg text-purple-700">
              Muito bom te ver!
            </h2>
            <p className="text-purple-700 text-lg drop-shadow-md">
              Faça seu cadastro para acessar sua conta.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CadastroForm;
