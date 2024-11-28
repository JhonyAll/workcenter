'use client'

import { useState, useEffect, useRef } from "react";
import { Box, Typography, TextField, Button, Avatar, List, ListItem, Paper, Skeleton } from "@mui/material";
import { Realtime } from "ably";
import { useUser } from "@/context/UserContext";

type User = {
    id: string;
    username: string;
    profilePhoto: string;
    name?: string;
};

type Message = {
    id: string;
    content: string;
    sender: User;
    createdAt: string;
};

type Chat = {
    id: string;
    participants: User[];
    messages: Message[];
};

const ChatPage = ({ params }: { params: Promise<{ chatId: string }> }) => {
    const [chat, setChat] = useState<Chat | null>(null);
    const [newMessage, setNewMessage] = useState<string>("");
    const [client, setClient] = useState<any>(null);
    const { user } = useUser();
    const messagesEndRef = useRef<HTMLDivElement | null>(null);


    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        const ably = new Realtime("AhHkng.vHEr2A:syObYTmOstswjhX2t3QPxVWXsx_kD3pcWgBsHH33MWY");
        setClient(ably);

        const channel = ably.channels.get("chat-channel");
        channel.subscribe("message", (msg: any) => {
            setChat((prev) =>
                prev
                    ? {
                        ...prev,
                        messages: [...prev.messages, msg.data],
                    }
                    : null
            );
        });

        return () => {
            ably.close();
        };
    }, []);

    useEffect(() => {
        const fetchChat = async () => {
            const { chatId } = await params;
            if (chatId) {
                fetch(`/api/chat/${chatId}`)
                    .then((response) => response.json())
                    .then((response) => setChat(response.data))
                    .catch((error) => console.error("Erro ao carregar o chat:", error));
            }
        };
        fetchChat();
    }, [params]);

    useEffect(() => {
        if (chat) {
            scrollToBottom();
        }
    }, [chat]);

    const handleSendMessage = async () => {
        const { chatId } = await params;
        if (newMessage.trim() && chatId) {
            const body = { content: newMessage };
            fetch(`/api/chat/${chatId}/`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            })
                .then((response) => response.json())
                .then((response) => {
                    const newMessage = response.data;
                    if (client) {
                        const channel = client.channels.get("chat-channel");
                        channel.publish("message", newMessage);
                    }
                    setNewMessage("");
                })
                .catch((error) => console.error("Erro ao enviar mensagem:", error));
        }
    };

    if (!chat) {
        return (
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    height: "100%",
                    padding: 2,
                    backgroundColor: "#121212",
                    color: "#FFFFFF",
                }}
            >
                <Typography variant="h6" gutterBottom sx={{ textAlign: "center", color: "#BB86FC" }}>
                    Carregando chat...
                </Typography>

                <Box
                    sx={{
                        flexGrow: 1,
                        overflowY: "auto",
                        marginBottom: 2,
                        padding: 2,
                        backgroundColor: "#1E1E1E",
                        borderRadius: 2,
                    }}
                >
                    {Array.from({ length: 5 }).map((_, index) => (
                        <Box key={index} sx={{ display: "flex", marginBottom: 2 }}>
                            <Skeleton variant="circular" width={40} height={40} sx={{ marginRight: 2 }} />
                            <Skeleton variant="rectangular" height={40} width="80%" sx={{ borderRadius: 2 }} />
                        </Box>
                    ))}
                </Box>

                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Skeleton variant="rectangular" height={56} width="80%" sx={{ borderRadius: 2 }} />
                    <Skeleton variant="rectangular" height={56} width={80} sx={{ borderRadius: 2 }} />
                </Box>
            </Box>
        );
    }

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                height: "auto",
                padding: 2,
                color: "#FFFFFF",
            }}
        >

            <Box
                sx={{
                    flexGrow: 1,
                    overflowY: "auto",
                    marginBottom: 2,
                    padding: 2,
                    backgroundColor: "#1E1E1E",
                    borderRadius: 2,
                }}
            >
                <Typography variant="h6" gutterBottom sx={{ textAlign: "center", color: "#BB86FC" }}>
                    Chat com {chat.participants.map((p) => p.username).join(", ")}
                </Typography>
                <List sx={{ padding: 0 }}>
                    {chat.messages.map((msg) => (
                        <ListItem
                            key={msg.id}
                            sx={{
                                display: "flex",
                                justifyContent: msg.sender.id === user?.id ? "flex-end" : "flex-start",
                                marginBottom: 1,
                            }}
                        >
                            {msg.sender.id !== user?.id && (
                                <Avatar
                                    src={msg.sender.profilePhoto}
                                    alt={msg.sender.username}
                                    sx={{ width: 50, height: 50, marginRight: 1 }}
                                />
                            )}
                            <Paper
                                sx={{
                                    padding: 1,
                                    backgroundColor: msg.sender.id === user?.id ? "#BB86FC" : "#333333",
                                    color: msg.sender.id === user?.id ? "#000000" : "#FFFFFF",
                                    borderRadius: "8px",
                                    maxWidth: "70%",
                                }}
                            >
                                <Typography variant="subtitle1">{msg.content}</Typography>
                                <Typography variant="caption" sx={{ display: "block", textAlign: "right", marginTop: 0.5 }}>
                                    {new Date(msg.createdAt).toLocaleTimeString()}
                                </Typography>
                            </Paper>
                        </ListItem>
                    ))}
                    <div ref={messagesEndRef} />
                </List>
            </Box>

            <Box position="fixed" bottom="20px" sx={{ display: "flex", alignItems: "center", gap: 2, width: '70%' }}>
                <TextField
                    fullWidth
                    variant="outlined"
                    placeholder="Digite sua mensagem..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    sx={{
                        backgroundColor: "#1E1E1E",
                        borderRadius: 1,
                        input: { color: "#FFFFFF" },
                    }}
                />
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSendMessage}
                    sx={{ backgroundColor: "#BB86FC", "&:hover": { backgroundColor: "#985EFF" } }}
                >
                    Enviar
                </Button>
            </Box>
        </Box>
    );
};

export default ChatPage;
