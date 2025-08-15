"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from "@/components/ui/form";

import { Eye, EyeClosed } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";

const schema = z
  .object({
    oldPassword: z.string().min(6, "Mínimo de 6 caracteres"),
    newPassword: z.string().min(6, "Mínimo de 6 caracteres"),
    confirmNewPassword: z.string().min(6, "Mínimo de 6 caracteres"),
  })
  .refine((v) => v.newPassword === v.confirmNewPassword, {
    path: ["confirmNewPassword"],
    message: "As senhas não coincidem",
  });

type FormValues = z.infer<typeof schema>;

export default function UpdatePasswordForm() {
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      oldPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    },
  });

  const onSubmit = async (values: FormValues) => {
    try {
      const res = await fetch("/api/update-password", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          oldPassword: values.oldPassword,
          newPassword: values.newPassword,
        }),
      });

      const data = await res.json();
      if (res.status === 401) {
        toast.error(data?.error || "Senha atual incorreta");
        return;
      }

      if (!res.ok) {
        toast.error(data?.error || "Falha ao atualizar a senha");
      }
      toast.success("Senha atualizada! Sua senha foi alterada com sucesso.");
      form.reset();
    } catch (error) {
      toast.error(`${error} - Erro ao atualizar a senha`);
    }
  };

  return (
    <div className="mx-auto max-w-2xl p-4">
      <h3 className="align-middle text-center mb-5">
        Você tem certeza que deseja alterar sua senha?
      </h3>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {/* Senha atual */}
          <FormField
            control={form.control}
            name="oldPassword"
            render={({ field }) => (
              <FormItem>
                <Label>Senha atual</Label>
                <FormControl>
                  <div className="relative">
                    {showOld ? (
                      <Eye
                        className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400 cursor-pointer hover:text-black"
                        onClick={() => setShowOld(false)}
                        size={18}
                      />
                    ) : (
                      <EyeClosed
                        className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400 cursor-pointer hover:text-black"
                        onClick={() => setShowOld(true)}
                        size={18}
                      />
                    )}
                    <Input
                      type={showOld ? "text" : "password"}
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

          {/* Nova senha */}
          <FormField
            control={form.control}
            name="newPassword"
            render={({ field }) => (
              <FormItem>
                <Label>Nova senha</Label>
                <FormControl>
                  <div className="relative">
                    {showNew ? (
                      <Eye
                        className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400 cursor-pointer hover:text-black"
                        onClick={() => setShowNew(false)}
                        size={18}
                      />
                    ) : (
                      <EyeClosed
                        className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400 cursor-pointer hover:text-black"
                        onClick={() => setShowNew(true)}
                        size={18}
                      />
                    )}
                    <Input
                      type={showNew ? "text" : "password"}
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

          {/* Confirmar nova senha */}
          <FormField
            control={form.control}
            name="confirmNewPassword"
            render={({ field }) => (
              <FormItem>
                <Label>Confirmar nova senha</Label>
                <FormControl>
                  <div className="relative">
                    {showConfirm ? (
                      <Eye
                        className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400 cursor-pointer hover:text-black"
                        onClick={() => setShowConfirm(false)}
                        size={18}
                      />
                    ) : (
                      <EyeClosed
                        className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400 cursor-pointer hover:text-black"
                        onClick={() => setShowConfirm(true)}
                        size={18}
                      />
                    )}
                    <Input
                      type={showConfirm ? "text" : "password"}
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

          <Button
            type="submit"
            className="w-full"
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting ? "Atualizando..." : "Atualizar senha"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
