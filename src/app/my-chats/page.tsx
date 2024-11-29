'use client';

import { useState, useEffect } from "react";
import { Box, Typography, Card, CardContent, Avatar, List, ListItem, ListItemAvatar, ListItemText, Divider, IconButton } from "@mui/material";
import ChatIcon from "@mui/icons-material/Chat";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/UserContext";

type Participant = {
    id: string;
    username: string;
    profilePhoto: string;
};

type Message = {
    id: string;
    content: string;
    createdAt: string;
};

type Chat = {
    id: string;
    participants: Participant[];
    messages: Message[];
};

const MeusChats = () => {
    const { user } = useUser(); // Recupera o usuário logado do contexto
    const [chats, setChats] = useState<Chat[]>([]);
    const router = useRouter();

    // Função para buscar os chats (simulando o useEffect)
    useEffect(() => {
        const fetchChats = async () => {
            try {
                const response = await fetch("/api/chat");
                const data = await response.json();
                if (data.status === "success") { setChats(data.data); }
                else { console.error("Erro ao carregar chats", data.message); }
            }
            catch (error) {
                console.error("Erro ao carregar chats", error);
            }
        };
        if (user) { fetchChats(); }
    }
        , [user]);

    if (!user) {
        return (
            <Box sx={{ p: 4, textAlign: "center" }}>
                <Typography variant="h6" color="gray">
                    Você precisa estar logado para ver seus chats.
                </Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ p: 4 }}>
            <Typography variant="h4" gutterBottom sx={{ color: "#fff", fontWeight: "bold" }}>
                Meus Chats
            </Typography>

            {chats.length === 0 ? (
                <Typography variant="h6" color="gray">
                    Você ainda não tem chats.
                </Typography>
            ) : (
                <List>
                    {chats.map((chat) => {
                        const lastMessage = chat.messages[0];
                        const otherParticipants = chat.participants.filter((p) => p.id !== user.id);

                        return (
                            <Card key={chat.id} sx={{ mb: 3, backgroundColor: "#1f1f1f", borderRadius: 2 }}>
                                <CardContent>
                                    <ListItem
                                        sx={{ cursor: "pointer" }}
                                        onClick={() => router.push(`/chat/${chat.id}`)} // Navega para a página do chat
                                    >
                                        <ListItemAvatar>
                                            <Avatar
                                                src={otherParticipants[0]?.profilePhoto || ""}
                                                alt={otherParticipants[0]?.username || "Chat"}
                                            />
                                        </ListItemAvatar>
                                        <ListItemText
                                            primary={
                                                otherParticipants.length > 0
                                                    ? otherParticipants.map((p) => p.username).join(", ")
                                                    : "Chat em Grupo"
                                            }
                                            secondary={
                                                lastMessage
                                                    ? `${lastMessage.content.substring(0, 50)}...`
                                                    : "Sem mensagens ainda."
                                            }
                                            primaryTypographyProps={{
                                                sx: { color: "#fff", fontWeight: "bold" },
                                            }}
                                            secondaryTypographyProps={{
                                                sx: { color: "#bbb" },
                                            }}
                                        />
                                        <IconButton>
                                            <ChatIcon sx={{ color: "#fff" }} />
                                        </IconButton>
                                    </ListItem>
                                </CardContent>
                                <Divider sx={{ backgroundColor: "#444" }} />
                            </Card>
                        );
                    })}
                </List>
            )}
        </Box>
    );
};

export default MeusChats;
