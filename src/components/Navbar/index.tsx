'use client';

import { useState } from 'react';
import Link from 'next/link';
import { AppBar, Toolbar, IconButton, InputBase, Menu, MenuItem, Avatar, Box, Typography } from '@mui/material';
import { Menu as MenuIcon, Search as SearchIcon } from '@mui/icons-material';
import { useUser } from '@/context/UserContext';
import Image from 'next/image';
import logo from '@/assets/img/logo.svg';
import { useRouter } from 'next/navigation';

const Navbar = () => {
  const { user } = useUser();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const router = useRouter();

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogOut = async () => {
    await fetch('/api/auth/logout');
    router.push('/login');
  };

  return (
    <AppBar position="fixed" sx={{ background: 'linear-gradient(to right, #1f1f1f, #121212)' }}>
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
        {/* Menu e Logo */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Link href="/">
            <Image src={logo} alt="Logo" width={120} height={40} />
          </Link>
        </Box>

        {/* Campo de Pesquisa */}
        <Box
          sx={{
            display: { xs: 'none', md: 'flex' },
            flexGrow: 1,
            justifyContent: 'center',
            mx: 2,
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              borderRadius: 2,
              px: 2,
              py: 0.5,
              width: '50%',
            }}
          >
            <SearchIcon sx={{ color: 'gray', mr: 1 }} />
            <InputBase
              placeholder="Pesquisar..."
              fullWidth
              sx={{
                color: 'white',
                '&::placeholder': {
                  color: 'rgba(255, 255, 255, 0.7)',
                },
              }}
            />
          </Box>
        </Box>

        {/* Perfil do Usuário */}
        <Box>
          <IconButton onClick={handleMenuOpen}>
            {user && user.profilePhoto !== 'N/A' ? (
              <Avatar src={user.profilePhoto} alt="Profile" />
            ) : (
              <Avatar sx={{ bgcolor: 'gray' }}>U</Avatar>
            )}
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            sx={{
              '& .MuiPaper-root': {
                backgroundColor: '#1f1f1f',
                color: 'white',
              },
            }}
            disableAutoFocusItem={true}
            MenuListProps={{
              disablePadding: true, // Adiciona este ajuste
            }}
          >
            {user ? (
              <>
                <MenuItem>
                  <Typography variant="subtitle2">Bem-vindo, {user.name}</Typography>
                </MenuItem>
                <MenuItem onClick={() => router.push('/profile')}>Perfil</MenuItem>
                <MenuItem onClick={handleLogOut}>Sair</MenuItem>
              </>
            ) : (
              <>
                <MenuItem onClick={() => router.push('/login')}>Login</MenuItem>
                <MenuItem onClick={() => router.push('/signup')}>Cadastrar-se</MenuItem>
                <MenuItem onClick={handleLogOut}>Sair</MenuItem>
              </>
            )}
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
