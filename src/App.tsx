import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import './styles/theme.css';
import AppLayout from './components/layout/AppLayout';
import AuthForm from './components/auth/AuthForm';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  if (!isAuthenticated) {
    return <AuthForm onLogin={() => setIsAuthenticated(true)} />;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AppLayout theme={theme} setTheme={setTheme} />} />
        <Route path="/chat/:id" element={<AppLayout theme={theme} setTheme={setTheme} />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
