import { useState, useRef, useEffect } from 'react';
import './InputArea.css';

interface InputAreaProps {
  onSend: (text: string) => void;
  onStop?: () => void;
  disabled: boolean;
}

const InputArea: React.FC<InputAreaProps> = ({ onSend, onStop, disabled }) => {
  const [value, setValue] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 120) + 'px';
    }
  }, [value]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim() && !disabled) {
      onSend(value);
      setValue('');
      if (textareaRef.current) textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleStop = () => {
    if (onStop) onStop();
  };

  return (
    <form className={`input-area ${disabled ? 'disabled' : ''}`} onSubmit={handleSubmit}>
      <button type="button" className="attach-btn" disabled={disabled}>📎</button>
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Введите сообщение..."
        rows={1}
        disabled={disabled && !onStop}
      />
      {disabled && onStop ? (
        <button type="button" className="stop-btn" onClick={handleStop}>⏹ Стоп</button>
      ) : (
        <button type="submit" className="send-btn" disabled={!value.trim() || disabled}>➤</button>
      )}
    </form>
  );
};

export default InputArea;
