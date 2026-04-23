import { useChatStore } from '../../store/chatStore';
import './SettingsPanel.css';

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  theme: string;
  setTheme: (theme: string) => void;
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({ isOpen, onClose, theme, setTheme }) => {
  const { settings, updateSetting, availableModels } = useChatStore();

  if (!isOpen) return null;

  return (
    <div className="settings-overlay" onClick={onClose}>
      <div className="settings-panel" onClick={(e) => e.stopPropagation()}>
        <h2>Настройки</h2>
        
        <div className="setting-group">
          <label>Модель</label>
          <select value={settings.model} onChange={(e) => updateSetting('model', e.target.value)}>
            {/* ✅ Рендерим список из API, если он пуст — показываем дефолт */}
            {availableModels.length > 0 ? (
              availableModels.map(model => (
                <option key={model} value={model}>{model}</option>
              ))
            ) : (
              <option value="GigaChat">GigaChat (Loading...)</option>
            )}
          </select>
        </div>

        <div className="setting-group">
          <label>Temperature: {settings.temperature}</label>
          <input type="range" min="0" max="2" step="0.1" value={settings.temperature} onChange={(e) => updateSetting('temperature', parseFloat(e.target.value))} />
        </div>

        <div className="setting-group">
          <label>Top-P: {settings.top_p}</label>
          <input type="range" min="0" max="1" step="0.05" value={settings.top_p} onChange={(e) => updateSetting('top_p', parseFloat(e.target.value))} />
        </div>

        <div className="setting-group">
          <label>Max Tokens</label>
          <input type="number" value={settings.max_tokens} onChange={(e) => updateSetting('max_tokens', parseInt(e.target.value))} />
        </div>

        <div className="setting-group">
          <label>Repetition Penalty: {settings.repetition_penalty}</label>
          <input type="range" min="1" max="2" step="0.05" value={settings.repetition_penalty} onChange={(e) => updateSetting('repetition_penalty', parseFloat(e.target.value))} />
        </div>

        <div className="setting-group">
          <label>Тема</label>
          <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
            {theme === 'light' ? '🌙 Тёмная' : '☀️ Светлая'}
          </button>
        </div>

        <button className="close-settings" onClick={onClose}>❌ Закрыть</button>
      </div>
    </div>
  );
};

export default SettingsPanel;
