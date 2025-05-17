import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from './store';
import { checkAuth } from './store/slices/authSlice';
import Layout from './components/layout/Layout';
import LoginForm from './components/auth/LoginForm';
import SplashScreen from './components/auth/SplashScreen';
import WorkspacePage from './pages/WorkspacePage';
import CueEditorPage from './pages/CueEditorPage';
import DeviceSettingsPage from './pages/DeviceSettingsPage';
import NotFoundPage from './pages/NotFoundPage';
import ProtectedRoute from './components/auth/ProtectedRoute';

function App() {
  const dispatch = useDispatch<AppDispatch>();
  const { isAuthenticated, isLoading } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  if (isLoading) {
    return <SplashScreen />;
  }

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/workspace" replace />} />
      <Route path="/login" element={!isAuthenticated ? <LoginForm /> : <Navigate to="/workspace" replace />} />
      
      <Route element={<ProtectedRoute isAuthenticated={isAuthenticated} />}>
        <Route element={<Layout />}>
          <Route path="/workspace" element={<WorkspacePage />} />
          <Route path="/cues" element={<CueEditorPage />} />
          <Route path="/device/:id" element={<DeviceSettingsPage />} />
        </Route>
      </Route>
      
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;
