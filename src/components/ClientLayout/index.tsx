"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import { UserProvider } from "@/context/UserContext"; // Certifique-se de importar corretamente
import Image from "next/image";
import planetLoad from '@/assets/img/preload.svg'
import CreateMenuButton from "../CreateMenuButton";

// Componente de Loading
const LoadingSpinner = () => (
  <div className="flex justify-center items-center h-screen">
    <Image src={planetLoad} alt="" width={100} height={100}/>
  </div>
);

const LayoutWithNav = ({ children }: { children: React.ReactNode }) => {
  const toggleSidebar = () => {
    setIsSidebarMinimized((prev) => !prev);
  };

  const [isSidebarMinimized, setIsSidebarMinimized] = useState(true);

  return (
    <div className="grid grid-cols-12">
      <CreateMenuButton />
      <Navbar onMenuToggle={toggleSidebar} />
      <Sidebar auxiliarClass="col-span-1" isMinimized={isSidebarMinimized} />
      <main className="main col-span-11 h-screen overflow-y-scroll">{children}</main>
    </div>
  );
};

const ClientLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const [showNavbarSidebar, setShowNavbarSidebar] = useState(false);
  const [isLoading, setIsLoading] = useState(true);  // Estado para controle de carregamento

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch("/api/user/profile", { credentials: "include" });
        const data = await response.json();
        setShowNavbarSidebar(!["/login", "/signup"].includes(pathname)); // Exibe ou esconde a navbar e sidebar conforme a lógica
      } catch (error) {
        console.error("Erro ao buscar usuário:", error);
      } finally {
        setIsLoading(false);  // Finaliza o carregamento quando a requisição terminar
      }
    };

    fetchUserData();
  }, [pathname]);

  if (isLoading) {
    return <LoadingSpinner />;  // Exibe o spinner de loading enquanto o carregamento estiver ativo
  }

  return (
    <UserProvider>
      {showNavbarSidebar && <LayoutWithNav>{children}</LayoutWithNav>}
      {!showNavbarSidebar && <>{children}</>}
    </UserProvider>
  );
};

export default ClientLayout;
