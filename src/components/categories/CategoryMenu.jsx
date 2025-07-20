import React, { useState, useEffect } from 'react';
import { Menu } from 'antd';
import { RightOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axios';

const CategoryMenu = ({ onClose }) => {
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

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

  const handleCategoryClick = (category) => {
    navigate(`/${category.name.toLowerCase()}`);
    onClose();
  };

  return (
    <div className="fixed inset-0 h-full z-50 flex">
      <div className="w-1/4 bg-white shadow-lg">
        <Menu
          className="my-12 mx-6"
          mode="vertical"
          items={categories.map((category) => ({
            key: category.id.toString(),
            label: (
              <div
                className="text-auto justify-between items-center w-full"
                onClick={() => handleCategoryClick(category)}
              >
                {category.name}
                <RightOutlined className="ml-2" />
              </div>
            ),
          }))}
          style={{ backgroundColor: 'white', color: 'black', height: 'auto' }}
        />
      </div>
      <div
        className="flex-1 bg-black bg-opacity-50 backdrop-blur-sm"
        onClick={onClose}
      />
    </div>
  );
};

export default CategoryMenu;