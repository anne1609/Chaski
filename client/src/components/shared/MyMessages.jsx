import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Box, Button } from '@mui/material';
import  { useAuth } from '../../hooks/useAuth';

function MyMessages({ role }) {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { user } = useAuth();
    useEffect(() => {
        if (!user) return;
        const fetchMessages = async () => {
            try {
                const response = await fetch(`http://localhost:8080/api/teachers-communications/${user.id}`);
                if (!response.ok) {
                    throw new Error('Error al cargar los mensajes');
                }
                const data = await response.json();
                setMessages(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchMessages();
    }, [user]);
    return (
        <Box sx={{ mt: 5, textAlign: 'center' }}>
            <h1>Mis Mensajes</h1>
            {loading ? (
                <p>Cargando mensajes...</p>
            ) : error ? (
                <p>Error: {error}</p>
            ) : (
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Asunto</TableCell>
                                <TableCell>Remitente</TableCell>
                                <TableCell>Fecha</TableCell>
                                <TableCell>Estado</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {messages.map((message) => {
                                const comm = message.communications;
                                let remitente = '';
                                if(comm.teachers){
                                    remitente = `${comm.teachers.names} ${comm.teachers.last_names}`;
                                } else if(comm.secretaries) {
                                    remitente = `${comm.secretaries.names} ${comm.secretaries.last_names}`;
                                }
                                return(
                                    <TableRow key={message.id}>
                                        <TableCell>{comm.subject}</TableCell>
                                        <TableCell>{remitente}</TableCell>
                                        <TableCell>{new Date(comm.created_at).toLocaleDateString()}</TableCell>
                                        <TableCell>{comm.status}</TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
        </Box>
    );
}

export default MyMessages;