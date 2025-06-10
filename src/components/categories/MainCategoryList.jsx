import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import CategoryCard from '../common/CategoryCard';
import axios from 'axios';

const MainCategoryList = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('/subcategories.json');
        if (!response.data) {
          throw new Error('Lỗi khi lấy dữ liệu danh mục');
        }
        setCategories(response.data);
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Đã xảy ra lỗi');
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
        Hiện chưa có sản phẩm
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-xl font-bold mb-4 text-center">Danh mục sản phẩm</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 justify-items-center">
        {categories.map((category) => (
          <div key={category.parentCategoryId} className="px-2">
            <Link
              to={`/${category.parentCategoryName.toLowerCase()}`}
              className="block"
            >
              <CategoryCard
                id={category.parentCategoryId}
                image={category.subcategories[0]?.image || 'https://via.placeholder.com/150'}
                name={category.parentCategoryName}
              />
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MainCategoryList;