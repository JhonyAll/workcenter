'use client'

import CreateMenuButton from "@/components/CreateMenuButton";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Prisma } from "@prisma/client";
import { Box, Button, Card, CardContent, Grid, Typography, Avatar, Skeleton } from '@mui/material';

type PostWithRelations = Prisma.PostGetPayload<{
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

const Home = () => {
  const [posts, setPosts] = useState<PostWithRelations[] | null>(null);
  const [projects, setProjects] = useState<ProjectWithRelations[] | null>(null);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [loadingWorkers, setLoadingWorkers] = useState(true);

  const handleFetchRecentsPosts = async () => {
    const fetchApiPosts = await fetch('api/posts?quant=3', { credentials: 'include', next: { revalidate: 100 }, method: 'GET' })
      .then(response => response.json())
      .then(response => response.data.posts);

    setPosts(fetchApiPosts);
    setLoadingPosts(false);
  };

  const handleFetchRecentsProjects = async () => {
    const fetchApiProjects = await fetch('api/project?quant=3', { credentials: 'include', next: { revalidate: 100 }, method: 'GET' })
      .then(response => response.json())
      .then(response => response.data.projects);

    setProjects(fetchApiProjects);
    setLoadingProjects(false);
  };

  const workers = [
    { name: "Carlos", jobTitle: "Desenvolvedor Front-end", location: "São Paulo", rating: 4.8 },
    { name: "Ana", jobTitle: "Designer Gráfico", location: "Rio de Janeiro", rating: 4.5 },
    { name: "Fernanda", jobTitle: "Redatora", location: "Belo Horizonte", rating: 4.9 },
  ];

  useEffect(() => {
    handleFetchRecentsPosts();
    handleFetchRecentsProjects();
    setTimeout(() => setLoadingWorkers(false), 2000);  // Simulação de carregamento dos freelancers
  }, []);

  return (
    <Box sx={{ padding: { xs: '10px 20px', md: '20px 100px' }, maxWidth: '100%', margin: '0 auto', gap: '20px', display: 'flex', flexDirection: 'column' }}>
      {/* Seção de Posts */}
      <section>
        <Typography variant="h4" sx={{ fontWeight: 600, color: '#fff', marginBottom: 4 }}>
          Postagens Recentes
        </Typography>
        <Grid container spacing={4}>
          {loadingPosts ? (
            Array.from({ length: 3 }).map((_, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card sx={{ backgroundColor: '#2c2c2c', height: '100%', display: 'flex', flexDirection: 'column', padding: 2 }}>
                  <Skeleton variant="rectangular" width="100%" height={200} sx={{ marginBottom: 2 }} />
                  <Skeleton variant="text" width="80%" sx={{ marginBottom: 1 }} />
                  <Skeleton variant="text" width="60%" />
                </Card>
              </Grid>
            ))
          ) : (
            posts?.map(post => (
              <Grid item xs={12} sm={6} md={4} key={post.id}>
                <Card sx={{ backgroundColor: '#2c2c2c', height: '100%', display: 'flex', justifyContent: 'space-between' , flexDirection: 'column', padding: 2, boxShadow: 3 }}>
                  {post.gallery[0] ? (
                    <img src={post.gallery[0]} alt={post.title} className="w-full h-32 object-cover rounded-lg mb-3" />
                  ) : (
                    <Box sx={{ backgroundColor: '#444', height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#bbb' }}>
                      Sem mídia
                    </Box>
                  )}
                  <Typography variant="h6" sx={{ color: '#9c4dcc', fontWeight: 'bold', marginBottom: 1 }}>
                    {post.title}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#ddd', marginBottom: 1 }}>
                    {post.description.substring(0, 100)}...
                  </Typography>
                  <Box sx={{ fontSize: '0.75rem', color: '#bbb' }}>
                    <span>{post.author.username}</span> • <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                  </Box>
                  <Link href={`/posts/${post.id}`}>
                    <Button sx={{ color: '#9c4dcc', fontSize: '0.75rem', marginTop: 2 }}>
                      Leia mais
                    </Button>
                  </Link>
                </Card>
              </Grid>
            ))
          )}
        </Grid>
        <Button variant="contained" sx={{ backgroundColor: '#9c4dcc', color: '#fff', marginTop: 3 }}>
          Ver Mais
        </Button>
      </section>

      {/* Seção de Projetos */}
      <section>
        <Typography variant="h4" sx={{ fontWeight: 600, color: '#fff', marginBottom: 4 }}>
          Projetos Recentes
        </Typography>
        <Grid container spacing={4}>
          {loadingProjects ? (
            Array.from({ length: 3 }).map((_, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card sx={{ backgroundColor: '#2c2c2c', height: '100%', padding: 2, boxShadow: 3 }}>
                  <Skeleton variant="text" width="80%" sx={{ marginBottom: 1 }} />
                  <Skeleton variant="text" width="60%" sx={{ marginBottom: 1 }} />
                  <Skeleton variant="rectangular" width="100%" height={200} />
                  <Skeleton variant="text" width="40%" sx={{ marginTop: 1 }} />
                </Card>
              </Grid>
            ))
          ) : (
            projects && projects.map((project, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card sx={{ backgroundColor: '#2c2c2c', height: '100%', padding: 2, boxShadow: 3 }}>
                  <Typography variant="h6" sx={{ color: '#9c4dcc', fontWeight: 'bold', marginBottom: 1 }}>
                    {project.title}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#ddd', marginBottom: 1 }}>
                    {project.description}
                  </Typography>
                  <Box sx={{ fontSize: '0.75rem', color: '#bbb', marginBottom: 1 }}>
                    <span><strong>Orçamento:</strong> {project.budget}</span>
                  </Box>
                  <Box sx={{ fontSize: '0.75rem', color: '#bbb' }}>
                    <span><strong>Categorias:</strong> {project.hashtags.map((h, index) => (
                      <Link key={index} href={`/categories/${h.id}`} style={{ color: '#9c4dcc', marginRight: 5 }}>
                        #{h.name}
                      </Link>
                    ))}</span>
                  </Box>
                  <Link href={`/projects/${project.id}`}>
                    <Button sx={{ color: '#9c4dcc', fontSize: '0.75rem', marginTop: 2 }}>
                      Ver Projeto
                    </Button>
                  </Link>
                </Card>
              </Grid>
            ))
          )}
        </Grid>
        <Button variant="contained" sx={{ backgroundColor: '#9c4dcc', color: '#fff', marginTop: 3 }}>
          Ver Mais
        </Button>
      </section>

      {/* Seção de Freelancers */}
      <section>
        <Typography variant="h4" sx={{ fontWeight: 600, color: '#fff', marginBottom: 4 }}>
          Freelancers Sugeridos
        </Typography>
        <Grid container spacing={4}>
          {loadingWorkers ? (
            Array.from({ length: 3 }).map((_, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card sx={{ backgroundColor: '#2c2c2c', height: '100%', padding: 2, boxShadow: 3 }}>
                  <Skeleton variant="circular" width={40} height={40} sx={{ marginBottom: 2 }} />
                  <Skeleton variant="text" width="80%" sx={{ marginBottom: 1 }} />
                  <Skeleton variant="text" width="60%" />
                  <Skeleton variant="text" width="40%" sx={{ marginTop: 2 }} />
                </Card>
              </Grid>
            ))
          ) : (
            workers.map((worker, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card sx={{ backgroundColor: '#2c2c2c', height: '100%', padding: 2, boxShadow: 3 }}>
                  <Avatar sx={{ backgroundColor: '#9c4dcc', width: 40, height: 40, marginBottom: 2 }} />
                  <Typography variant="h6" sx={{ color: '#fff', fontWeight: 'bold' }}>
                    {worker.name}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#bbb' }}>
                    {worker.jobTitle}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#bbb' }}>
                    {worker.location}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#bbb' }}>
                    Avaliação: {worker.rating} ★
                  </Typography>
                </Card>
              </Grid>
            ))
          )}
        </Grid>
        <Button variant="contained" sx={{ backgroundColor: '#9c4dcc', color: '#fff', marginTop: 3 }}>
          Ver Mais
        </Button>
      </section>

      <CreateMenuButton />
    </Box>
  );
};

export default Home;
