import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Home = () => {
  const [mainCategories, setMainCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchMainCategories = async () => {
      try {
        const response = await axios.get('/categories.json');
        if (!response.data) {
          throw new Error('Lỗi khi lấy dữ liệu danh mục chính');
        }
        setMainCategories(response.data);
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Đã xảy ra lỗi');
        setLoading(false);
      }
    };

    fetchMainCategories();
  }, []);

  // Xử lý cuộn chuột
  useEffect(() => {
    const handleWheel = (event) => {
      event.preventDefault(); // Ngăn cuộn trang mặc định
      if (event.deltaY > 0) {
        // Cuộn xuống: chuyển ảnh tiếp theo
        setCurrentIndex((prev) => (prev + 1) % mainCategories.length);
      } else if (event.deltaY < 0) {
        // Cuộn lên: chuyển ảnh trước
        setCurrentIndex((prev) => (prev - 1 + mainCategories.length) % mainCategories.length);
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    return () => window.removeEventListener('wheel', handleWheel);
  }, [mainCategories.length]);

  if (loading) {
    return <div className="text-center text-gray-500 p-4">Đang tải...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500 p-4">Lỗi: {error}</div>;
  }

  if (mainCategories.length === 0) {
    return (
      <div className="text-center my-12 text-gray-500 p-4">
        Hiện chưa có danh mục chính
      </div>
    );
  }

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Slide container */}
      <div
        className="flex flex-col transition-transform duration-500 ease-in-out"
        style={{ transform: `translateY(-${currentIndex * 100}vh)` }}
      >
        {mainCategories.map((category) => (
          <Link
            key={category.id}
            to={`/${category.name.toLowerCase()}`} // Dẫn đến SubCategory
            className="flex-shrink-0 w-full h-screen"
          >
            <img
              src={category.image || 'https://via.placeholder.com/150'}
              alt={category.name}
              className="w-full h-full object-cover"
            />
          </Link>
        ))}
      </div>

      {/* Chỉ số ảnh (dots) */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {mainCategories.map((_, index) => (
          <div
            key={index}
            className={`w-3 h-3 rounded-full ${
              index === currentIndex ? 'bg-white' : 'bg-gray-400'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default Home;