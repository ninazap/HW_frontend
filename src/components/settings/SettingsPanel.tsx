import './SettingsPanel.css';

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  theme: string;
  setTheme: (theme: string) => void;
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({ isOpen, onClose, theme, setTheme }) => {
  const model = 'GigaChat';
  const temperature = 0.7;
  const topP = 0.9;
  const maxTokens = 1000;
  const systemPrompt = '';

  if (!isOpen) return null;

  return (
    <div className="settings-overlay" onClick={onClose}>
      <div className="settings-panel" onClick={(e) => e.stopPropagation()}>
        <h2>Настройки</h2>
        
        <div className="setting-group">
          <label>Модель</label>
          <select defaultValue={model}>
            <option>GigaChat</option>
            <option>GigaChat-Plus</option>
            <option>GigaChat-Pro</option>
            <option>GigaChat-Max</option>
          </select>
        </div>

        <div className="setting-group">
          <label>Temperature: {temperature}</label>
          <input type="range" min="0" max="2" step="0.1" defaultValue={temperature} />
        </div>

        <div className="setting-group">
          <label>Top-P: {topP}</label>
          <input type="range" min="0" max="1" step="0.1" defaultValue={topP} />
        </div>

        <div className="setting-group">
          <label>Max Tokens</label>
          <input type="number" defaultValue={maxTokens} />
        </div>

        <div className="setting-group">
          <label>System Prompt</label>
          <textarea defaultValue={systemPrompt} />
        </div>

        <div className="setting-group">
          <label>Тема</label>
          <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
            {theme === 'light' ? '🌙 Тёмная' : '☀️ Светлая'}
          </button>
        </div>

        <div className="setting-actions">
          <button className="btn-save">Сохранить</button>
          <button className="btn-reset">Сбросить</button>
        </div>

        <button className="close-settings" onClick={onClose}>❌</button>
      </div>
    </div>
  );
};

export default SettingsPanel;