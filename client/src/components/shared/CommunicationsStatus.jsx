import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Box, Button } from '@mui/material';

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
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Remitente</TableCell>
                <TableCell>prioridad</TableCell>
                <TableCell>Categoria</TableCell>
                <TableCell>Mensaje</TableCell>
                <TableCell>Estado</TableCell>
                <TableCell>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {communications.map((communication) => (
                <TableRow key={communication.id}>
                  <TableCell>{communication.subject}</TableCell>
                  <TableCell>{communication.priority}</TableCell>
                  <TableCell>{communication.category.name}</TableCell>
                  <TableCell>{communication.body}</TableCell>
                  <TableCell>{communication.status}</TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleStatusChange(communication.id, 'Enviado')}
                      sx={{ mr: 1 }}
                    >
                      Enviar
                    </Button>
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={() => handleStatusChange(communication.id, 'Archivado')}
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