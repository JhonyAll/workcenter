"use client";

import { useUser } from "@/context/UserContext";
import { useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Container,
  Divider,
  Grid,
  IconButton,
  Skeleton,
  Typography,
} from "@mui/material";
import { AiOutlinePhone, AiOutlineMail, AiOutlineInstagram, AiOutlineLinkedin } from "react-icons/ai";
import { BsChatText, BsFillStarFill } from "react-icons/bs";

const WorkerProfilePage = () => {
  const { user, isLoading } = useUser(); // Considerando que isLoading já está implementado no contexto
  const [loading, setLoading] = useState(true);

  // Simula carregamento para Skeleton
  useState(() => {
    const timer = setTimeout(() => setLoading(false), 1500); // Simula 1.5s de carregamento
    return () => clearTimeout(timer);
  }, []);

  if (isLoading || loading) {
    return (
      <Container maxWidth="sm">
        <Box display="flex" flexDirection="column" alignItems="center" gap={2} mt={5}>
          <Skeleton variant="circular" width={120} height={120} />
          <Skeleton variant="text" width="80%" height={30} />
          <Skeleton variant="text" width="60%" height={20} />
          <Divider sx={{ width: "100%", my: 2 }} />
          <Skeleton variant="rectangular" width="100%" height={150} />
          <Skeleton variant="rectangular" width="100%" height={250} sx={{ mt: 2 }} />
        </Box>
      </Container>
    );
  }

  if (!user) {
    return (
      <Container maxWidth="sm" sx={{ mt: 5 }}>
        <Typography variant="h5" textAlign="center">
          Usuário não encontrado.
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ mt: 5 }}>
      {/* Header do perfil */}
      <Box display="flex" flexDirection="column" alignItems="center" mb={3}>
        <Avatar
          src={user.profilePhoto || "https://via.placeholder.com/120"}
          alt={user.name}
          sx={{ width: 120, height: 120, mb: 2 }}
        />
        <Typography variant="h5" fontWeight="bold">
          {user.name}
        </Typography>
        {user.WorkerProfile && (
          <Typography variant="subtitle1" color="textSecondary">
            {user.WorkerProfile.profession}
          </Typography>
        )}
      </Box>

      {/* Botão de mensagem */}
      <Box display="flex" justifyContent="center">
        <Button
          variant="contained"
          color="primary"
          onClick={() => alert("Abrindo chat com " + user.name)}
          startIcon={<BsChatText size={24} />}
          sx={{
            textTransform: "none", // Remove a capitalização automática
            fontWeight: "bold",
            fontSize: "1rem",
            padding: "8px 16px", // Espaçamento interno,
            marginBottom: '8px',
            gap: 1.5, // Espaço entre o ícone e o texto
            '&:hover': {
              backgroundColor: "rgba(103, 58, 183, 0.85)", // Customiza o hover
            },
          }}
        >
          Enviar Mensagem
        </Button>
      </Box>


      {/* Sobre mim */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            Sobre mim
          </Typography>
          <Typography color="textSecondary">
            {user.bio ||
              "Este usuário ainda não acrescentou uma descrição sobre ele."}
          </Typography>
        </CardContent>
      </Card>

      {/* Avaliação */}
      {user.WorkerProfile && (
        <Box display="flex" alignItems="center" gap={1} mb={3}>
          <BsFillStarFill color="#FFD700" />
          <Typography variant="h6">{user.WorkerProfile.rating || "N/A"}</Typography>
          <Typography color="textSecondary">
            ({user.WorkerProfile.completedTasks} tarefas concluídas)
          </Typography>
        </Box>
      )}

      {/* Habilidades */}
      {user.WorkerProfile?.skills?.length > 0 && (
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Habilidades
            </Typography>
            <Box display="flex" flexWrap="wrap" gap={1}>
              {user.WorkerProfile.skills.map((skill, index) => (
                <Chip key={index} label={skill.name} color="primary" />
              ))}
            </Box>
          </CardContent>
        </Card>
      )}

      {/* Contatos */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            Contatos
          </Typography>
          <Box display="flex" alignItems="center" gap={1} mb={1}>
            <AiOutlinePhone />
            <Typography color="textSecondary">{user.phone || "Não disponível"}</Typography>
          </Box>
          <Box display="flex" alignItems="center" gap={1} mb={1}>
            <AiOutlineMail />
            <Typography color="textSecondary">{user.email || "Não disponível"}</Typography>
          </Box>
          <Box display="flex" alignItems="center" gap={1} mb={1}>
            <AiOutlineInstagram />
            <a href={user.WorkerProfile?.socialLinks?.instagram || "#"} target="_blank" rel="noopener noreferrer">
              Instagram
            </a>
          </Box>
          <Box display="flex" alignItems="center" gap={1}>
            <AiOutlineLinkedin />
            <a href={user.WorkerProfile?.socialLinks?.linkedin || "#"} target="_blank" rel="noopener noreferrer">
              LinkedIn
            </a>
          </Box>
        </CardContent>
      </Card>

      {/* Portfólio */}
      {user.WorkerProfile?.portfolio?.length > 0 && (
        <Box>
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            Portfólio
          </Typography>
          <Grid container spacing={2}>
            {user.WorkerProfile.portfolio.map((project, index) => (
              <Grid item xs={12} sm={6} key={index}>
                <Card>
                  <CardContent>
                    <Typography variant="subtitle1" fontWeight="bold">
                      {project.name}
                    </Typography>
                    <Typography variant="body2" color="textSecondary" gutterBottom>
                      {project.description}
                    </Typography>
                    <Button
                      variant="outlined"
                      color="primary"
                      fullWidth
                      href={project.link}
                      target="_blank"
                    >
                      Ver projeto
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}
    </Container>
  );
};

export default WorkerProfilePage;
