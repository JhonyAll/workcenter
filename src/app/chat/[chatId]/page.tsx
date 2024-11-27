'use client'

import { useState, useEffect } from "react";
import { Box, Typography, TextField, Button, Avatar, List, ListItem, ListItemAvatar, ListItemText } from "@mui/material";
import { Realtime } from 'ably';

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

    useEffect(() => {
        const ably = new Realtime('AhHkng.vHEr2A:syObYTmOstswjhX2t3QPxVWXsx_kD3pcWgBsHH33MWY');
        setClient(ably);

        const channel = ably.channels.get('chat-channel');
        channel.subscribe('message', (msg: any) => {
            setChat((prev) => prev && {
                ...prev,
                messages: [...prev.messages, msg.data]
            });
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
                    .then(response => response.json())
                    .then((response) => setChat(response.data))
                    .catch((error) => console.error("Erro ao carregar o chat:", error));
            }
        }
        fetchChat();
    }, [params]);

    const handleSendMessage = async () => {
        const { chatId } = await params;
        if (newMessage.trim() && chatId) {
            const body = { content: newMessage };
            fetch(`/api/chat/${chatId}/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            })
                .then(response => response.json())
                .then((response) => {
                    const newMessage = response.data;
                    if (client) {
                        const channel = client.channels.get('chat-channel');
                        channel.publish('message', newMessage);
                    }
                    setNewMessage(""); 
                })
                .catch((error) => console.error("Erro ao enviar mensagem:", error));
        }
    };

    if (!chat) {
        return <Typography>Carregando...</Typography>;
    }

    return (
        <Box sx={{ display: "flex", flexDirection: "column", height: "100vh", padding: 2 }}>
            <Typography variant="h5" gutterBottom>
                Chat com {chat.participants.map((p) => p.username).join(", ")}
            </Typography>

            <Box sx={{ flexGrow: 1, overflowY: "auto", marginBottom: 2 }}>
                <List>
                    {chat.messages.map((msg) => (
                        <ListItem key={msg.id}>
                            <ListItemAvatar>
                                <Avatar src={msg.sender.profilePhoto} alt={msg.sender.username} />
                            </ListItemAvatar>
                            <ListItemText
                                primary={msg.sender.username}
                                secondary={msg.content}
                                sx={{ wordBreak: "break-word" }}
                            />
                            <Typography variant="caption" sx={{ marginLeft: "auto", color: "gray" }}>
                                {new Date(msg.createdAt).toLocaleTimeString()}
                            </Typography>
                        </ListItem>
                    ))}
                </List>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <TextField
                    fullWidth
                    variant="outlined"
                    placeholder="Digite sua mensagem..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                />
                <Button variant="contained" color="primary" onClick={handleSendMessage}>
                    Enviar
                </Button>
            </Box>
        </Box>
    );
};

export default ChatPage;
