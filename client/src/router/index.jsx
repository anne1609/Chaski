import React from 'react';
import { Routes, Route } from 'react-router-dom';

import Login from '../components/Login';
import Secretary from '../components/secretary/Secretary';
import Teacher from '../components/teacher/Teacher';

function AppRoutes() {
  return (
    <Routes>
      <Route path="login" element={<Login />} />
      <Route path="secretary" element={<Secretary />} />
      <Route path="teacher" element={<Teacher />} />

    </Routes>
  );
}

export default AppRoutes;
