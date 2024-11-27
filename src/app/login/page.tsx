import React from "react";
import { Box, Typography } from "@mui/material";
import Image from "next/image";
import logo from "@/assets/img/logo.svg";
import SignInBox from "@/components/SignInBox";
import fundo from "./fundo.jpeg"

const LoginPage = () => {
  return (
    <Box
      display="grid"
      gridTemplateColumns={{ xs: "1fr", md: "4fr 5fr" }}
      height="100vh"
      bgcolor="#f5f5f5"
    >
      {/* Lado esquerdo com boas-vindas */}
      <Box
        display={{ xs: "none", md: "flex" }}
        flexDirection="column"
        justifyContent="center"
        bgcolor="#f5f5f5"
        alignItems="center"
        px={4}
        color="#fff"
        sx={{
          backgroundImage: `url("https://firebasestorage.googleapis.com/v0/b/workcenter-af37b.appspot.com/o/fundo.jpeg?alt=media&token=c7786c8c-07cb-4b67-908f-fef65bc26aaf")`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <Image src={logo} alt="Workcenter logo" width={350} height={350} />
        <Typography variant="h4" fontWeight="bold" textAlign="center" mt={2} mb={4}>
          Bem-vindo!
        </Typography>
        <Typography variant="body1" textAlign="justify" mt={2} maxWidth="80%">
          Conecte-se à sua conta e continue construindo sua carreira como freelancer ou encontrando profissionais para seu projeto.
        </Typography>
      </Box>

      {/* Formulário de login */}
      <SignInBox />
    </Box>
  );
};

export default LoginPage;
