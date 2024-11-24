import React, { createContext, useContext, useState, useEffect } from "react";
import { User } from "@prisma/client";
import { useRouter } from "next/navigation";

type UserContextType = {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  refreshUser: () => Promise<void>;
};

const UserContext = createContext<UserContextType | null>(null);

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser deve ser usado dentro de um UserProvider");
  }
  return context;
};

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter()

  const fetchUserData = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/session", {
        
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Erro ao buscar dados da sessão.");
      }

      const data = await response.json();

      if (!data.isAuthenticated) {
        await fetch("/api/logout")
        setUser(null);
        return router.push("/login")
      }
      setUser(data.user);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Erro desconhecido.");
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshUser = async () => {
    await fetchUserData();
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  return (
    <UserContext.Provider value={{ user, isLoading, error, refreshUser }}>
      {children}
    </UserContext.Provider>
  );
};
