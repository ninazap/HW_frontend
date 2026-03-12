import './Toggle.css';

interface ToggleProps {
  enabled: boolean;
  onChange: (enabled: boolean) => void;
  label?: string;
}

export const Toggle: React.FC<ToggleProps> = ({ enabled, onChange, label }) => {
  return (
    <label className="toggle-container">
      {label && <span>{label}</span>}
      <div className={`toggle ${enabled ? 'enabled' : ''}`} onClick={() => onChange(!enabled)}>
        <div className="toggle-handle"></div>
      </div>
    </label>
  );
};
