import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

function AttendancePage() {
  const { communicationId } = useParams();
  const [attendanceData, setAttendanceData] = useState([]);

  useEffect(() => {
    const fetchAttendance = async () => {
      const [studentsRes, tutorsRes] = await Promise.all([
        fetch(`http://localhost:8080/api/students-communications/${communicationId}`),
        fetch(`http://localhost:8080/api/tutors-communications/${communicationId}`)
      ]);
      const students = studentsRes.ok ? await studentsRes.json() : [];
      const tutors = tutorsRes.ok ? await tutorsRes.json() : [];
      setAttendanceData([...students, ...tutors]);
    };
    fetchAttendance();
  }, [communicationId]);

  return (
    <TableContainer component={Paper} sx={{ maxWidth: 900, margin: 'auto', mt: 4 }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Nombre</TableCell>
            <TableCell>Tipo</TableCell>
            <TableCell>Estado</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {attendanceData.map((item, idx) => (
            <TableRow key={idx}>
              <TableCell>
                {item.student?.names || item.tutor?.names || 'N/A'}
              </TableCell>
              <TableCell>
                {item.student_id ? 'Estudiante' : 'Tutor'}
              </TableCell>
              <TableCell>
                {item.attendance_status || 'Pendiente'}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default AttendancePage;