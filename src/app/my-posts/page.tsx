'use client'

import { useEffect, useState } from "react";
import { Box, Card, CardContent, Typography, Avatar, Chip, Divider, List, ListItem, ListItemText, IconButton } from "@mui/material";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/UserContext"; // Certifique-se de ter um contexto de usuário implementado

// Tipos de dados para os posts
type Post = {
  id: string;
  title: string;
  content: string;
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
};

const MeusPosts = () => {
  const { user } = useUser(); // Pegando o usuário logado do contexto
  const [posts, setPosts] = useState<Post[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch("/api/auth/my-posts");
        const data = await response.json();
        if (data.status === "success") {
          setPosts(data.data);
        } else {
          console.error("Erro ao carregar posts", data.message);
        }
      } catch (error) {
        console.error("Erro ao carregar posts", error);
      }
    };

    if (user) {
      fetchPosts(); // Chama a função para carregar os posts
    }
  }, [user]);

  if (!user) {
    return (
      <Box sx={{ p: 4, textAlign: "center" }}>
        <Typography variant="h6" color="gray">
          Você precisa estar logado para ver seus posts.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ color: "#fff", fontWeight: "bold" }}>
        Meus Posts
      </Typography>

      {posts.length === 0 ? (
        <Typography variant="h6" color="gray">
          Você ainda não tem posts.
        </Typography>
      ) : (
        <List>
          {posts.map((post) => (
            <Card key={post.id} sx={{ mb: 3, backgroundColor: "#1f1f1f", borderRadius: 2 }}>
              <CardContent>
                <Typography variant="h6" sx={{ color: "#fff", fontWeight: "bold" }}>
                  {post.title}
                </Typography>
                <Typography variant="body2" sx={{ color: "#bbb", mt: 1 }}>
                  {post.content}
                </Typography>

                <Box sx={{ display: "flex", alignItems: "center", gap: 2, mt: 2 }}>
                  <Avatar src={post.author.profilePhoto} alt={post.author.username} />
                  <Typography variant="body2" sx={{ color: "#fff" }}>
                    {post.author.username}
                  </Typography>
                </Box>

                <Box sx={{ mt: 2 }}>
                  {post.hashtags.map((hashtag) => (
                    <Chip key={hashtag.name} label={`#${hashtag.name}`} sx={{ mr: 1, backgroundColor: "#333", color: "white" }} />
                  ))}
                </Box>

                <Divider sx={{ my: 2, backgroundColor: "#444" }} />

                <Typography variant="subtitle1" sx={{ color: "#fff", fontWeight: "bold" }}>
                  Comentários:
                </Typography>
                {post.comments.length > 0 ? (
                  post.comments.map((comment) => (
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
              </CardContent>
            </Card>
          ))}
        </List>
      )}
    </Box>
  );
};

export default MeusPosts;
