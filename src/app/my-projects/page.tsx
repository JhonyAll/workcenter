"use client"

import { useEffect, useState } from "react";
import { Box, Card, CardContent, Typography, Avatar, List, ListItem, ListItemText, Divider, IconButton, Chip } from "@mui/material";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/UserContext"; // Certifique-se de ter um contexto de usuário implementado

// Tipos de dados para os projetos
type Project = {
  id: string;
  title: string;
  description: string;
  author: {
    id: string;
    username: string;
    profilePhoto: string;
  };
  hashtags: { name: string }[];
  comments: {
    id: string;
    content: string;
    author: {
      id: string;
      username: string;
      profilePhoto: string;
    };
  }[];
  applications: {
    id: string;
    worker: {
      id: string;
      username: string;
      profilePhoto: string;
    };
  }[];
};

const MeusProjetos = () => {
  const { user } = useUser(); // Pegando o usuário logado do contexto
  const [projects, setProjects] = useState<Project[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch("/api/auth/my-projects");
        const data = await response.json();
        if (data.status === "success") {
          setProjects(data.data);
        } else {
          console.error("Erro ao carregar projetos", data.message);
        }
      } catch (error) {
        console.error("Erro ao carregar projetos", error);
      }
    };

    if (user) {
      fetchProjects(); // Chama a função para carregar os projetos
    }
  }, [user]);

  if (!user) {
    return (
      <Box sx={{ p: 4, textAlign: "center" }}>
        <Typography variant="h6" color="gray">
          Você precisa estar logado para ver seus projetos.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ color: "#fff", fontWeight: "bold" }}>
        Meus Projetos
      </Typography>

      {projects.length === 0 ? (
        <Typography variant="h6" color="gray">
          Você ainda não tem projetos.
        </Typography>
      ) : (
        <List>
          {projects.map((project) => (
            <Card key={project.id} sx={{ mb: 3, backgroundColor: "#1f1f1f", borderRadius: 2 }}>
              <CardContent>
                <Typography variant="h6" sx={{ color: "#fff", fontWeight: "bold" }}>
                  {project.title}
                </Typography>
                <Typography variant="body2" sx={{ color: "#bbb", mt: 1 }}>
                  {project.description}
                </Typography>

                <Box sx={{ display: "flex", alignItems: "center", gap: 2, mt: 2 }}>
                  <Avatar src={project.author.profilePhoto} alt={project.author.username} />
                  <Typography variant="body2" sx={{ color: "#fff" }}>
                    {project.author.username}
                  </Typography>
                </Box>

                <Box sx={{ mt: 2 }}>
                  {project.hashtags.map((hashtag) => (
                    <Chip key={hashtag.name} label={`#${hashtag.name}`} sx={{ mr: 1, backgroundColor: "#333", color: "white" }} />
                  ))}
                </Box>

                <Divider sx={{ my: 2, backgroundColor: "#444" }} />

                <Typography variant="subtitle1" sx={{ color: "#fff", fontWeight: "bold" }}>
                  Comentários:
                </Typography>
                {project.comments.length > 0 ? (
                  project.comments.map((comment) => (
                    <Box key={comment.id} sx={{ display: "flex", alignItems: "center", gap: 2, mt: 1 }}>
                      <Avatar src={comment.author.profilePhoto} alt={comment.author.username} />
                      <Typography variant="body2" sx={{ color: "#bbb" }}>
                        <strong>{comment.author.username}:</strong> {comment.content}
                      </Typography>
                    </Box>
                  ))
                ) : (
                  <Typography variant="body2" sx={{ color: "#bbb", mt: 1 }}>
                    Nenhum comentário ainda.
                  </Typography>
                )}

                <Divider sx={{ my: 2, backgroundColor: "#444" }} />

                <Typography variant="subtitle1" sx={{ color: "#fff", fontWeight: "bold" }}>
                  Candidatos:
                </Typography>
                {project.applications.length > 0 ? (
                  project.applications.map((application) => (
                    <ListItem key={application.id} onClick={() => router.push(`/workers/${application.worker.id}`)} sx={{ cursor: "pointer", '&:hover': { backgroundColor: '#333' } }}>
                      <Avatar src={application.worker.profilePhoto} alt={application.worker.username} sx={{ mr: 2 }} />
                      <ListItemText primary={application.worker.username} />
                    </ListItem>
                  ))
                ) : (
                  <Typography variant="body2" sx={{ color: "#bbb", mt: 1 }}>
                    Nenhum candidato ainda.
                  </Typography>
                )}
              </CardContent>
            </Card>
          ))}
        </List>
      )}
    </Box>
  );
};

export default MeusProjetos;
