"use client";

import { useUser } from "@/context/UserContext";
import handleUpload from "@/utils/uploadForFirebase";
import { useState } from "react";
import { IoIosClose } from "react-icons/io";
import { useRouter } from "next/navigation";
import { Button, TextField, Grid, Chip, Box, Typography, IconButton } from "@mui/material";

const CreatePostPage = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [categories, setCategories] = useState<string[]>([]);
  const [newCategory, setNewCategory] = useState("");
  const [media, setMedia] = useState<File[]>([]);
  const [codeSnippet, setCodeSnippet] = useState("");
  const [links, setLinks] = useState<string[]>([]);
  const [newLink, setNewLink] = useState("");
  const [preview, setPreview] = useState(false);

  const { user } = useUser();
  const router = useRouter();

  const handleMultipleUploads = async (files: File[]) => {
    try {
      const uploadPromises = files.map((file) => handleUpload(file));
      const downloadURLs = await Promise.all(uploadPromises);
      return downloadURLs;
    } catch (error) {
      console.error("Erro durante o upload de arquivos:", error);
      throw error;
    }
  };

  const handlePublishPost = async () => {
    const body = {
      title,
      description,
      gallery: await handleMultipleUploads(media),
      links,
      hashtags: categories,
      codeSnippet,
      userId: user?.id,
    };

    try {
      const response = await fetch("/api/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const result = await response.json();

      if (response.ok) {
        router.push("/");
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.error("Erro ao criar o post:", error);
      alert("Erro ao criar o post. Tente novamente.");
    }
  };

  const handleViewPreview = () => {
    setPreview(!preview);
  };

  const handleAddLink = () => {
    if (newLink.trim() && !links.includes(newLink)) {
      setLinks([...links, newLink]);
      setNewLink("");
    }
  };

  const handleRemoveLink = (link: string) => {
    setLinks(links.filter((l) => l !== link));
  };

  const handleAddCategory = () => {
    if (newCategory.trim() && !categories.includes(newCategory)) {
      setCategories([...categories, newCategory]);
      setNewCategory("");
    }
  };

  const handleRemoveCategory = (category: string) => {
    setCategories(categories.filter((cat) => cat !== category));
  };

  const handleMediaUpload = (files: FileList | null) => {
    if (files) {
      setMedia([...media, ...Array.from(files)]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    handleMediaUpload(e.dataTransfer.files);
  };

  return (
    <Box className="min-h-screen max-w-screen text-white p-6">
      <Grid container sx={{ paddingX: 8,gap: '8px', justifyContent: 'space-between' }}>
        {/* Editor */}
        <Grid item xs={12} lg={6} className="lg:max-h-[500px] lg:overflow-y-auto lg:scroll-y-auto bg-[#1e1e1e] rounded p-6">
          <Typography variant="h4" component="h1" gutterBottom fontWeight={700}>
            Criar Post
          </Typography>

          <Box className="space-y-4">
            <TextField
              label="Título do Post"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              fullWidth
              variant="outlined"
              InputProps={{
                style: { backgroundColor: "#333333", color: "white" },
              }}
            />

            <TextField
              label="Descrição"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              fullWidth
              variant="outlined"
              multiline
              rows={4}
              InputProps={{
                style: { backgroundColor: "#333333", color: "white" },
              }}
            />

            <Box>
              <Typography variant="h6">Links</Typography>
              <Box className="flex items-center space-x-2">
                <TextField
                  label="Adicionar link (ex: https://meusite.com)"
                  value={newLink}
                  onChange={(e) => setNewLink(e.target.value)}
                  fullWidth
                  variant="outlined"
                  InputProps={{
                    style: { backgroundColor: "#333333", color: "white" },
                  }}
                />
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={handleAddLink}
                  sx={{ padding: "8px 16px" }}
                >
                  Adicionar
                </Button>
              </Box>

              <Box className="flex flex-wrap mt-2 gap-2">
                {links.map((link, idx) => (
                  <Chip
                    key={idx}
                    label={link}
                    clickable
                    color="primary"
                    onDelete={() => handleRemoveLink(link)}
                  />
                ))}
              </Box>
            </Box>

            <Box>
              <Typography variant="h6">Categorias (Hashtags)</Typography>
              <Box className="flex items-center space-x-2">
                <TextField
                  label="Adicionar categoria"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  fullWidth
                  variant="outlined"
                  InputProps={{
                    style: { backgroundColor: "#333333", color: "white" },
                  }}
                />
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={handleAddCategory}
                  sx={{ padding: "8px 16px" }}
                >
                  Adicionar
                </Button>
              </Box>

              <Box className="flex flex-wrap mt-2 gap-2">
                {categories.map((category, idx) => (
                  <Chip
                    key={idx}
                    label={`#${category}`}
                    clickable
                    color="primary"
                    onDelete={() => handleRemoveCategory(category)}
                  />
                ))}
              </Box>
            </Box>

            <Box>
              <Typography variant="h6">Imagens e Vídeos</Typography>
              <Box
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                className="border-2 border-dashed border-purple-400 rounded-lg p-4 text-center hover:border-purple-300"
              >
                <Typography variant="body2" color="textSecondary">
                  Arraste e solte arquivos aqui ou clique abaixo
                </Typography>
                <input
                  type="file"
                  multiple
                  accept="image/*,video/*"
                  onChange={(e) => handleMediaUpload(e.target.files)}
                  className="mt-4"
                />
              </Box>
            </Box>

            <Box>
              <Typography variant="h6">Código Incorporado</Typography>
              <TextField
                label="Seu código aqui"
                value={codeSnippet}
                onChange={(e) => setCodeSnippet(e.target.value)}
                fullWidth
                variant="outlined"
                multiline
                rows={4}
                InputProps={{
                  style: { backgroundColor: "#333333", color: "white" },
                }}
              />
            </Box>

            <Box className="mt-4">
              <Button
                variant="contained"
                color="primary"
                onClick={handleViewPreview}
                sx={{ width: "100%" }}
              >
                Visualizar Preview
              </Button>
              <Button
                variant="contained"
                color="secondary"
                onClick={handlePublishPost}
                sx={{ width: "100%", mt: 2 }}
              >
                Publicar Post
              </Button>
            </Box>
          </Box>
        </Grid>

        {/* Preview */}
        <Grid item xs={12} lg={5}>
          <Box
            className={`min-h-[500px] p-6 bg-[#1e1e1e] rounded ${preview ? "block" : "hidden"}`}
          >
            <Box display="flex" justifyContent="space-between" mb={4}>
              <Typography variant="h4" color="primary" fontWeight={700}>
                Preview
              </Typography>
              <IconButton color="primary" onClick={handleViewPreview}>
                <IoIosClose size={30} />
              </IconButton>
            </Box>

            <Box>
              <Typography variant="h5" color="primary">
                {title || "Título do Post"}
              </Typography>
              <Typography variant="body1" color="textSecondary" paragraph>
                {description || "Descrição do post."}
              </Typography>
              <Box display="flex" flexWrap="wrap">
                {categories.map((category) => (
                  <Chip label={`#${category}`} key={category} color="primary" className="mr-2" />
                ))}
              </Box>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default CreatePostPage;
