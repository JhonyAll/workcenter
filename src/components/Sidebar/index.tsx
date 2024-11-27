'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Box,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  IconButton,
  Typography,
  Badge,
} from '@mui/material';
import {
  Home as HomeIcon,
  Work as WorkIcon,
  Folder as FolderIcon,
  Notifications as NotificationsIcon,
  Settings as SettingsIcon,
  AccountCircle as AccountCircleIcon,
  Menu as MenuIcon,
} from '@mui/icons-material';

const Sidebar = ({ isMinimized = false }: { isMinimized: boolean }) => {
  const pathname = usePathname();
  const [notifications] = useState<number>(3); // Simulando notificações

  const items = [
    { label: 'Início', icon: <HomeIcon />, href: '/' },
    { label: 'Catálogo', icon: <FolderIcon />, href: '/catalog' },
    { label: 'Pós-Graduação', icon: <WorkIcon />, href: '/post-graduation' },
  ];

  const userActions = [
    { label: 'Ver Perfil', href: '/profile' },
    { label: 'Configurações', href: '/settings' },
  ];

  const settings = [
    { label: 'Configurações da Conta', href: '/account-settings' },
    { label: 'Preferências', href: '/preferences' },
  ];

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: isMinimized ? 80 : 240,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {
          width: isMinimized ? 80 : 240,
          boxSizing: 'border-box',
          background: 'linear-gradient(to bottom, #1f1f1f, #121212)',
          color: 'white',
        },
      }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        {/* Menu Icon */}
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
          <IconButton>
            <MenuIcon sx={{ color: 'white' }} />
          </IconButton>
        </Box>

        {/* Menu Principal */}
        <List>
          {items.map((item) => (
            <ListItemButton
              key={item.href}
              component={Link}
              href={item.href}
              selected={pathname === item.href}
              sx={{
                px: 2,
                color: pathname === item.href ? 'purple' : 'white',
                '&:hover': { color: 'purple' },
              }}
            >
              <ListItemIcon sx={{ color: 'inherit' }}>{item.icon}</ListItemIcon>
              {!isMinimized && <ListItemText primary={item.label} />}
            </ListItemButton>
          ))}
        </List>

        <Divider sx={{ borderColor: 'gray' }} />

        {/* Perfil */}
        <Box sx={{ px: 2, py: 1 }}>
          <Typography variant="body1" sx={{ display: isMinimized ? 'none' : 'block', mb: 1 }}>
            Perfil do Usuário
          </Typography>
          <List>
            {userActions.map((action) => (
              <ListItemButton
                key={action.href}
                component={Link}
                href={action.href}
                sx={{
                  px: 2,
                  color: 'gray',
                  '&:hover': { color: 'purple' },
                }}
              >
                {!isMinimized && <ListItemText primary={action.label} />}
              </ListItemButton>
            ))}
          </List>
        </Box>

        {/* Notificações */}
        <ListItemButton sx={{ px: 2, mt: 2, color: 'white' }}>
          <ListItemIcon>
            <Badge badgeContent={notifications} color="error">
              <NotificationsIcon sx={{ color: 'inherit' }} />
            </Badge>
          </ListItemIcon>
          {!isMinimized && <ListItemText primary="Notificações" />}
        </ListItemButton>

        <Divider sx={{ borderColor: 'gray', mt: 'auto' }} />

        {/* Configurações */}
        <Box sx={{ px: 2, py: 1 }}>
          <Typography variant="body1" sx={{ display: isMinimized ? 'none' : 'block', mb: 1 }}>
            Configurações
          </Typography>
          <List>
            {settings.map((setting) => (
              <ListItemButton
                key={setting.href}
                component={Link}
                href={setting.href}
                sx={{
                  px: 2,
                  color: 'gray',
                  '&:hover': { color: 'purple' },
                }}
              >
                {!isMinimized && <ListItemText primary={setting.label} />}
              </ListItemButton>
            ))}
          </List>
        </Box>
      </Box>
    </Drawer>
  );
};

export default Sidebar;
