"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const res = await fetch("/api/logout", {
        method: "POST",
        credentials: "include",
      });

      if (!res.ok) {
        toast.error("Erro ao fazer logout");
        return;
      }

      toast.success("Você saiu da conta");
      router.replace("/");
      router.refresh();
    } catch (error) {
      toast.error(`${error} - Erro inesperado no logout`);
    }
  };

  return (
    <Button
      variant="destructive"
      onClick={handleLogout}
      className="hover:cursor-pointer hover:bg-red-500"
    >
      Sair
    </Button>
  );
}
