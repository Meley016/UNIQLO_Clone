import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Search = () => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const navigate = useNavigate();

  // Tìm kiếm gợi ý khi nhập từ khóa
  useEffect(() => {
    if (query.trim() === '') {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    const fetchSuggestions = async () => {
      try {
        const response = await axios.get('/fake_api.json'); // Hoặc API: /api/search?q=${query}
        const products = response.data;
        const filtered = products.filter((product) =>
          product.name.toLowerCase().includes(query.toLowerCase())
        );
        setSuggestions(filtered.slice(0, 5)); // Giới hạn 5 gợi ý
        setShowSuggestions(true);
      } catch (err) {
        console.error('Lỗi khi lấy gợi ý:', err);
        setSuggestions([]);
        setShowSuggestions(false);
      }
    };

    const debounce = setTimeout(fetchSuggestions, 300); // Debounce 300ms
    return () => clearTimeout(debounce);
  }, [query]);

  // Xử lý submit tìm kiếm
  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      setShowSuggestions(false);
      navigate(`/search?q=${encodeURIComponent(query)}`); // Chuyển hướng đến trang kết quả
    }
  };

  // Xử lý chọn gợi ý
  const handleSuggestionClick = (suggestion) => {
    setQuery(suggestion.name);
    setShowSuggestions(false);
    navigate(`/search?q=${encodeURIComponent(suggestion.name)}`);
  };

  return (
    <div className="relative w-full max-w-md mx-auto">
      <form onSubmit={handleSearch} className="flex items-center">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Tìm kiếm sản phẩm..."
          className="w-full p-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="p-2 bg-blue-500 text-white rounded-r-md hover:bg-blue-600"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </button>
      </form>

      {/* Gợi ý tìm kiếm */}
      {showSuggestions && suggestions.length > 0 && (
        <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-md mt-1 max-h-60 overflow-auto shadow-lg">
          {suggestions.map((suggestion) => (
            <li
              key={suggestion.id}
              onClick={() => handleSuggestionClick(suggestion)}
              className="flex items-center p-2 hover:bg-gray-100 cursor-pointer"
            >
              <Image
                src={suggestion.image || 'https://via.placeholder.com/50'}
                alt={suggestion.name}
                className="w-10 h-10 object-cover mr-2"
                loading="lazy"
              />
              <span>{suggestion.name}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Search;