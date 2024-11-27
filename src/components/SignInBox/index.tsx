'use client';

import { useState } from "react";
import { TextField, Box, Typography, IconButton, Button, Link } from "@mui/material";
import { PiEye, PiEyeSlash } from "react-icons/pi";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/UserContext";

export default function SignInBox() {
  const [reveledPassword, setReveledPassword] = useState(false);
  const [emailValue, setEmailValue] = useState("");
  const [passwordValue, setPasswordValue] = useState("");

  const router = useRouter();
  const { refreshUser } = useUser();

  const handleLogin = async (usernameOrEmail: string, password: string) => {
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ usernameOrEmail, password }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log(data);
      } else {
        return console.error("Erro ao fazer login", data.message);
      }
    } catch (error) {
      return console.error("Erro ao fazer login", error);
    }

    router.push("/");
    await refreshUser();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleLogin(emailValue, passwordValue);
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        gap: 4,
        p: 4,
        borderLeft: "1px solid #424242",
        backgroundColor: "#1c1c1c",
        color: "#fff",
        height: "100%",
      }}
    >
      <Typography variant="h4" fontWeight="bold" textAlign="center">
        Entrar
      </Typography>

      <Box display="flex" flexDirection="column" gap={2} width="100%">
        {/* Campo de Email */}
        <TextField
          fullWidth
          label="Email ou Username"
          variant="outlined"
          value={emailValue}
          onChange={(e) => setEmailValue(e.target.value)}
          InputLabelProps={{ style: { color: "#9e9e9e" } }}
          sx={{
            "& .MuiOutlinedInput-root": {
              color: "#fff",
              borderColor: "#424242",
            },
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: "#424242",
            },
            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: "#6200ea",
            },
          }}
        />

        {/* Campo de Senha */}
        <Box position="relative">
          <TextField
            fullWidth
            type={reveledPassword ? "text" : "password"}
            label="Senha"
            variant="outlined"
            value={passwordValue}
            onChange={(e) => setPasswordValue(e.target.value)}
            InputLabelProps={{ style: { color: "#9e9e9e" } }}
            sx={{
              "& .MuiOutlinedInput-root": {
                color: "#fff",
                borderColor: "#424242",
              },
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: "#424242",
              },
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: "#6200ea",
              },
            }}
          />
          <IconButton
            onClick={() => setReveledPassword(!reveledPassword)}
            sx={{
              position: "absolute",
              top: "50%",
              right: 8,
              transform: "translateY(-50%)",
              color: "#9e9e9e",
            }}
          >
            {reveledPassword ? <PiEyeSlash /> : <PiEye />}
          </IconButton>
        </Box>

        <Typography
          variant="body2"
          color="primary"
          textAlign="right"
          sx={{ cursor: "pointer", "&:hover": { color: "#9e9e9e" } }}
        >
          Esqueci minha senha
        </Typography>
      </Box>

      {/* Botão de Login */}
      <Button
        type="submit"
        variant="contained"
        color="primary"
        fullWidth
        sx={{
          py: 1.5,
          backgroundColor: "#6200ea",
          "&:hover": {
            backgroundColor: "#45009d",
          },
        }}
      >
        Entrar
      </Button>

      <Typography variant="body2" color="#9e9e9e">
        Não possui uma conta?{" "}
        <Link href="/signup" color="primary" underline="hover">
          Cadastrar-se
        </Link>
      </Typography>
    </Box>
  );
}
