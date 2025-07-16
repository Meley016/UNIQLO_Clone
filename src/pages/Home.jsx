import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../utils/axios';

const Home = () => {
  const [randomProducts, setRandomProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchRandomProducts = async () => {
      try {
        const response = await axiosInstance.get('/Products', {
          params: {
            page: 1,
            pageSize: 20,
          },
        });
        if (!response.data.items) throw new Error('Lỗi khi lấy dữ liệu sản phẩm');
        const shuffled = response.data.items.sort(() => 0.5 - Math.random());
        setRandomProducts(shuffled.slice(0, 5));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Đã xảy ra lỗi');
      } finally {
        setLoading(false);
      }
    };

    fetchRandomProducts();
  }, []);

  useEffect(() => {
    const handleWheel = (event) => {
      event.preventDefault();
      if (event.deltaY > 0) {
        setCurrentIndex((prev) => (prev + 1) % randomProducts.length);
      } else if (event.deltaY < 0) {
        setCurrentIndex((prev) => (prev - 1 + randomProducts.length) % randomProducts.length);
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    return () => window.removeEventListener('wheel', handleWheel);
  }, [randomProducts.length]);

  if (loading) return <div className="text-center p-4 text-gray-500">Đang tải...</div>;
  if (error) return <div className="text-center p-4 text-red-500">Lỗi: {error}</div>;
  if (randomProducts.length === 0)
    return <div className="text-center p-4 text-gray-500">Không có sản phẩm.</div>;

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="relative max-w-screen h-full overflow-hidden rounded-lg shadow-lg bg-black">
        {/* Slide container */}
        <div
          className="flex transition-transform duration-500 ease-in-out h-full"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {randomProducts.map((product) => (
            <Link
              key={product.id}
              to={`/product/${product.id}`}
              className="flex-shrink-0 w-full h-full relative"
            >
              <img
                src={product.images?.[0] || 'https://source.unsplash.com/800x500/?uniqlo,fashion'}
                alt={product.name}
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <div className="absolute bottom-4 left-4 text-white bg-black bg-opacity-50 p-3 rounded">
                <h2 className="text-lg font-semibold">{product.name}</h2>
                <p className="text-sm">{product.price.toLocaleString('vi-VN')} VND</p>
              </div>
            </Link>
          ))}
        </div>

        {/* Dots */}
        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {randomProducts.map((_, index) => (
            <div
              key={index}
              className={`w-3 h-3 rounded-full ${
                index === currentIndex ? 'bg-white' : 'bg-gray-400'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
