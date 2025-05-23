import React from 'react';
import { Routes, Route } from 'react-router-dom';

import Login from '../components/Login';
import Secretary from '../components/secretary/Secretary';
import Teacher from '../components/teacher/Teacher';
import SendMails from '../components/secretary/SendMails';
import Message from '../components/secretary/Message'; // Import the Message component

function AppRoutes() {
  return (
    <Routes>
      <Route path="login" element={<Login />} />
      <Route path="secretary" element={<Secretary />} />
      <Route path="teacher" element={<Teacher />} />
      <Route path="secretary/mails" element={<SendMails />} />
      <Route path="secretary/compose-message" element={<Message />} /> {/* Add route for Message component */}
    </Routes>
  );
}

export default AppRoutes;
