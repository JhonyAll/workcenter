"use client";

import React, { useState } from "react";
import {
    Box,
    Stepper,
    Step,
    StepLabel,
    Button,
    TextField,
    Typography,
    Avatar,
    Chip
} from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/UserContext";
import ImageCropper from "../CropperImage";
import handleUpload from "@/utils/uploadForFirebase";

const steps = [
    "Informações Básicas",
    "Segurança",
    "Perfil Básico",
    "Tipo de Conta",
    "Informações Adicionais",
];

type errorsType = {
    name: string;
    email: string;
    username: string;
    password: string;
    confirmPassword: string;
}

type FormData = {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
    username: string;
    profilePhoto: string;
    accountType: string;
    profession: string;
    about: string;
    skills: string[];  // Tipando a lista de habilidades
};

export default function SignUpBox() {
    const [activeStep, setActiveStep] = useState(0);
    const [formData, setFormData] = useState<FormData>({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        username: "",
        profilePhoto: "",
        accountType: "client",
        profession: "",
        about: "",
        skills: []
    });
    const [currentSkill, setCurrentSkill] = useState("")
    const [errors, setErrors] = useState<errorsType>({
        name: '',
        email: '',
        username: '',
        password: '',
        confirmPassword: ''
    });
    const [croppedImage, setCroppedImage] = useState<string | null>(null);

    const router = useRouter();
    const { refreshUser } = useUser()

    const handleSubmit = async () => {
        const skillsArray = formData.skills.map(skill => ({ name: skill }));
        let urlImage
        if (croppedImage) urlImage = await handleUpload(croppedImage)

        const body = {
            username: formData.username,
            password: formData.password,
            type: formData.accountType.toUpperCase(),
            about: formData.about,
            name: formData.name,
            email: formData.email,
            profilePhoto: urlImage || "N/A",
            profession: formData.profession,
            skills: skillsArray
        };
        console.log(body)

        try {
            const response = await fetch('/api/auth/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(body),
            });

            const result = await response.json();

            if (response.ok) {
                router.push('/')
                await refreshUser()
            } else {
                alert(result.message);
            }
        } catch (error) {
            console.error('Erro ao criar usuário:', error);
            alert('Erro ao criar usuário. Tente novamente.');
        }
    }

    const handleNext = () => {
        if (validateStep()) {
            setActiveStep((prev) => prev + 1);
        }
        if (activeStep === steps.length - 1) {
            handleSubmit()
        }
    };

    const handleBack = () => setActiveStep((prev) => prev - 1);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        setErrors((prev) => ({ ...prev, [name]: "" })); // Limpa o erro ao editar
    };

    const validateStep = () => {
        let currentErrors: errorsType | null = {
            name: '',
            email: '',
            username: '',
            password: '',
            confirmPassword: ''
        };

        if ((typeof currentErrors === 'object')) {
            if (activeStep === 0) {
                if (!formData.name.trim()) currentErrors.name = "O nome é obrigatório.";
                if (!formData.email.trim())
                    currentErrors.email = "O e-mail é obrigatório.";
                else if (!/\S+@\S+\.\S+/.test(formData.email))
                    currentErrors.email = "Formato de e-mail inválido.";
            }

            if (activeStep === 1) {
                if (!formData.password.trim())
                    currentErrors.password = "A senha é obrigatória.";
                else if (formData.password.length < 6)
                    currentErrors.password = "A senha deve ter no mínimo 6 caracteres.";
                if (formData.password !== formData.confirmPassword)
                    currentErrors.confirmPassword = "As senhas não coincidem.";
            }

            if (activeStep === 2) {
                if (!formData.username.trim())
                    currentErrors.username = "O nome de usuário é obrigatório.";
                else if (!/^[a-zA-Z0-9_]+$/.test(formData.username))
                    currentErrors.username =
                        "O nome de usuário só pode conter letras, números e _.";
            }
            setErrors(currentErrors);
        }

        if (currentErrors.confirmPassword === '' && currentErrors.password === '' && currentErrors.name === '' && currentErrors.email === '' && currentErrors.username === '') { return true }
        return false
    };

    const handleAddSkill = () => {
        if (currentSkill.trim()) {
            setFormData((prev) => ({
                ...prev,
                skills: [...prev.skills, currentSkill.trim()],
            }));
            setCurrentSkill("");
        }
    };
    const handleDeleteSkill = (skillToDelete: string) => {
        setFormData((prev) => ({
            ...prev,
            skills: prev.skills.filter((skill) => skill !== skillToDelete),
        }));
    };

    const renderStepContent = () => {
        switch (activeStep) {
            case 0:
                return (
                    <Box>
                        <TextField
                            label="Nome Completo"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            error={!!errors.name}
                            helperText={errors.name}
                            fullWidth
                            margin="normal"
                        />
                        <TextField
                            label="E-mail"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            error={!!errors.email}
                            helperText={errors.email}
                            fullWidth
                            margin="normal"
                        />
                    </Box>
                );
            case 1:
                return (
                    <Box>
                        <TextField
                            label="Senha"
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            error={!!errors.password}
                            helperText={errors.password}
                            fullWidth
                            margin="normal"
                        />
                        <TextField
                            label="Confirmar Senha"
                            type="password"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            error={!!errors.confirmPassword}
                            helperText={errors.confirmPassword}
                            fullWidth
                            margin="normal"
                        />
                    </Box>
                );
            case 2:
                return (
                    <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                        <TextField
                            label="Nome de Usuário"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            error={!!errors.username}
                            helperText={errors.username}
                            fullWidth
                            margin="normal"
                        />
                        <Typography variant="body1" sx={{ mt: 2, mb: 1 }}>
                            Foto de Perfil
                        </Typography>
                        <ImageCropper onImageCropped={setCroppedImage} />
                    </Box>
                );
            case 3:
                return (
                    <Box sx={{ display: 'grid', placeItems: 'center' }}>
                        <Typography variant="h6" sx={{ mb: 2 }}>
                            Escolha o Tipo de Conta
                        </Typography>
                        <Box>
                            <Button
                                variant={formData.accountType === "worker" ? "contained" : "outlined"}
                                onClick={() =>
                                    setFormData((prev) => ({ ...prev, accountType: "worker" }))
                                }
                                sx={{ mr: 2 }}
                            >
                                Worker
                            </Button>
                            <Button
                                variant={formData.accountType === "client" ? "contained" : "outlined"}
                                onClick={() =>
                                    setFormData((prev) => ({ ...prev, accountType: "client" }))
                                }
                            >
                                Client
                            </Button>
                        </Box>
                    </Box>
                );
            case 4:
                console.log(formData)
                return (
                    <Box>
                        {!(formData.accountType === 'client') &&
                            <>
                                <TextField
                                    label="Profissão"
                                    name="profession"
                                    value={formData.profession}
                                    onChange={handleChange}
                                    fullWidth
                                    margin="normal"
                                />
                                <Typography variant="h6" sx={{ mt: 1 }}>
                                    Habilidades
                                </Typography>
                                <Box sx={{ display: "flex", gap: 0, alignItems: "center", mt: 0 }}>
                                    <TextField
                                        label="Adicionar Habilidade"
                                        value={currentSkill}
                                        onChange={(e) => setCurrentSkill(e.target.value)}
                                        fullWidth
                                    />
                                    <Button variant="contained" onClick={handleAddSkill}>
                                        Adicionar
                                    </Button>
                                </Box>
                                <Box sx={{ mt: 2, display: "flex", gap: 1, flexWrap: "wrap" }}>
                                    {formData.skills.map((skill, index) => (
                                        <Chip
                                            key={index}
                                            label={skill}
                                            onDelete={() => handleDeleteSkill(skill)}
                                            color="primary"
                                        />
                                    ))}
                                </Box></>}

                        <TextField
                            label="Sobre Mim"
                            name="about"
                            value={formData.about}
                            onChange={handleChange}
                            fullWidth
                            margin="normal"
                            multiline
                            rows={4}
                        />
                    </Box>
                );
            default:
                return null;
        }
    };

    return (
        <Box
            position="absolute"
            top="50%"
            left="50%"

            sx={{
                bgcolor: "background.default",
                color: "text.primary",
                p: 3,
                borderRadius: 2,
                width: "100%",
                maxWidth: { sm: 600, xs: '100%' },
                height: { xs: '100%', sm: 'auto' },
                display: { xs: 'flex', sm: 'block' },
                flexDirection: 'column',
                justifyContent: 'space-between',
                transform: "translate(-50%, -50%)"
            }}
        >
            <Typography variant="h4" align="center" gutterBottom>
                Cadastro
            </Typography>
            <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 3 }}>
                {steps.map((label) => (
                    <Step key={label}>
                        <StepLabel>{label}</StepLabel>
                    </Step>
                ))}
            </Stepper>
            {renderStepContent()}
            <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}>
                <Button onClick={handleBack} disabled={activeStep === 0}>
                    Voltar
                </Button>
                <Button
                    variant="contained"
                    onClick={handleNext}
                    disabled={activeStep === steps.length}
                >
                    {activeStep === steps.length - 1 ? "Finalizar" : "Próximo"}
                </Button>
            </Box>
            <Typography variant="subtitle2" mt={2}>Já possui uma conta? <Link href="/login">Entrar</Link></Typography>
        </Box>
    );
}
