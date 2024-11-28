'use client'; import { useEffect, useState } from 'react'; import type { Prisma } from '@prisma/client'; import Image from 'next/image'; import Link from 'next/link'; import { Box, Typography, Button, Avatar, Card, Skeleton, TextField, Divider } from '@mui/material'; import { FaUserCircle } from 'react-icons/fa'; type PostWithRelations = Prisma.PostGetPayload<{ include: { hashtags: true; author: { select: { id: true; username: true; profilePhoto: true; }; }; comments: { include: { author: { select: { id: true; username: true; profilePhoto: true; }; }; }; }; }; }>;

const PostPage = ({ params }: { params: Promise<{ postId: string }> }) => {
  const [post, setPost] = useState<PostWithRelations | null>(null);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState('');
  const [commentLoading, setCommentLoading] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      const { postId } = await params;
      const response = await fetch(`/api/posts/${postId}`);
      const data = await response.json();
      setPost(data?.data?.post);
      setLoading(false);
    };
    fetchPost();
  }, [params]);

  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    setCommentLoading(true);

    try {
      const { postId } = await params;
      const response = await fetch('/api/posts/comment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ postId, content: newComment }),
      });

      const data = await response.json();

      if (data.status === 'success') {
        setPost((prev) => prev && {
          ...prev,
          comments: [data.data, ...prev.comments],
        });
        setNewComment('');
      }
    } catch (error) {
      console.error('Erro ao adicionar comentário:', error);
    }

    setCommentLoading(false);
  };

  return (
    <Box sx={{ padding: 4, margin: '0 auto', maxWidth: 800 }}>
      {loading ? (
        <SkeletonLoader />
      ) : post ? (
        <Box display="flex" flexDirection="column" gap={4}>
          {/* Autor e Data */}
          <Box display="flex" alignItems="center" gap={2}>
            {post.author.profilePhoto && post.author.profilePhoto !== 'N/A' ? (
              <Avatar src={post.author.profilePhoto} alt={post.author.username} sx={{ width: 56, height: 56 }} />
            ) : (
              <Avatar sx={{ width: 56, height: 56, bgcolor: 'grey.400' }}>
                <FaUserCircle size={28} />
              </Avatar>
            )}
            <Box>
              <Link href={`/user/${post.author.username}`} passHref>
                <Typography variant="h6" fontWeight="bold" color="primary">
                  {post.author.username}
                </Typography>
              </Link>
              <Typography variant="caption" color="text.secondary">
                Publicado em: {new Date(post.createdAt).toLocaleDateString()}
              </Typography>
            </Box>
          </Box>

          {/* Título */}
          <Typography variant="h4" fontWeight="bold" textAlign="center" color="primary.main">
            {post.title}
          </Typography>

          {/* Descrição */}
          <Typography variant="body1" textAlign="justify" color="text.primary">
            {post.description}
          </Typography>

          {/* Galeria */}
          <Box display="grid" gridTemplateColumns={{ xs: '1fr', md: 'repeat(3, 1fr)' }} gap={2}>
            {post.gallery.map((media, index) =>
              media.includes('.mp4') || media.includes('.webm') ? (
                <video
                  key={index}
                  controls
                  width="100%"
                  style={{ borderRadius: '8px' }}
                  className="media-item"
                >
                  <source src={media} type="video/mp4" />
                  Seu navegador não suporta vídeos.
                </video>
              ) : (
                <Image
                  key={index}
                  src={media}
                  alt=""
                  width={500}
                  height={500}
                  style={{ borderRadius: '8px', objectFit: 'cover', width: '100%', height: 'auto' }}
                />
              )
            )}
          </Box>

          {/* Hashtags */}
          <Box display="flex" flexWrap="wrap" gap={1}>
            {post.hashtags.map((hashtag, index) => (
              <Button
                key={index}
                variant="contained"
                size="small"
                color="secondary"
                href={`/categories/${hashtag.id}`}
                sx={{ textTransform: 'none', borderRadius: '16px' }}
              >
                #{hashtag.name}
              </Button>
            ))}
          </Box>

          {/* Links */}
          {post.links.length > 0 && (
            <Box>
              <Typography variant="h6" fontWeight="bold">
                Links Relacionados:
              </Typography>
              <ul>
                {post.links.map((link, index) => (
                  <li key={index}>
                    <a href={link} target="_blank" rel="noopener noreferrer" className="text-link">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </Box>
          )}

          {/* Código Incorporado */}
          {post.embedCode && (
            <Box>
              <Typography variant="h6" fontWeight="bold">
                Código Incorporado:
              </Typography>
              <Box
                component="pre"
                sx={{
                  backgroundColor: 'grey.900',
                  color: 'white',
                  padding: 2,
                  borderRadius: '8px',
                  overflowX: 'auto',
                  mt: 2,
                }}
              >
                <code>{post.embedCode}</code>
              </Box>
            </Box>
          )}

          {/* Comentários */}
          <Box>
            <Typography variant="h6" fontWeight="bold">
              Comentários
            </Typography>
            <Divider sx={{ my: 2 }} />
            <Box display="flex" flexDirection="column" gap={2}>
              {post.comments.map((comment) => (
                <Card key={comment.id} sx={{ padding: 2, borderRadius: '8px' }}>
                  <Box display="flex" alignItems="center" gap={2}>
                    {comment.author.profilePhoto && comment.author.profilePhoto !== 'N/A' ? (
                      <Avatar src={comment.author.profilePhoto} alt={comment.author.username} sx={{ width: 32, height: 32 }} />
                    ) : (
                      <Avatar sx={{ width: 32, height: 32, bgcolor: 'grey.400' }}>
                        <FaUserCircle size={16} />
                      </Avatar>
                    )}
                    <Typography variant="subtitle2" fontWeight="bold">
                      {comment.author.username}
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    {comment.content}
                  </Typography>
                </Card>
              ))}
            </Box>

            {/* Campo de Novo Comentário */}
            <TextField
              fullWidth
              placeholder="Adicione um comentário..."
              variant="outlined"
              multiline
              rows={3}
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              sx={{ mt: 2 }}
            />
            <Button
              variant="contained"
              color="primary"
              sx={{ mt: 2 }}
              onClick={handleAddComment}
              disabled={commentLoading}
            >
              Enviar
            </Button>
          </Box>
        </Box>
      ) : (
        <SkeletonLoader />
      )}
    </Box>
  );
};

const SkeletonLoader = () => (
  <Box sx={{ padding: 4, margin: '0 auto', maxWidth: 800, display: 'flex', flexDirection: 'column', gap: 2 }}>
    <Skeleton variant="rectangular" height={56} />
    <Skeleton variant="text" width="60%" />
    <Skeleton variant="rectangular" height={300} />
    <Skeleton variant="text" width="80%" />
    <Skeleton variant="text" width="90%" />
  </Box>
);

export default PostPage;
