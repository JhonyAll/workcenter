"use client";

import { useUser } from "@/context/UserContext";
import { useEffect, useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Container,
  Divider,
  Grid,
  Modal,
  Skeleton,
  TextField,
  Typography,
} from "@mui/material";
import {
  AiOutlinePhone,
  AiOutlineInstagram,
  AiOutlineTwitter,
} from "react-icons/ai";
import { IoMdSettings } from "react-icons/io";

const WorkerProfilePage = () => {
  const { user, isLoading } = useUser();
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [openPortfolioModal, setOpenPortfolioModal] = useState(false);
  const [formData, setFormData] = useState({
    about: "",
    instagram: "",
    twitter: "",
    phone: "",
  });
  const [portfolio, setPortfolio] = useState([]);
  const [originalData, setOriginalData] = useState({});

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
      };
      setFormData(initialData);
      setOriginalData(initialData); // Armazena os dados originais para reverter, se necessário
      setPortfolio(user.WorkerProfile?.portfolio || []);
    }
  }, [user]);

  const handleEditToggle = () => {
    if (isEditing) {
      // Reverte as mudanças
      setFormData(originalData);
    }
    setIsEditing(!isEditing);
  };

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSaveChanges = () => {
    const changesArray = [
      { field: "about", value: formData.about },
      { field: "instagram", value: formData.instagram },
      { field: "twitter", value: formData.twitter },
      { field: "phone", value: formData.phone },
    ];
    console.log("Alterações salvas:", changesArray);
    setOriginalData(formData); // Atualiza os dados originais com os dados salvos
    setIsEditing(false);
  };

  const handleAddPortfolioItem = (newItem) => {
    setPortfolio([...portfolio, newItem]);
    setOpenPortfolioModal(false);
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
        <Avatar
          src={user.profilePhoto || "https://via.placeholder.com/120"}
          sx={{ width: 120, height: 120, mb: 2 }}
        />
        <Typography variant="h5" fontWeight="bold">
          {user.name}
        </Typography>
        <Typography variant="subtitle1" color="textSecondary">
          @{user.username}
        </Typography>
        {user.WorkerProfile && (
          <Typography variant="subtitle1" color="textSecondary">
            {user.WorkerProfile.profession}
          </Typography>
        )}
        <Button
          variant="contained"
          color="primary"
          onClick={handleEditToggle}
          startIcon={<IoMdSettings />}
          sx={{
            textTransform: "none",
            fontWeight: "bold",
            fontSize: "1rem",
            mt: 2,
          }}
        >
          {isEditing ? "Cancelar" : "Editar Perfil"}
        </Button>
      </Box>

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
              />
            </>
          ) : (
            <>
              <Box display="flex" alignItems="center" gap={1} mb={1}>
                <AiOutlinePhone />
                <Typography color="textSecondary">{user.phone || "Não disponível"}</Typography>
              </Box>
              <Box display="flex" alignItems="center" gap={1} mb={1}>
                <AiOutlineInstagram />
                <Typography color="textSecondary">
                  {user.instagram || "Não disponível"}
                </Typography>
              </Box>
              <Box display="flex" alignItems="center">
                <AiOutlineTwitter />
                <Typography color="textSecondary">
                  {user.twitter || "Não disponível"}
                </Typography>
              </Box>
            </>
          )}
        </CardContent>
      </Card>

      {isEditing && (
        <Button variant="contained" color="primary" onClick={handleSaveChanges} fullWidth>
          Salvar Alterações
        </Button>
      )}
    </Container>
  );
};

export default WorkerProfilePage;
