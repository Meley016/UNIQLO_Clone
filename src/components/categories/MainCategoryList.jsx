import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import CategoryCard from '../common/CategoryCard';
import axiosInstance from '../../utils/axios';

const MainCategoryList = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axiosInstance.get('/Categories'); // Sử dụng axiosInstance và đường dẫn tương đối
        if (!response.data.items) {
          throw new Error('Lỗi khi lấy dữ liệu danh mục');
        }
        setCategories(response.data.items);
        setLoading(false);
      } catch (err) {
        setError(err || 'Đã xảy ra lỗi'); // Lỗi từ interceptor sẽ trả về message
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) {
    return <div className="text-center text-gray-500 p-4">Đang tải...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500 p-4">Lỗi: {error}</div>;
  }

  if (categories.length === 0) {
    return (
      <div className="text-center my-12 text-gray-500 p-4">
        Hiện chưa có danh mục
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-xl font-bold mb-4 text-center">Danh mục sản phẩm</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 justify-items-center">
        {categories.map((category) => (
          <div key={category.id} className="px-2">
            <Link
              to={`/${category.categories_name.toLowerCase().replace(/\s+/g, '-')}`}
              className="block"
            >
              <CategoryCard
                id={category.id}
                image={'https://via.placeholder.com/150'} // Không có image trong model, dùng placeholder
                name={category.categories_name}
              />
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MainCategoryList;