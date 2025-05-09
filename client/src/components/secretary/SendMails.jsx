import React, { useState } from 'react';
import { Box, Radio, RadioGroup, FormControlLabel, FormControl, FormLabel, Typography } from '@mui/material';
import TeachersMails from './TeachersMails';
import GradeMails from './GradeMails';
import TutorsMails from './TutorsMails';
import SubjectMails from './SubjectMails';

function SendMails() {
  const [selectedOption, setSelectedOption] = useState('profesores'); // Default option

  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
  };

  const renderSelectedComponent = () => {
    switch (selectedOption) {
      case 'profesores':
        return <TeachersMails />;
      case 'cursos':
        return <GradeMails />;
      case 'tutores':
        return <TutorsMails />;
      case 'materias':
        return <SubjectMails />;
      default:
        return <Typography>Seleccione una opción</Typography>;
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <FormControl component="fieldset">
        <FormLabel component="legend">Enviar correos a:</FormLabel>
        <RadioGroup
          row
          aria-label="opciones de envío"
          name="row-radio-buttons-group"
          value={selectedOption}
          onChange={handleOptionChange}
        >
          <FormControlLabel value="profesores" control={<Radio />} label="Profesores" />
          <FormControlLabel value="cursos" control={<Radio />} label="Cursos" />
          <FormControlLabel value="tutores" control={<Radio />} label="Tutores" />
          <FormControlLabel value="materias" control={<Radio />} label="Materias" />
        </RadioGroup>
      </FormControl>

      <Box sx={{ mt: 3 }}>
        {renderSelectedComponent()}
      </Box>
    </Box>
  );
}

export default SendMails;