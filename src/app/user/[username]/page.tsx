"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { AiOutlinePhone, AiOutlineMail, AiOutlineInstagram, AiOutlineLinkedin } from "react-icons/ai";
import { BsChatText, BsFillStarFill } from "react-icons/bs";
import { useRouter } from "next/navigation";
import {
    Button, Card, CardContent, Typography, Chip, Container, Box, Divider, Avatar,
    CircularProgress,
    Grid,
    IconButton,
    Skeleton,
} from "@mui/material";
import type { Prisma } from "@prisma/client";

// Tipagem para o tipo do portfólio
interface PortfolioItem {
    name: string;
    description: string;
    imageUrl: string;
    link: string;
}

type UserWithWorkProfile = Prisma.UserGetPayload<{
    select: {
        id: true;
        name: true;
        username: true;
        email: true;
        profilePhoto: true;
        type: true;
        createdAt: true;
        updatedAt: true;
        about: true;
        WorkerProfile: {
            include: {
                skills: true;
            }
        };
    };
}>;

const WorkerProfilePage = ({ params }: { params: Promise<{ username: string }> }) => {
    const [user, setUser] = useState<UserWithWorkProfile | null>(null);
    const router = useRouter(); // Hook para navegação
    // Estado para o perfil do trabalhador
    useEffect(() => {
        const fetchUser = async () => {
            const { username } = await params;
            const user = await fetch(`/api/user/${username}`).then(response => response.json()).then(responseJson => setUser(responseJson.data.user));
        };
        fetchUser();
    }, [params]);

    // Função de contato (para envio de mensagem ou interação)
    const handleContact = async () => {
        if (user) {
            // Verifica se já existe um chat entre o usuário logado e o trabalhador
            const response = await fetch(`/api/chat`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    user2Id: user?.id,
                }),
            });

            const result = await response.json();

            // Redireciona para o chat existente ou recém-criado
            router.push(`/chat/${result.data.chatId}`);
        }
    };


    if (!user) return <>Carregando...</>;

    return (
        <Container maxWidth="sm" sx={{ mt: 5 }}>
            {/* Cabeçalho com imagem de capa e avatar */}
            <Box display="flex" flexDirection="column" alignItems="center" mb={3}>
                <Avatar
                    src={user.profilePhoto || "https://via.placeholder.com/120"}
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

            <Box display="flex" justifyContent="center">
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleContact}
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
                        {user.about ||
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
            {user.WorkerProfile?.skills && user.WorkerProfile?.skills?.length > 0 && (
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
                    {/* <Box display="flex" alignItems="center" gap={1} mb={1}>
                        <AiOutlinePhone />
                        <Typography color="textSecondary">{user.phone || "Não disponível"}</Typography>
                    </Box> */}
                    <Box display="flex" alignItems="center" gap={1} mb={1}>
                        <AiOutlineMail />
                        <Typography color="textSecondary">{user.email || "Não disponível"}</Typography>
                    </Box>
                    {/* <Box display="flex" alignItems="center" gap={1} mb={1}>
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
                    </Box> */}
                </CardContent>
            </Card>

            {/* Portfólio */}
            {/* {user.WorkerProfile?.portfolio && user.WorkerProfile?.portfolio?.length > 0 && (
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
            )} */}
        </Container>
    );
};

export default WorkerProfilePage;
