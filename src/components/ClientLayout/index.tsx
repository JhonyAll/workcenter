'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { Box, CircularProgress } from '@mui/material'; // Usando Material UI para loading
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import { UserProvider } from '@/context/UserContext'; // Certifique-se de importar corretamente
import CreateMenuButton from '../CreateMenuButton';

// Componente de Loading com Material UI
const LoadingSpinner = () => (
  <Box
    sx={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      backgroundColor: 'background.default', // Adaptar ao tema escuro
    }}
  >
    <CircularProgress size={100} color="primary" />
  </Box>
);

const LayoutWithNav = ({ children }: { children: React.ReactNode }) => (
  <div>
    <CreateMenuButton />
    <Navbar />
    <main className="main col-span-11 h-full py-20">{children}</main>
  </div>
);

const ClientLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const [showNavbarSidebar, setShowNavbarSidebar] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // Definido como true para mostrar o carregamento inicial

  useEffect(() => {
    // Exibe a Navbar/Sidebar apenas quando não está em /login ou /signup
    setShowNavbarSidebar(!['/login', '/signup'].includes(pathname));
    setIsLoading(false); // Após a checagem, desativa o loading
  }, [pathname]);

  if (isLoading) {
    return <LoadingSpinner />;  // Exibe o spinner de loading enquanto o carregamento estiver ativo
  }

  return (
    <UserProvider>
      {showNavbarSidebar ? <LayoutWithNav>{children}</LayoutWithNav> : <>{children}</>}
    </UserProvider>
  );
};

export default ClientLayout;
