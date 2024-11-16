// src/context/UserContext.tsx

import React, { createContext, useContext, useState, useEffect } from "react";
import { User } from "@prisma/client";

// Criação do contexto com o valor inicial como null
type UserContextType = {
    user: User | null;
    isLoading: boolean;
    error: string | null;
};

export const UserContext = createContext<UserContextType | null>(null);


// Hook para acessar o contexto de usuário
export const useUser = () => {
    const context = useContext(UserContext);

    if (!context) {
        throw new Error("useUser deve ser usado dentro de um UserProvider");
    }

    return context;
};


// Componente Provider para envolver seu layout ou a árvore de componentes
export const UserProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await fetch("/api/user/profile", {
                    credentials: "include",
                });
                if (!response.ok) {
                    throw new Error("Erro ao buscar usuário");
                }
                const data = await response.json();
                setUser(data.user.userData.data.user);
            } catch (err: unknown) {
                // Verifica se o erro é uma instância de Error antes de acessar suas propriedades
                if (err instanceof Error) {
                    setError(err.message);
                } else {
                    setError("Erro desconhecido ocorreu.");
                }
                setUser(null);
            } finally {
                setIsLoading(false);
            }
        };

        fetchUserData();
    }, []);

    return (
        <UserContext.Provider value={{ user, isLoading, error }}>
            {children}
        </UserContext.Provider>
    );
};

