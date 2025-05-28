import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Box, Button, Tab } from '@mui/material';

function CommunicationsStatus({ role }) {
  const [communications, setCommunications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCommunications = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/communication');
        if (!response.ok) {
          throw new Error('Error al cargar las comunicaciones');
        }
        const data = await response.json();
        setCommunications(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCommunications();
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    try {
      if (newStatus === 'Archivado') {
        const confirm = window.confirm('¿Estás seguro de que deseas archivar este mensaje?');
        if (!confirm) return;
      }

      const communicationToUpdate = communications.find((communication) => communication.id === id);
      if (!communicationToUpdate) {
        alert('Comunicación no encontrada.');
        return;
      }

      const updatedCommunication = {
        ...communicationToUpdate,
        status: newStatus,
      };

      const response = await fetch(`http://localhost:8080/api/communication/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedCommunication),
      });

      if (!response.ok) {
        throw new Error('Error al actualizar el estado de la comunicación.');
      }

      setCommunications((prevCommunications) =>
        prevCommunications.map((communication) =>
          communication.id === id ? { ...communication, status: newStatus } : communication
        )
      );

      alert(`El mensaje con ID ${id} ha sido marcado como "${newStatus}".`);
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  };
  if (loading) return <div>Cargando...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <Box sx={{ mt: 3 }}>
      {communications.length === 0 ? (
        <div>No hay comunicaciones disponibles.</div>
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
                <TableCell>Asunto</TableCell>
                <TableCell>prioridad</TableCell>
                <TableCell>Tipo de Mensaje</TableCell>
                <TableCell>Mensaje</TableCell>
                <TableCell>Estado</TableCell>
                <TableCell>Acciones</TableCell>
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
              {communications
              .filter((communication) => communication.status === 'Guardado' || communication.status === 'Enviado')
              .map((communication) => (
                <TableRow key={communication.id}>
                  <TableCell>{communication.subject}</TableCell>
                  <TableCell>{communication.priority}</TableCell>
                  <TableCell>{communication.category.name}</TableCell>
                  <TableCell
                    sx={{
                      maxWidth: '250px',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >{communication.body}</TableCell>
                  <TableCell>{communication.status}</TableCell>
                  <TableCell
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >                      
                    {communication.status !== 'Enviado' && communication.status !== 'Archivado' && (  
                     <Button
                        variant="contained"
                        color="secondary"
                        component={Link}
                        to={`/secretary/edit/${communication.id}`}
                        sx={{ mr: 1 }}                    
                      >
                        Seguir Editando
                      </Button>
                    )}   
                    {communication.status !== 'Guardado' && communication.status !== 'Archivado' && (  
                     <Button
                        variant="contained"
                        color="secondary"
                        component={Link}
                        onClick={() => handleStatusChange(communication.id, 'Enviado')}
                        sx={{ mr: 1 }}                    
                      >
                        Reenviar
                      </Button>
                    )}   
                    <Button
                      variant="contained"
                      color="tertiary"
                      component={Link}
                      to={`/secretary/communication/${communication.id}`}
                      sx={{ mr: 1 }}                    
                    >
                      Detalles
                    </Button>                 
                    <Button
                      variant="contained"
                      color="negative"
                      onClick={() => handleStatusChange(communication.id, 'Archivado')}
                      sx={{ mr: 1 }}
                    >
                      Archivar
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
}

export default CommunicationsStatus;