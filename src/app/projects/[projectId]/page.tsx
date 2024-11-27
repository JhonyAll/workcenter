'use client';

import { useEffect, useState } from "react";
import type { Prisma } from "@prisma/client";
import { Box, Typography, Avatar, Button, Modal, TextField, Skeleton } from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import { FaUserCircle } from "react-icons/fa";

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

const ProjectPage = ({ params }: { params: Promise<{ projectId: string }> }) => {
  const [project, setProject] = useState<ProjectWithRelations | null>(null);
  const [openModal, setOpenModal] = useState(false);
  const [coverLetter, setCoverLetter] = useState("");
  const [proposedFee, setProposedFee] = useState<number | string>("");

  useEffect(() => {
    const fetchProject = async () => {
      const { projectId } = await params;
      const response = await fetch(`/api/project/${projectId}`);
      const responseJson = await response.json();
      setProject(responseJson.data.project);
    };
    fetchProject();
  }, [params]);

  const handleApply = () => {
    // Simulação de envio de aplicação
    console.log("Aplicando com proposta:", proposedFee, "e carta:", coverLetter);
    setOpenModal(false); // Fecha o modal após envio
  };

  return (
    <Box sx={{ padding: 4, margin: '0 auto', maxWidth: 800 }}>
      {project ? (
        <Box sx={{ px: 4, borderRadius: 2, display: 'flex', flexDirection: 'column', gap: 4 }}>
          <Box>
            <Link href={`/user/${project.author.username}`} className="flex gap-4 items-center">
              {!(project.author.profilePhoto === 'N/A') ? (
                <Image
                  src={project.author.profilePhoto}
                  className="rounded-full border-2 border-purple-500"
                  alt="Profile"
                  width={50}
                  height={50}
                />
              ) : (
                <FaUserCircle size={50} color="#A3A3A3" />
              )}
              <Typography variant="h6" fontWeight="bold">{project.author.username}</Typography>
            </Link>
            <Typography variant="caption" color="text.secondary" mt={1}>
              Data de publicação: {new Date(project.createdAt).toLocaleDateString()}
            </Typography>
          </Box>
          <Typography variant="h4" color="primary" fontWeight="bold" textAlign="center">
            {project.title}
          </Typography>
          <Typography variant="body1" mt={3} sx={{ textAlign: 'justify' }}>
            {project.description}
          </Typography>

          <Box mt={4} display="flex" flexDirection="column">
            <Box display="flex" flexWrap="wrap" gap={2}>
              {project.hashtags.map((hashtag, indx) => (
                <Link key={indx} href={`/categories/${hashtag.id}`} passHref>
                  <Button variant="contained" color="secondary" sx={{ textTransform: 'none' }}>
                    #{hashtag.name}
                  </Button>
                </Link>
              ))}
            </Box>
            <Box mt={2}>
              <Typography variant="body1">Orçamento: {project.budget === 'A negociar' ? project.budget : 'R$ ' + project.budget}</Typography>
            </Box>
          </Box>

          {/* Botão Candidatar-se menor */}
          <Button 
            variant="contained" 
            color="primary" 
            onClick={() => setOpenModal(true)} 
            sx={{ mt: 2, padding: "6px 12px", fontSize: "0.875rem" }}
          >
            Candidatar-se
          </Button>

          {/* Modal de Candidatura */}
          <Modal
            open={openModal}
            onClose={() => setOpenModal(false)}
            aria-labelledby="apply-modal-title"
            aria-describedby="apply-modal-description"
          >
            <Box sx={{ 
              width: 400, 
              p: 3, 
              backgroundColor: 'background.paper', // Usando a cor de fundo do tema
              borderRadius: 2, 
              margin: 'auto', 
              mt: 10,
              color: 'text.primary', // Texto do modal
            }}>
              <Typography id="apply-modal-title" variant="h6" component="h2" color="primary" fontWeight="bold">
                Enviar Proposta
              </Typography>
              <TextField
                id="cover-letter"
                label="Carta de Apresentação"
                multiline
                rows={4}
                fullWidth
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
                sx={{ mt: 2 }}
              />
              <TextField
                id="proposed-fee"
                label="Valor Proposto"
                type="number"
                fullWidth
                value={proposedFee}
                onChange={(e) => setProposedFee(e.target.value)}
                sx={{ mt: 2 }}
              />
              <Box mt={3}>
                <Button variant="contained" color="primary" fullWidth onClick={handleApply}>
                  Enviar Proposta
                </Button>
              </Box>
            </Box>
          </Modal>
        </Box>
      ) : (
        <Box sx={{ p: 4, pt: 10, borderRadius: 2, display: 'flex', flexDirection: 'column', gap: 4, animate: 'pulse' }}>
          <Skeleton variant="text" width="50%" height={40} sx={{ margin: 'auto' }} />
          <Skeleton variant="text" width="80%" height={20} sx={{ margin: '20px 0' }} />
          <Skeleton variant="rectangular" width="100%" height={250} sx={{ marginBottom: 2 }} />
          <Skeleton variant="text" width="30%" height={20} />
          <Skeleton variant="rectangular" width="100%" height={50} sx={{ marginTop: 2 }} />
        </Box>
      )}
    </Box>
  );
};

export default ProjectPage;
