import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

const SearchResults = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const query = new URLSearchParams(location.search).get('q');

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await axios.get('/fake_api.json'); // Hoặc API: /api/search?q=${query}
        const filtered = response.data.filter((product) =>
          product.name.toLowerCase().includes(query.toLowerCase())
        );
        setResults(filtered);
        setLoading(false);
      } catch (err) {
        console.error('Lỗi khi tìm kiếm:', err);
        setLoading(false);
      }
    };

    if (query) fetchResults();
  }, [query]);

  if (loading) return <div className="text-center p-4">Đang tải...</div>;
  if (!query) return <div className="text-center p-4">Vui lòng nhập từ khóa</div>;
  if (results.length === 0) return <div className="text-center p-4">Không tìm thấy kết quả</div>;

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-xl font-bold mb-4">Kết quả tìm kiếm cho: {query}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {results.map((product) => (
          <div key={product.id} className="border p-2">
            <Image
              src={product.image || 'https://via.placeholder.com/150'}
              alt={product.name}
              className="w-full h-40 object-cover"
              loading="lazy"
            />
            <h3 className="text-lg font-semibold">{product.name}</h3>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchResults;