'use client';

import { useEffect, useState } from 'react';
import { Box, Grid, Card, Typography, Skeleton, Divider, Button } from '@mui/material';
import { Prisma } from '@prisma/client';
import Link from 'next/link';
import { BsChatText } from 'react-icons/bs';
import { useRouter } from 'next/navigation';
import { useUser } from '@/context/UserContext';

type ApplicationWithRelations = Prisma.ApplicationGetPayload<{
    include: {
        worker: {
            select: {
                id: true;
                username: true;
                profilePhoto: true;
            };
        };
        project: {
            select: {
                id: true;
                title: true;
            };
        };
    };
}>;

const ApplicationsToMePage = () => {
    const [applications, setApplications] = useState<ApplicationWithRelations[] | null>(null);
    const [loading, setLoading] = useState(true);

    const router = useRouter()
    const { user } = useUser()

    const fetchApplications = async () => {
        try {
            const response = await fetch('/api/projects/applications', { credentials: 'include' });
            const data = await response.json();
            let application = []
            data.data.map((d) => { if (d.applications.length) { application.push(d.applications[0]) } })
            console.log(application)
            setApplications(application);
        } catch (error) {
            console.error('Erro ao carregar aplicações:', error);
        } finally {
            setLoading(false);
        }
    };

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

    useEffect(() => {
        fetchApplications();
    }, []);

    return (
        <Box sx={{ display: 'flex', padding: { xs: 2, md: 4 }, color: '#fff', minHeight: '100vh' }}>
            <Box sx={{ flex: 1 }}>
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#9c4dcc', marginBottom: 4 }}>
                    Aplicações Recebidas
                </Typography>
                <Grid container spacing={4}>
                    {loading
                        ? Array.from({ length: 6 }).map((_, index) => (
                            <Grid item xs={12} sm={6} md={4} key={index}>
                                <Card sx={{ backgroundColor: '#2c2c2c', padding: 3 }}>
                                    <Skeleton variant="rectangular" height={150} sx={{ marginBottom: 2 }} />
                                    <Skeleton variant="text" width="60%" sx={{ marginBottom: 1 }} />
                                    <Skeleton variant="text" width="40%" />
                                </Card>
                            </Grid>
                        ))
                        : applications?.map((application) => (
                            <Grid item xs={12} sm={6} md={4} key={application.id}>
                                <Card sx={{ backgroundColor: '#2c2c2c', padding: 3, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxShadow: 3 }}>
                                    <Box>
                                        <Typography variant="h6" sx={{ color: '#fff', marginBottom: 1 }}>
                                            {application.project.title}
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: '#ddd', marginBottom: 2 }}>
                                            Candidato: {application.worker.username}
                                        </Typography>
                                    </Box>
                                    {application.worker.profilePhoto ? (
                                        <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: 2 }}>
                                            <img src={application.worker.profilePhoto} alt={application.worker.username} className="w-10 h-10 rounded-full" />
                                            <Typography variant="body2" sx={{ color: '#ddd', marginLeft: 2 }}>
                                                {application.coverLetter ? application.coverLetter : "Sem carta de apresentação"}
                                            </Typography>
                                        </Box>
                                    ) : (
                                        <Box className="h-10" sx={{ backgroundColor: '#444', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#bbb' }}>
                                            Sem foto
                                        </Box>
                                    )}
                                    <Typography variant="body2" sx={{ color: '#bbb', marginBottom: 2 }}>
                                        Valor proposto: R$ {application.proposedFee.toFixed(2)}
                                    </Typography>
                                    <Link href={`/projects/${application.project.id}`}>
                                        <Button sx={{ color: '#9c4dcc', fontSize: '0.75rem', marginTop: 2 }}>
                                            Ver projeto
                                        </Button>
                                    </Link>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={handleContact}
                                        startIcon={<BsChatText size={24} />}
                                        sx={{
                                            textTransform: "none", // Remove a capitalização automática
                                            fontWeight: "bold",
                                            fontSize: "1rem",
                                            marginTop: '4px',
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
                                </Card>
                            </Grid>
                        ))}
                    {!loading && applications && !applications[0] && <Typography variant="h5" className='m-10'>Nenhuma aplicação recebida por enquanto.</Typography>}
                </Grid>
            </Box>
        </Box>
    );
};

export default ApplicationsToMePage;
