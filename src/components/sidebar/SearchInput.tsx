import { useState } from 'react';
import './SearchInput.css';

const SearchInput: React.FC = () => {
  const [query, setQuery] = useState('');

  return (
    <div className="search-input">
      <input
        type="text"
        placeholder="Поиск чатов..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
    </div>
  );
};

export default SearchInput;
