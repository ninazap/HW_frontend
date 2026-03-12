import './EmptyState.css';

export const EmptyState: React.FC = () => {
  return (
    <div className="empty-state">
      <div className="empty-icon">💬</div>
      <p>Начните новый диалог</p>
    </div>
  );
};
