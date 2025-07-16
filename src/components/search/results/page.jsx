import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { message } from 'antd';
import axiosInstance from '../../../utils/axios';

const SearchResults = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const query = new URLSearchParams(location.search).get('q');

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await axiosInstance.get('/Products', {
          params: { search: query, page: 1, pageSize: 20 }, // Giới hạn 20 kết quả
        });
        const products = response.data.items || [];
        setResults(products);
        setLoading(false);
      } catch (err) {
        console.error('Lỗi khi tìm kiếm:', err);
        message.error('Lỗi khi lấy kết quả tìm kiếm');
        setLoading(false);
      }
    };

    if (query) fetchResults();
    else setLoading(false);
  }, [query]);

  if (loading) return <div className="text-center p-4">Đang tải...</div>;
  if (!query) return <div className="text-center p-4">Vui lòng nhập từ khóa</div>;
  if (results.length === 0) return <div className="text-center p-4">Không tìm thấy kết quả</div>;

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-xl font-bold mb-4">Kết quả tìm kiếm cho: {query}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {results.map((product) => (
          <Link
            key={product.id}
            to={`/product/${product.id}`}
            className="border p-2 hover:shadow-lg transition"
          >
            <img
              src={product.images?.[0] || 'https://via.placeholder.com/150'}
              alt={product.name}
              className="w-full h-40 object-cover"
              loading="lazy"
            />
            <h3 className="text-lg font-semibold">{product.name}</h3>
            <p className="text-gray-600">{product.price.toLocaleString('vi-VN')} VND</p>
            <div className="flex gap-1 mt-1">
              {[...new Set(product.variants?.map((v) => v.colorId) || [])]
                .slice(0, 3)
                .map((colorId) => (
                  <div
                    key={colorId}
                    className="w-4 h-4 rounded-full border"
                    style={{
                      backgroundColor: colorId === 'COL00' ? '#000' : colorId === 'COL01' ? '#fff' : colorId,
                    }}
                  />
                ))}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default SearchResults;