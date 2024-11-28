'use client';

import { useEffect, useState } from 'react';
import { Box, Grid, Card, Typography, TextField, Checkbox, FormControlLabel, Button, Skeleton, FormGroup, Divider } from '@mui/material';
import { Prisma } from '@prisma/client';
import Link from 'next/link';

type ProjectWithRelations = Prisma.ProjectGetPayload<{
    include: {
      hashtags: true;
      author: {
        select: {
          id: true;
          username: true;
          profilePhoto: true;
        };
      };
    };
  }>;

const ProjectsPage = () => {
    const [projects, setProjects] = useState<ProjectWithRelations[] | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const [hashtags, setHashtags] = useState<string[]>([]);
    const [selectedHashtags, setSelectedHashtags] = useState<string[]>([]);

    const fetchProjects = async () => {
        try {
            const response = await fetch('/api/projects', { credentials: 'include' });
            const responseJson = await response.json();
            const data = responseJson.data;

            if (data.projects) {
                setProjects(data.projects);

                const uniqueHashtags = Array.from(
                    new Set(data.projects.flatMap((post: ProjectWithRelations) => post.hashtags.map((tag) => tag.name)))
                );
                setHashtags(uniqueHashtags as string[]);
            }
        } catch (error) {
            console.error('Erro ao carregar projetos:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleHashtagChange = (hashtag: string) => {
        setSelectedHashtags((prev) =>
            prev.includes(hashtag) ? prev.filter((h) => h !== hashtag) : [...prev, hashtag]
        );
    };

    useEffect(() => {
        fetchProjects();
    }, []);

    const filteredProjects = projects?.filter((project) =>
            project.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
            (selectedHashtags.length === 0 || project.hashtags.some((tag) => selectedHashtags.includes(tag.name)))
    );

    return (
        <Box sx={{ display: 'flex', padding: { xs: 2, md: 4 }, backgroundColor: '#121212', color: '#fff', minHeight: '100vh' }}>
            {/* Filtros na Lateral */}
            <Box
                sx={{
                    width: { xs: '100%', md: '25%' },
                    backgroundColor: '#1e1e1e',
                    padding: 3,
                    borderRadius: 2,
                    marginRight: { md: 4 },
                    marginBottom: { xs: 4, md: 0 },
                }}
            >
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#9c4dcc', marginBottom: 2 }}>
                    Filtros
                </Typography>
                {/* Barra de Pesquisa */}
                <TextField
                    fullWidth
                    placeholder="Pesquisar por título..."
                    variant="outlined"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    sx={{
                        marginBottom: 3,
                        backgroundColor: '#2c2c2c',
                        input: { color: '#fff' },
                    }}
                />
                <Divider sx={{ marginBottom: 3, borderColor: '#444' }} />
                <Typography variant="subtitle1" sx={{ color: '#ddd', marginBottom: 1 }}>
                    Hashtags
                </Typography>
                <FormGroup>
                    {hashtags.length > 0 ? (
                        hashtags.map((hashtag) => (
                            <FormControlLabel
                                key={hashtag}
                                control={
                                    <Checkbox
                                        checked={selectedHashtags.includes(hashtag)}
                                        onChange={() => handleHashtagChange(hashtag)}
                                        sx={{ color: '#9c4dcc' }}
                                    />
                                }
                                label={<Typography sx={{ color: '#fff' }}>#{hashtag}</Typography>}
                            />
                        ))
                    ) : (
                        <Skeleton variant="text" width="80%" sx={{ backgroundColor: '#444' }} />
                    )}
                </FormGroup>
                <Divider sx={{ marginY: 3, borderColor: '#444' }} />
            </Box>

            {/* Listagem de Projetos */}
            <Box sx={{ flex: 1 }}>
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#9c4dcc', marginBottom: 4 }}>
                    Projetos
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
                        : filteredProjects?.map((project) => (
                            <Grid item xs={12} sm={6} md={4} key={project.id}>
                                <Card sx={{ backgroundColor: '#2c2c2c', padding: 3, height: '100%', display: 'flex', justifyContent: 'space-between', flexDirection: 'column', boxShadow: 3 }}>
                                    <Typography variant="h6" sx={{ color: '#fff', marginBottom: 1 }}>
                                        {project.title}
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: '#ddd', marginBottom: 2 }}>
                                        {project.description.substring(0, 100)}...
                                    </Typography>
                                    <Typography variant="caption" sx={{ color: '#bbb' }}>
                                        Criado por {project.author.username} • {new Date(project.createdAt).toLocaleDateString()}
                                    </Typography>
                                    <Link href={`/projects/${project.id}`}>
                                        <Button sx={{ color: '#9c4dcc', fontSize: '0.75rem', marginTop: 2 }}>
                                            Saiba mais
                                        </Button>
                                    </Link>
                                </Card>
                            </Grid>
                        ))}
                </Grid>
            </Box>
        </Box>
    );
};

export default ProjectsPage;
