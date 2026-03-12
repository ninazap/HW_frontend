import './ErrorMessage.css';

interface ErrorMessageProps {
  message: string;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ message }) => {
  if (!message) return null;
  return (
    <div className="error-message">
      <span className="error-icon">⚠️</span>
      {message}
    </div>
  );
};
