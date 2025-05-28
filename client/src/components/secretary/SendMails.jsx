import React, { useState } from 'react';
import { Box, Button, Typography } from '@mui/material';
import TeachersMails from './TeachersMails';
import StudentMails from './StudentMails';
import GradeMails from './GradeMails';
import SubjectMails from './SubjectMails';

function SendMails() {
  const [selectedOption, setSelectedOption] = useState('profesores'); // Default option

  const handleOptionChange = (option) => {
    setSelectedOption(option);
  };

  const getButtonStyle = (option) => ({
    backgroundColor: selectedOption === option ? '#2C965A' : '#1A6487',
    color: 'white',
    mr: 1, // Add some margin between buttons
    '&:hover': {
      backgroundColor: '#2C965A',
    },
  });

  const renderSelectedComponent = () => {
    switch (selectedOption) {
      case 'profesores':
        return <TeachersMails />;
      case 'estudiantes':
        return <StudentMails />;
      case 'cursos':
        return <GradeMails />;
      default:
        return <Typography>Seleccione una opción</Typography>;
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
        <Button
          variant="contained"
          onClick={() => handleOptionChange('estudiantes')}
          sx={getButtonStyle('estudiantes')}
        >
          Estudiantes
        </Button>
        <Button
          variant="contained"
          onClick={() => handleOptionChange('cursos')}
          sx={getButtonStyle('cursos')}
        >
          Cursos
        </Button>
        <Button
          variant="contained"
          onClick={() => handleOptionChange('profesores')}
          sx={getButtonStyle('profesores')}
        >
          Profesores
        </Button>
      </Box>

      <Box sx={{ mt: 3 }}>
        {renderSelectedComponent()}
      </Box>
    </Box>
  );
}

export default SendMails;