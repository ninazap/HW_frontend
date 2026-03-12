import { useState, useEffect } from 'react';
import Sidebar from '../sidebar/Sidebar';
import ChatWindow from '../chat/ChatWindow';
import SettingsPanel from '../settings/SettingsPanel';
import './AppLayout.css';

interface AppLayoutProps {
  theme: string;
  setTheme: (theme: string) => void;
}

const AppLayout: React.FC<AppLayoutProps> = ({ theme, setTheme }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth > 768);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsSidebarOpen(window.innerWidth > 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="app-layout">
      <Sidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
      />
      <main className="main-content">
        <button 
          className="burger-btn" 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          ☰
        </button>
        <ChatWindow onOpenSettings={() => setIsSettingsOpen(true)} />
      </main>
      <SettingsPanel 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)} 
        theme={theme}
        setTheme={setTheme}
      />
    </div>
  );
};

export default AppLayout;