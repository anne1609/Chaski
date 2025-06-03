import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import Login from '../components/Login';
import Secretary from '../components/secretary/Secretary';
import Teacher from '../components/teacher/Teacher';
import SendMails from '../components/secretary/SendMails';
import Message from '../components/secretary/Message';
import ProtectedRoute from '../components/ProtectedRoute';
import ConfirmationPage from '../components/shared/ConfirmationPage';
import RejectionPage from '../components/shared/RejectionPage'; // Assuming this is the same component


function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route 
        path="/secretary" 
        element={
          <ProtectedRoute requiredRole="secretary">
            <Secretary />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/teacher" 
        element={
          <ProtectedRoute requiredRole="teacher">
            <Teacher />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/confirmation-accepted" 
        element={
          <ProtectedRoute requiredRole="secretary">
            <ConfirmationPage/>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/confirmation-rejected" 
        element={
          <ProtectedRoute requiredRole="secretary">
            <RejectionPage/>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/secretary/mails" 
        element={
          <ProtectedRoute requiredRole="secretary">
            <SendMails />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/secretary/compose-message" 
        element={
          <ProtectedRoute requiredRole="secretary">
            <Message />
          </ProtectedRoute>
        } 
      />
    </Routes>
  );
}

export default AppRoutes;
