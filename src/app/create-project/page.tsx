"use client";

import { useUser } from "@/context/UserContext";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { IoIosClose, IoMdAdd } from "react-icons/io";
import { Button, TextField, Grid, Box, Typography, Chip, IconButton, Select, MenuItem, InputLabel, FormControl } from "@mui/material";

const CreateProjectPage = () => {
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [budgetType, setBudgetType] = useState<string>("negotiable");
  const [budgetValue, setBudgetValue] = useState<string>("");
  const [deadline, setDeadline] = useState<string>("");
  const [hashtags, setHashtags] = useState<string[]>([]);
  const [newHashtag, setNewHashtag] = useState<string>("");

  const { user } = useUser();
  const router = useRouter();

  const handleAddHashtag = () => {
    if (newHashtag.trim() && !hashtags.includes(newHashtag)) {
      setHashtags((prev) => [...prev, newHashtag]);
      setNewHashtag("");
    }
  };

  const handleRemoveHashtag = (hashtag: string) => {
    setHashtags((prev) => prev.filter((h) => h !== hashtag));
  };

  const handlePublishProject = async () => {
    const body = {
      title,
      description,
      budget: budgetType === "negotiable" ? "A negociar" : budgetValue,
      deadline,
      hashtags,
      userId: user?.id,
    };

    try {
      const response = await fetch("/api/project", {
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
      console.error("Erro ao criar o projeto:", error);
      alert("Erro ao criar o projeto. Tente novamente.");
    }
  };

  return (
    <Box className="min-h-screen flex bg-[#0A0A0A] text-white p-6 gap-6">
      {/* Formulário */}
      <Grid container sx={{ paddingX: 8, gap: "8px", justifyContent: "space-between" }}>
        <Grid item xs={12} lg={6} className="lg:max-h-[500px] bg-[#1e1e1e] lg:overflow-y-auto lg:scroll-y-auto rounded p-6">
          <Typography variant="h4" component="h1" gutterBottom fontWeight={700}>
            Criar Projeto
          </Typography>
          <Box className="space-y-4">
            <TextField
              label="Título do Projeto"
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

            {/* Orçamento */}
            <Box>
              <Typography variant="h6" mb={1}>Orçamento</Typography>
              <FormControl fullWidth>
                <InputLabel>Tipo de Orçamento</InputLabel>
                <Select
                  value={budgetType}
                  onChange={(e) => setBudgetType(e.target.value)}
                  label="Tipo de Orçamento"
                  sx={{ backgroundColor: "#333333", color: "white", marginBottom: 2 }}
                >
                  <MenuItem value="negotiable">A negociar</MenuItem>
                  <MenuItem value="total">Especificar orçamento</MenuItem>
                </Select>
              </FormControl>

              {budgetType !== "negotiable" && (
                <TextField
                  label="Valor do Orçamento"
                  value={budgetValue}
                  type="number"
                  onChange={(e) => setBudgetValue(e.target.value)}
                  fullWidth
                  variant="outlined"
                  InputProps={{
                    style: { backgroundColor: "#333333", color: "white" },
                  }}
                />
              )}
            </Box>

            {/* Prazo */}
            <Box>
              <Typography variant="h6">Prazo</Typography>
              <TextField
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                fullWidth
                variant="outlined"
                InputProps={{
                  style: { backgroundColor: "#333333", color: "white" },
                }}
              />
            </Box>

            {/* Hashtags */}
            <Box>
              <Typography variant="h6">Categorias (Hashtags)</Typography>
              <Box className="flex items-center space-x-2">
                <TextField
                  label="Adicionar hashtag"
                  value={newHashtag}
                  onChange={(e) => setNewHashtag(e.target.value)}
                  fullWidth
                  variant="outlined"
                  InputProps={{
                    style: { backgroundColor: "#333333", color: "white" },
                  }}
                />
                <Button variant="contained" color="secondary" onClick={handleAddHashtag}>
                  <IoMdAdd />
                </Button>
              </Box>

              <Box className="flex flex-wrap mt-2 gap-2">
                {hashtags.map((hashtag, idx) => (
                  <Chip
                    key={idx}
                    label={`#${hashtag}`}
                    clickable
                    color="primary"
                    onDelete={() => handleRemoveHashtag(hashtag)}
                  />
                ))}
              </Box>
            </Box>

            <Box className="mt-4">
              <Button
                variant="contained"
                color="primary"
                onClick={handlePublishProject}
                sx={{ width: "100%" }}
              >
                Publicar Projeto
              </Button>
            </Box>
          </Box>
        </Grid>

        {/* Preview */}
        <Grid item xs={12} lg={5}>
          <Box className="min-h-[500px] bg-[#1e1e1e] p-6 rounded">
            <Typography variant="h4" color="primary" fontWeight={700} gutterBottom>
              Preview do Projeto
            </Typography>
            <Box>
              <Typography variant="h5" color="primary" fontWeight={600}>{title || "Título do Projeto"}</Typography>
              <Typography variant="body1" color="textSecondary" paragraph>{description || "Descrição do projeto."}</Typography>
              <Typography variant="body1" color="textSecondary">
                <strong>Orçamento:</strong> {budgetType === "negotiable" ? "A negociar" : "R$ " + budgetValue || "Não especificado"}
              </Typography>
              <Typography variant="body1" color="textSecondary">
                <strong>Prazo:</strong> {deadline || "Não especificado"}
              </Typography>
              <Box display="flex" flexWrap="wrap" mt={2}>
                {hashtags.map((hashtag, idx) => (
                  <Chip key={idx} label={`#${hashtag}`} color="primary" sx={{ marginRight: 1 }} />
                ))}
              </Box>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default CreateProjectPage;
