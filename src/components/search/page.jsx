import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { message } from 'antd';
import axiosInstance from '../../utils/axios';

const Search = () => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestionsLoading, setSuggestionsLoading] = useState(false);
  const navigate = useNavigate();

  // Gợi ý có debounce
  useEffect(() => {
    if (query.trim().length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    const fetchSuggestions = async () => {
      setSuggestionsLoading(true);
      try {
        const response = await axiosInstance.get('/Products', {
          params: { search: query, page: 1, pageSize: 5 },
        });
        setSuggestions(response.data.items || []);
        setShowSuggestions(true);
      } catch (err) {
        console.error('Lỗi khi lấy gợi ý:', err);
        message.error('Không thể tải gợi ý tìm kiếm');
        setSuggestions([]);
        setShowSuggestions(false);
      } finally {
        setSuggestionsLoading(false);
      }
    };

    const debounce = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(debounce);
  }, [query]);

  // Xử lý tìm kiếm chính
  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      setShowSuggestions(false);
      navigate(`/search?q=${encodeURIComponent(query)}`);
    } else {
      message.warning('Vui lòng nhập từ khóa tìm kiếm');
    }
  };

  // Nhấp vào gợi ý sẽ đến trang chi tiết sản phẩm
  const handleSuggestionClick = (suggestion) => {
    setQuery('');
    setShowSuggestions(false);
    navigate(`/product/${suggestion.id}`);
  };

  return (
    <div className="relative max-w-screen w-full max-w-md mx-auto">
      <form onSubmit={handleSearch} className="flex items-center">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Tìm kiếm sản phẩm..."
          className="w-full p-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="Tìm kiếm sản phẩm"
        />
        <button
          type="submit"
          className="p-2 bg-blue-500 text-white rounded-r-md hover:bg-blue-600"
          aria-label="Tìm kiếm"
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
      {suggestionsLoading && (
        <div className="absolute z-10 w-full bg-white border border-gray-300 rounded-md mt-1 p-2 shadow-lg">
          Đang tải gợi ý...
        </div>
      )}

      {showSuggestions && suggestions.length > 0 && !suggestionsLoading && (
        <ul
          className="absolute z-10 w-full bg-white border border-gray-300 rounded-md mt-1 max-h-60 overflow-auto shadow-lg"
          role="listbox"
          aria-label="Gợi ý tìm kiếm"
        >
          {suggestions.map((suggestion) => (
            <li
              key={suggestion.id}
              onClick={() => handleSuggestionClick(suggestion)}
              className="flex items-center p-2 hover:bg-gray-100 cursor-pointer"
              role="option"
              aria-selected="false"
            >
              <img
                src={suggestion.images?.[0] || 'https://via.placeholder.com/50'}
                alt={suggestion.name}
                className="w-10 h-10 object-cover mr-2"
                loading="lazy"
              />
              <span className="truncate">{suggestion.name}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Search;
