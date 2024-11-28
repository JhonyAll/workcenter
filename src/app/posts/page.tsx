'use client';

import { useEffect, useState } from 'react';
import { Box, Grid, Card, Typography, TextField, Checkbox, FormControlLabel, Button, Skeleton, FormGroup, Divider } from '@mui/material';
import { Prisma } from '@prisma/client';
import Link from 'next/link';

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

const PostsPage = () => {
    const [posts, setPosts] = useState<PostWithRelations[] | null>(null);
    const [hashtags, setHashtags] = useState<string[]>([]);
    const [selectedHashtags, setSelectedHashtags] = useState<string[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);

    const fetchPosts = async () => {
        try {
            const response = await fetch('/api/posts', { credentials: 'include' });
            const responseJson = await response.json();
            const data = responseJson.data;

            if (data.posts) {
                setPosts(data.posts);

                // Extrair hashtags únicas
                const uniqueHashtags = Array.from(
                    new Set(data.posts.flatMap((post: PostWithRelations) => post.hashtags.map((tag) => tag.name)))
                );
                setHashtags(uniqueHashtags as string[]);
            }
        } catch (error) {
            console.error('Erro ao carregar posts:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    const filteredPosts = posts?.filter(
        (post) =>
            post.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
            (selectedHashtags.length === 0 || post.hashtags.some((tag) => selectedHashtags.includes(tag.name)))
    );

    const handleHashtagChange = (hashtag: string) => {
        setSelectedHashtags((prev) =>
            prev.includes(hashtag) ? prev.filter((h) => h !== hashtag) : [...prev, hashtag]
        );
    };

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
                {/* Hashtags */}
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

            {/* Listagem de Posts */}
            <Box sx={{ flex: 1 }}>
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#9c4dcc', marginBottom: 4 }}>
                    Postagens
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
                        : filteredPosts?.map((post) => (
                            <Grid item xs={12} sm={6} md={4} key={post.id}>
                                <Card sx={{ backgroundColor: '#2c2c2c', padding: 3, height: '100%', display: 'flex', justifyContent: 'space-between', flexDirection: 'column', boxShadow: 3 }}>
                                    {post.gallery[0] ? (
                                        <img src={post.gallery[0]} alt={post.title} className="w-full h-32 object-cover rounded-lg mb-3" />
                                    ) : (
                                        <Box className="h-32" sx={{ backgroundColor: '#444', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#bbb' }}>
                                            Sem mídia
                                        </Box>
                                    )}
                                    <Typography variant="h6" sx={{ color: '#fff', marginBottom: 1 }}>
                                        {post.title}
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: '#ddd', marginBottom: 2 }}>
                                        {post.description.substring(0, 100)}...
                                    </Typography>
                                    <Typography variant="caption" sx={{ color: '#bbb' }}>
                                        Por {post.author.username} • {new Date(post.createdAt).toLocaleDateString()}
                                    </Typography>
                                    <Link href={`/posts/${post.id}`}>
                                        <Button sx={{ color: '#9c4dcc', fontSize: '0.75rem', marginTop: 2 }}>
                                            Leia mais
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

export default PostsPage;
