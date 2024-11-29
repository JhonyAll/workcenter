'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  AppBar,
  Toolbar,
  IconButton,
  InputBase,
  Menu,
  MenuItem,
  Avatar,
  Box,
  Typography,
  Popover,
  List,
  ListItem,
  ListItemText,
  Divider,
} from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
import { useUser } from '@/context/UserContext';
import Image from 'next/image';
import logo from '@/assets/img/logo.svg';
import { useRouter } from 'next/navigation';
import { debounce } from 'lodash';

type SearchResults = {
  posts: { id: string; title: string; description: string }[];
  projects: { id: string; title: string; description: string }[];
  users: { id: string; username: string; profilePhoto: string }[];
};

const Navbar = () => {
  const { user } = useUser();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResults>({
    posts: [], 
    projects: [], 
    users: [], 
  });
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [searchAnchorEl, setSearchAnchorEl] = useState<null | HTMLElement>(null);
  const router = useRouter();

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchQuery(value);
    debounceSearch(value);
  };

  const performSearch = async (value: string) => {
    if (!value.trim()) {
      setPopoverOpen(false);
      return;
    }

    setPopoverOpen(true);
    setSearchAnchorEl(searchAnchorEl);

    if (value.startsWith('@')) {
      const query = value.substring(1);
      const response = await fetch(`/api/users?query=${query}`);
      const responseJson = await response.json();
      const data = responseJson.data;
      setSearchResults({ posts: [], projects: [], users: data.users || [] });
    } else {
      const response = await fetch(`/api/search?query=${value}`);
      const responseJson = await response.json();
      const data = responseJson.data;
      setSearchResults({
        posts: data.posts || [],
        projects: data.projects || [],
        users: [],
      });
    }
  };

  // Usamos useMemo para criar uma versão memoizada do debounce
  const debounceSearch = useMemo(() => debounce(performSearch, 500), []);

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
    <>
      <AppBar position="fixed" sx={{ background: 'linear-gradient(to right, #1f1f1f, #121212)' }}>
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Link href="/">
              <Image src={logo} alt="Logo" width={120} height={40} />
            </Link>
          </Box>

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
                placeholder="Pesquisar... (use @ para buscar usuários)"
                fullWidth
                value={searchQuery}
                onChange={handleSearchChange}
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
                <MenuItem onClick={() => router.push('/project-aplications')}>Aplicações aos Meus Projetos</MenuItem>
                <MenuItem onClick={() => router.push('/my-projects')}>Meus Projetos</MenuItem>
                <MenuItem onClick={() => router.push('/my-posts')}>Meus Posts</MenuItem>
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

      <Popover
        open={popoverOpen}
        anchorEl={searchAnchorEl}
        onClose={() => setPopoverOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        transformOrigin={{ vertical: 'top', horizontal: 'center' }}
        sx={{
          '& .MuiPaper-root': {
            backgroundColor: '#1f1f1f',
            color: 'white',
            width: '70%',
            maxHeight: 360,
            overflowY: 'hidden',
            marginTop: -20,
            padding: 2
          },
        }}
      >
        <Box sx={{ backgroundColor: '#1f1f1f', width: '100%', maxHeight: 320, padding: 2, overflowY: 'auto', }}>
          <List sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', gap: '2px' }}>
            {searchResults.users?.length > 0 && (
              <Box sx={{ width: '30%' }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: '#fff', mb: 1 }}>Usuários</Typography>
                <List>
                  {searchResults.users.map((user) => (
                    <ListItem
                      key={user.id}
                      onClick={() => router.push(`/user/${user.username}`)}
                      component="li"
                      sx={{
                        '&:hover': {
                          backgroundColor: '#333',
                          cursor: 'pointer',
                        },
                      }}
                    >
                      <Avatar src={user.profilePhoto} sx={{ mr: 2 }} />
                      <ListItemText primary={user.username} />
                    </ListItem>
                  ))}
                </List>
              </Box>
            )}

            {searchResults.users?.length > 0 && (searchResults.posts?.length > 0 || searchResults.projects?.length > 0) && (
              <Box sx={{ width: '2px', backgroundColor: '#444', height: '100%' }} />
            )}

            {(searchResults.posts?.length > 0 || searchResults.projects?.length > 0) && (
              <>
                <Box sx={{ width: '48%', backgroundColor: '#121212', borderRadius: 2, padding: 2 }}>
                  <Typography
                    variant="subtitle1"
                    sx={{
                      fontWeight: 'bold',
                      color: '#fff',
                      mb: 1,
                      borderBottom: '2px solid #444',
                      paddingBottom: 1,
                    }}
                  >
                    Posts
                  </Typography>
                  <List>
                    {searchResults.posts?.map((post) => (
                      <ListItem
                        key={post.id}
                        onClick={() => router.push(`/posts/${post.id}`)}
                        component="li"
                        sx={{
                          '&:hover': {
                            backgroundColor: '#333',
                            cursor: 'pointer',
                          },
                        }}
                      >
                        <ListItemText primary={post.title} secondary={post.description.substring(0, 100) + '...'} />
                      </ListItem>
                    ))}
                  </List>
                </Box>

                <Box sx={{ width: '2px', backgroundColor: '#444', height: '100%' }} />

                <Box sx={{ width: '48%', backgroundColor: '#121212', borderRadius: 2, padding: 2 }}>
                  <Typography
                    variant="subtitle1"
                    sx={{
                      fontWeight: 'bold',
                      color: '#fff',
                      mb: 1,
                      borderBottom: '2px solid #444',
                      paddingBottom: 1,
                    }}
                  >
                    Projetos
                  </Typography>
                  <List>
                    {searchResults.projects?.map((project) => (
                      <ListItem
                        key={project.id}
                        onClick={() => router.push(`/projects/${project.id}`)}
                        component="li"
                        sx={{
                          '&:hover': {
                            backgroundColor: '#333',
                            cursor: 'pointer',
                          },
                        }}
                      >
                        <ListItemText primary={project.title} secondary={project.description} />
                      </ListItem>
                    ))}
                  </List>
                </Box>
              </>
            )}
          </List>
        </Box>
      </Popover>
    </>
  );
};

export default Navbar;
