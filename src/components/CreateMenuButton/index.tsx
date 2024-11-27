'use client';

import { useState } from 'react';
import { Fab, Menu, MenuItem, Tooltip, Box } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import PostAddIcon from '@mui/icons-material/PostAdd';
import WorkIcon from '@mui/icons-material/Work';
import Link from 'next/link';

const CreateMenuButton = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: 50,
        right: 50,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        zIndex: 20
      }}
    >
      {/* Botão Principal */}
      <Tooltip title="Criar" placement="left">
        <Fab
          color="primary"
          aria-label="add"
          onClick={handleOpenMenu}
          sx={{
            boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.3)',
            transition: 'transform 0.3s',
            '&:hover': { transform: 'scale(1.1)' },
          }}
        >
          <AddIcon />
        </Fab>
      </Tooltip>

      {/* Menu Suspenso */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleCloseMenu}
        sx={{
          mb: 2,
          '& .MuiPaper-root': {
            backgroundColor: '#121212',
            borderRadius: 2,
            border: '1px solid #444',
          },
        }}
      >
        <MenuItem
          component={Link}
          href="/create-project"
          sx={{
            color: 'white',
            '&:hover': { backgroundColor: '#6B21A8', color: 'white' },
          }}
        >
          <WorkIcon sx={{ mr: 1, color: '#6B21A8' }} />
          Criar Projeto
        </MenuItem>
        <MenuItem
          component={Link}
          href="/create-post"
          sx={{
            color: 'white',
            '&:hover': { backgroundColor: '#6B21A8', color: 'white' },
          }}
        >
          <PostAddIcon sx={{ mr: 1, color: '#6B21A8' }} />
          Criar Post
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default CreateMenuButton;
