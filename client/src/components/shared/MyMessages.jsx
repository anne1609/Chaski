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
                if (response.status === 404) {
                    throw new Error('No se encontraron mensajes');
                }else if (response.status === 500) {
                    throw new Error('Error interno del servidor');
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
        <Box sx={{ mt: 3 }}>
            <h1>Mis Mensajes</h1>
            {loading ? (
                <p>Cargando mensajes...</p>
            ) : error ? (
                <p>Error: {error}</p>
            ) : (
                <TableContainer component={Paper} sx={{ maxHeight: '64vh' }}>
                    <Table>
                        <TableHead
                            sx={{
                                backgroundColor: 'tertiary.main',
                                color: '#FFFFFF',
                                '& th': {
                                color: '#FFFFFF',
                                fontWeight: 'bold',
                                textAlign: 'center',
                                },
                         }}
                        >
                            <TableRow>
                                <TableCell>Remitente</TableCell>
                                <TableCell>Asunto</TableCell>                                
                                <TableCell>Mensaje</TableCell>
                                <TableCell>Fecha</TableCell>
                                <TableCell>Detalles</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody
                        sx={{
                            backgroundColor: 'primary.main',
                            '& td': {
                            color: '#ffffff',
                            fontSize: '16px',
                            fontWeight: 'normal',                   
                            border: '1px solid #ccc',                                   
                            },
                        }}
                        >
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
                                        <TableCell>{remitente}</TableCell>
                                        <TableCell>{comm.subject}</TableCell>
                                        <TableCell
                                            sx={{
                                                maxWidth: '250px',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                whiteSpace: 'nowrap',
                                            }}
                                        >{comm.body}</TableCell>
                                        <TableCell>{new Date(comm.created_at).toLocaleDateString()}</TableCell>                                        
                                        <TableCell
                                            sx={{
                                                display: 'flex',
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                            }}
                                        >                      
                                            <Button
                                                variant="contained"
                                                color="tertiary"
                                                component={Link}
                                                to={`/teacher/communication/${message.id}`}
                                                sx={{ mr: 1 }}                    
                                            >
                                                Detalles
                                            </Button>                 
                                        </TableCell>
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