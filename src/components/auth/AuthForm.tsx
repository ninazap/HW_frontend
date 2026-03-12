import { useState } from 'react';
import './AuthForm.css';

interface AuthFormProps {
  onLogin: () => void;
}

const AuthForm: React.FC<AuthFormProps> = ({ onLogin }) => {
  const [credentials, setCredentials] = useState('');
  const [scope, setScope] = useState('GIGACHAT_API_PERS');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!credentials.trim()) {
      setError('Поле не должно быть пустым');
      return;
    }
    setError('');
    onLogin();
  };

  return (
    <div className="auth-form-container">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2>Авторизация</h2>
        
        <div className="form-group">
          <label>Credentials (Base64)</label>
          <input
            type="password"
            value={credentials}
            onChange={(e) => setCredentials(e.target.value)}
            placeholder="Введите credentials"
          />
        </div>

        <div className="form-group">
          <label>Scope</label>
          <div className="radio-group">
            <label>
              <input
                type="radio"
                name="scope"
                value="GIGACHAT_API_PERS"
                checked={scope === 'GIGACHAT_API_PERS'}
                onChange={(e) => setScope(e.target.value)}
              />
              GIGACHAT_API_PERS
            </label>
            <label>
              <input
                type="radio"
                name="scope"
                value="GIGACHAT_API_B2B"
                checked={scope === 'GIGACHAT_API_B2B'}
                onChange={(e) => setScope(e.target.value)}
              />
              GIGACHAT_API_B2B
            </label>
            <label>
              <input
                type="radio"
                name="scope"
                value="GIGACHAT_API_CORP"
                checked={scope === 'GIGACHAT_API_CORP'}
                onChange={(e) => setScope(e.target.value)}
              />
              GIGACHAT_API_CORP
            </label>
          </div>
        </div>

        {error && <div className="error-message">{error}</div>}

        <button type="submit" className="btn-primary">Войти</button>
      </form>
    </div>
  );
};

export default AuthForm;