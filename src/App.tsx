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

  return <AppLayout theme={theme} setTheme={setTheme} />;
}

export default App;