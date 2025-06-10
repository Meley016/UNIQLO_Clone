import React, { useState, useEffect } from 'react';
import { Menu } from 'antd';
import { RightOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import SubCategoryList from '../../components/categories/SubCategoryList';

const HamburgerMenu = ({ isMenuOpen, setIsMenuOpen }) => {
  const [categories, setCategories] = useState([]);
  const [hoveredCategory, setHoveredCategory] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('/categories.json');
        setCategories(response.data);
      } catch (error) {
        console.error('Lỗi khi lấy danh mục:', error.message || 'Đã xảy ra lỗi');
      }
    };

    fetchCategories();
  }, []);

  const handleCategoryClick = (category) => {
    setHoveredCategory(category);
  };

  const handleSubCategoryClick = (parentCategoryName, subcategoryName) => {
    navigate(
      `/${parentCategoryName.toLowerCase()}/${subcategoryName
        .toLowerCase()
        .replace(/\s+/g, '-')}`
    );
    setIsMenuOpen(false);
    setHoveredCategory(null);
  };

  return (
    <div
      className={`fixed inset-0 h-full z-50 flex transition-opacity duration-700 ease-in-out ${
        isMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
    >
      {/* Menu danh mục với hiệu ứng trượt từ trái */}
      <div
        className={`w-1/4 bg-white shadow-lg transform transition-transform duration-700 ease-in-out ${
          isMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <Menu
          className="my-12 mx-6"
          mode="vertical"
          items={categories.map((category) => ({
            key: category.id.toString(),
            label: (
              <div
                className="text-auto justify-between items-center w-full"
                onMouseEnter={() => handleCategoryClick(category)}
              >
                {category.name}
                <RightOutlined className="ml-2" />
              </div>
            ),
          }))}
          style={{ backgroundColor: 'white', color: 'black', height: 'auto' }}
        />
      </div>
      {/* Submenu với hiệu ứng trượt từ trái */}
      {hoveredCategory && (
        <div
          className={`w-2/4 bg-white z-50 max-h-screen overflow-y-auto transform transition-transform duration-700 ease-in-out ${
            isMenuOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <SubCategoryList
            parentCategoryId={hoveredCategory.id}
            parentCategoryName={hoveredCategory.name}
            onSubCategoryClick={(subcategoryName) =>
              handleSubCategoryClick(hoveredCategory.name, subcategoryName)
            }
          />
        </div>
      )}
      {/* Overlay với hiệu ứng mờ dần */}
      <div
        className={`flex-1 bg-black bg-opacity-50 backdrop-blur-sm transition-opacity duration-700 ease-in-out ${
          isMenuOpen ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={() => {
          setIsMenuOpen(false);
          setHoveredCategory(null);
        }}
      />
    </div>
  );
};

export default HamburgerMenu;