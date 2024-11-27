'use client'

import React, { useEffect, useState } from 'react';
import { UserProvider, useUser } from '@/context/UserContext';
import { Box, CssBaseline, AppBar, Toolbar, Typography, IconButton, Drawer, List, ListItem, ListItemIcon, ListItemText, Divider } from '@mui/material';
import { Menu as MenuIcon, Home as HomeIcon, AccountCircle as AccountIcon, Settings as SettingsIcon } from '@mui/icons-material';

const LayoutNoProvider = ({ children }: { children: React.ReactNode }) => {
    const { user, isLoading, error, refreshUser } = useUser();
    const [mobileOpen, setMobileOpen] = useState(false);

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    useEffect(() => {
        if (!isLoading && !user) {
            // Redirecionar para login se o usuário não estiver autenticado
            window.location.href = '/login';
        }
    }, [isLoading, user]);

    // Links da Sidebar
    const links = [
        { text: 'Home', icon: <HomeIcon /> },
        { text: 'Perfil', icon: <AccountIcon /> },
        { text: 'Configurações', icon: <SettingsIcon /> },
    ];

    const drawer = (
        <div>
            <Box sx={{ textAlign: 'center', padding: 2 }}>
                <Typography variant="h6" color="white">
                    {user?.name || 'Usuário'}
                </Typography>
                <Typography variant="body2" color="gray">
                    {user?.email}
                </Typography>
            </Box>
            <Divider />
            <List>
                {links.map((link, index) => (
                    <ListItem component="li" key={index}>
                        <ListItemIcon>{link.icon}</ListItemIcon>
                        <ListItemText primary={link.text} />
                    </ListItem>
                ))}
            </List>
        </div>
    );

    return <Box sx={{ display: 'flex' }}>
    <CssBaseline />
    {/* AppBar */}
    <AppBar position="fixed" sx={{ bgcolor: 'purple' }}>
        <Toolbar>
            <IconButton color="inherit" edge="start" onClick={handleDrawerToggle} sx={{ mr: 2 }}>
                <MenuIcon />
            </IconButton>
            <Typography variant="h6" noWrap>
                Dashboard
            </Typography>
        </Toolbar>
    </AppBar>

    {/* Drawer */}
    <Drawer
        sx={{
            width: 240,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
                width: 240,
                bgcolor: 'black',
                color: 'white',
                boxSizing: 'border-box',
            },
        }}
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
            keepMounted: true,
        }}
    >
        {drawer}
    </Drawer>

    <Box
        component="main"
        sx={{
            flexGrow: 1,
            bgcolor: 'background.default',
            padding: 3,
            marginLeft: 240,
            marginTop: 8,
            transition: 'margin 0.3s ease-in-out',
            '@media (max-width:600px)': {
                marginLeft: 0,
            },
        }}
    >
        {children}
    </Box>
</Box>
}

const Layout = ({ children }: { children: React.ReactNode }) => {
    

    return (
        <UserProvider>
            <LayoutNoProvider>{children}</LayoutNoProvider>
        </UserProvider>
    );
};

export default Layout;
