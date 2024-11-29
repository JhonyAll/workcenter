"use client";
import { useUser } from "@/context/UserContext";
import { useEffect, useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Container,
  Divider,
  Grid,
  Modal,
  Skeleton,
  TextField,
  Typography,
} from "@mui/material";
import { AiOutlinePhone, AiOutlineInstagram, AiOutlineTwitter } from "react-icons/ai";
import { IoMdSettings } from "react-icons/io";
import Link from "next/link";
// Interfaces
// Ajuste na interface
interface WorkerProfile {
  id: string;
  userId: string;
  profession: string;
  skills: { id: string; name: string; category: string | null }[];
  contactInfo: string | null;
  portfolio: { 
    id: string; 
    title: string; 
    description: string | null; // Permitir null no description
    image: string | null; 
    link: string | null 
  }[];
}


const WorkerProfilePage = () => {
  const { user, isLoading } = useUser();
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isAddingPortfolio, setIsAddingPortfolio] = useState(false);
  const [formData, setFormData] = useState<{
    about: string;
    instagram: string;
    twitter: string;
    phone: string;
    profession?: string;
    skills?: string[];
    rating?: number | null;
  }>({ about: "", instagram: "", twitter: "", phone: "" });

  const [originalData, setOriginalData] = useState<typeof formData>(formData);
  const [portfolio, setPortfolio] = useState<WorkerProfile["portfolio"]>([]);
  const [newPortfolioItem, setNewPortfolioItem] = useState<{
    title: string;
    description: string;
    image: string | null;
    link: string | null;
  }>({ title: "", description: "", image: null, link: null });

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (user) {
      const initialData = {
        about: user.about || "",
        instagram: user.instagram || "",
        twitter: user.twitter || "",
        phone: user.phone || "",
        profession: user.WorkerProfile?.profession || "",
        skills: user.WorkerProfile?.skills.map((skill) => skill.name) || [],
        completedTasks: user.WorkerProfile?.completedTasks || 0,
        rating: user.WorkerProfile?.rating || null,
      };
      setFormData(initialData);
      setOriginalData(initialData);
      setPortfolio(user.WorkerProfile?.portfolio || []);
    }
  }, [user]);

  const handleEditToggle = () => {
    if (isEditing) setFormData(originalData); // Reverte mudanças
    setIsEditing(!isEditing);
  };

  const handleInputChange = (field: keyof typeof formData, value: string | number | null | string[]) => {
    setFormData({ ...formData, [field]: value });
  };

  const reloadPage = () => {
    window.location.reload()
  };

  const handleSaveChanges = async () => {
    const body = {
      ...formData,
      portfolio: portfolio
    }

    try {
      const response = await fetch("/api/auth/edit", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await response.json();
      if (response.ok) {
        reloadPage()
        setOriginalData(formData);
        setIsEditing(false);
        console.log("Perfil atualizado com sucesso:", data);
      } else {
        console.error("Erro ao atualizar o perfil:", data.message);
      }
    } catch (error) {
      console.error("Erro ao salvar alterações:", error);
    }
  };

  const handlePortfolioInputChange = (field: keyof typeof newPortfolioItem, value: string) => {
    setNewPortfolioItem({ ...newPortfolioItem, [field]: value });
  };

  const handleAddPortfolio = () => {
    setPortfolio((prev) => [
      ...prev,
      { ...newPortfolioItem, id: String(Date.now()) },
    ]);
    setNewPortfolioItem({ title: "", description: "", image: null, link: null });
    setIsAddingPortfolio(false);
  };

  if (isLoading || loading) {
    return (
      <Container maxWidth="sm">
        <Box display="flex" flexDirection="column" alignItems="center" gap={2} mt={5}>
          <Skeleton variant="circular" width={120} height={120} />
          <Skeleton variant="text" width="80%" height={30} />
          <Skeleton variant="text" width="60%" height={20} />
          <Divider sx={{ width: "100%", my: 2 }} />
          <Skeleton variant="rectangular" width="100%" height={150} />
          <Skeleton variant="rectangular" width="100%" height={250} sx={{ mt: 2 }} />
        </Box>
      </Container>
    );
  }

  if (!user) {
    return (
      <Container maxWidth="sm" sx={{ mt: 5 }}>
        <Typography variant="h5" textAlign="center">
          Usuário não encontrado.
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ mt: 5 }}>
      {/* Header do perfil */}
      <Box display="flex" flexDirection="column" alignItems="center" mb={3}>
        <Avatar src={user.profilePhoto || "https://via.placeholder.com/120"} sx={{ width: 120, height: 120, mb: 2 }} />
        <Typography variant="h5" fontWeight="bold">
          {user.name}
        </Typography>
        <Typography variant="subtitle1" color="textSecondary">
          @{user.username}
        </Typography>
        <Typography variant="subtitle2" color="textSecondary">
          Tipo: {user.type === "WORKER" ? "Trabalhador" : "Cliente"}
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={handleEditToggle}
          startIcon={<IoMdSettings />}
          sx={{ textTransform: "none", fontWeight: "bold", fontSize: "1rem", mt: 2 }}
        >
          {isEditing ? "Cancelar" : "Editar Perfil"}
        </Button>
      </Box>

      {/* Campos dinâmicos para WORKER */}
      {user.type === "WORKER" && (
        <>
          {/* Profissão */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Profissão
              </Typography>
              {isEditing ? (
                <TextField
                  fullWidth
                  label="Profissão"
                  value={formData.profession}
                  onChange={(e) => handleInputChange("profession", e.target.value)}
                />
              ) : (
                <Typography color="textSecondary">{formData.profession || "Não informado"}</Typography>
              )}
            </CardContent>
          </Card>

          {/* Sobre Mim */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Sobre mim
              </Typography>
              {isEditing ? (
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  value={formData.about}
                  onChange={(e) => handleInputChange("about", e.target.value)}
                />
              ) : (
                <Typography color="textSecondary">
                  {formData.about || "Este usuário ainda não acrescentou uma descrição sobre ele."}
                </Typography>
              )}
            </CardContent>
          </Card>
          {/* Contatos */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Contatos
              </Typography>
              {isEditing ? (
                <>
                  <TextField
                    fullWidth
                    label="Telefone"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    sx={{ mb: 2 }}
                  />
                  <TextField
                    fullWidth
                    label="Instagram"
                    value={formData.instagram}
                    onChange={(e) => handleInputChange("instagram", e.target.value)}
                    sx={{ mb: 2 }}
                  />
                  <TextField
                    fullWidth
                    label="Twitter"
                    value={formData.twitter}
                    onChange={(e) => handleInputChange("twitter", e.target.value)}
                    sx={{ mb: 2 }}
                  />
                </>
              ) : (
                <Box>
                  <Typography color="textSecondary" mb={1}>
                    <AiOutlinePhone /> {formData.phone || "Não informado"}
                  </Typography>
                  <Typography color="textSecondary" mb={1}>
                    <AiOutlineInstagram /> {formData.instagram || "Não informado"}
                  </Typography>
                  <Typography color="textSecondary">
                    <AiOutlineTwitter /> {formData.twitter || "Não informado"}
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>

          {/* Skills */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Habilidades
              </Typography>
              {isEditing ? (
                <TextField
                  fullWidth
                  label="Habilidades (separadas por vírgula)"
                  value={formData.skills?.join(", ") || ""}
                  onChange={(e) => handleInputChange("skills", e.target.value.split(",").map((skill) => skill.trim()))}
                />
              ) : (
                <Box display="flex" flexWrap="wrap" gap={1}>
                  {formData.skills?.map((skill) => (
                    <Chip key={skill} label={skill} color="primary" />
                  )) || <Typography color="textSecondary">Nenhuma habilidade informada</Typography>}
                </Box>
              )}
            </CardContent>
          </Card>

          {/* Portfolio */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Portfolio
              </Typography>
              {portfolio.length > 0 ? (
                portfolio.map((item) => (
                  <Box key={item.id} mb={2} sx={{ wdith: '100%'}}>
                    <a href={("https://" + item.link) || ''}>
                    <Typography variant="subtitle1" fontWeight="bold">
                      {item.title}
                    </Typography>
                    <Typography variant="body2">{item.description}</Typography>
                    </a>
                  </Box>
                ))
              ) : (<>
                <Typography color="textSecondary">Nenhum item no portfólio.</Typography>
                <Button variant="outlined" color="primary" onClick={() => setIsAddingPortfolio(true)} sx={{ mt: 2 }}>
                  Adicionar Portfolio
                </Button>
              </>
              )}
            </CardContent>
          </Card>

          {/* Modal para adicionar portfolio */}
          <Modal open={isAddingPortfolio} onClose={() => setIsAddingPortfolio(false)}>
            <Box
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                bgcolor: "background.paper",
                boxShadow: 24,
                p: 4,
                borderRadius: 1,
                width: 400,
              }}
            >
              <Typography variant="h6" gutterBottom>
                Adicionar Portfolio
              </Typography>
              <TextField
                fullWidth
                label="Título"
                value={newPortfolioItem.title}
                onChange={(e) => handlePortfolioInputChange("title", e.target.value)}
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Descrição"
                multiline
                rows={3}
                value={newPortfolioItem.description}
                onChange={(e) => handlePortfolioInputChange("description", e.target.value)}
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Link"
                value={newPortfolioItem.link || ""}
                onChange={(e) => handlePortfolioInputChange("link", e.target.value)}
                sx={{ mb: 2 }}
              />
              <Button variant="contained" color="primary" onClick={handleAddPortfolio} fullWidth>
                Adicionar
              </Button>
            </Box>
          </Modal>
        </>
      )}

      {/* Botão para salvar alterações */}
      {isEditing && (
        <Box textAlign="center">
          <Button
            variant="contained"
            color="primary"
            onClick={handleSaveChanges}
            sx={{ textTransform: "none", fontWeight: "bold" }}
          >
            Salvar Alterações
          </Button>
        </Box>
      )}
    </Container>
  );
};

export default WorkerProfilePage;
