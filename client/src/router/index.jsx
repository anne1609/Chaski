import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import Login from '../components/Login';
import Secretary from '../components/secretary/Secretary';
import Teacher from '../components/teacher/Teacher';
import TeacherMails from '../components/teacher/TeacherMails';
import SendMails from '../components/secretary/SendMails';
import Message from '../components/secretary/Message';
import ProtectedRoute from '../components/ProtectedRoute';
import ConfirmationPage from '../components/shared/ConfirmationPage';
import RejectionPage from '../components/shared/RejectionPage'; // Assuming this is the same component
import TeacherAttendanceStatus from '../components/teacher/TeacherAttendanceStatus';
import TeacherCommunications from '../components/teacher/TeacherCommunications';
import DetailsPage from '../components/shared/DetailsPage';
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
        path="/secretary/communication/:communicationId"
        element={
          <ProtectedRoute requiredRole="secretary">
            <DetailsPage />
          </ProtectedRoute>
        }
      />
      <Route 
        path="/confirmation-accepted" 
        element={
          <ConfirmationPage/>
        } 
      />
      <Route 
        path="/confirmation-rejected" 
        element={
          <RejectionPage/>
        } 
      />
      <Route 
        path="/secretary/attendance/:communicationId" 
        element={
          <ProtectedRoute requiredRole="secretary">
            <TeacherAttendanceStatus />
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
      <Route 
        path="/teacher/mails" 
        element={
          <ProtectedRoute requiredRole="teacher">
            <TeacherMails />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/teacher/compose-message" 
        element={
          <ProtectedRoute requiredRole="teacher">
            <Message />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/teacher/notice" 
        element={
          <ProtectedRoute requiredRole="teacher">
            <Message />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/teacher/messages" 
        element={
          <ProtectedRoute requiredRole="teacher">
            <TeacherCommunications />
          </ProtectedRoute>
        } 
      />
    </Routes>
  );
}

export default AppRoutes;
