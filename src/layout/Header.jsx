import React, { useState, useEffect } from 'react';
import { Layout, Menu } from 'antd';
import { RightOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { MenuOutlined, SearchOutlined, HeartOutlined, UserOutlined } from '@ant-design/icons';
import ProductList from '../components/products/ProductList';
import SubCategoryList from '../components/categories/SubCategoryList';

const { Header } = Layout;

const AppHeader = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [hoveredCategory, setHoveredCategory] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/categories.json');
        if (!response.ok) {
          throw new Error('Failed to fetch categories');
        }
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  return (
    <div className="relative">
      <Header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 1,
          width: '100%',
          backgroundColor: 'white',
          borderBottom: '1px solid #e5e7eb',
          height: '100px',
        }}
      >
        <div
          className="container mx-auto px-4 py-3 flex justify-between items-center"
          style={{ height: '100px', minHeight: '100px', display: 'flex' }}
        >
          <div className="flex items-center space-x-6 text-black">
            <button
              className="focus:outline-none hover:text-blue-600 p-2 rounded-full transition-colors duration-200"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Mở/Đóng Menu"
            >
              <MenuOutlined className="text-2xl" />
            </button>
            <button
              className="focus:outline-none hover:text-blue-600 p-2 rounded-full transition-colors duration-200"
              aria-label="Tìm kiếm"
            >
              <SearchOutlined className="text-2xl" />
            </button>
          </div>
          <Link
            to="/"
            className="flex items-center text-3xl md:text-4xl lg:text-5xl font-serif uppercase tracking-widest text-black font-bold mx-auto"
            style={{ lineHeight: '100px' }}
          >
            <img
              src="/Logo_1.png"
              alt="Shop Sida Logo"
              className="h-max w-36 mr-2" 
            />
          </Link>
          <div className="flex items-center space-x-6 text-black h-full">
            <Link
              to="/favorites"
              className="hover:text-blue-600 p-2 rounded-full transition-colors duration-200 flex items-center"
            >
              <HeartOutlined className="text-2xl" />
            </Link>
            <Link
              to="/account"
              className="hover:text-blue-600 p-2 rounded-full transition-colors duration-200 flex items-center"
            >
              <UserOutlined className="text-2xl" />
            </Link>
          </div>
        </div>
      </Header>
      {isMenuOpen && (
        <div className="fixed font-medium mb-6 inset-0 h-full z-50 flex">
          <div className="w-1/4 bg-white shadow-lg">
            <Menu
              className="my-12 mx-6"
              mode="vertical"
              items={categories.map((category) => ({
                key: category.id.toString(),
                label: (
                  <Link
                    to={`/${category.name.toLowerCase()}`}
                    onClick={() => setIsMenuOpen(false)}
                    className="text-2xl my-12 justify-between items-center w-full"
                    onMouseEnter={() => setHoveredCategory(category)}  
                  >
                    {category.name}
                    <RightOutlined className="ml-2" />
                  </Link>
                ),
              }))}
              style={{ backgroundColor: 'white', color: 'black', height: 'auto' }}
            />
          </div>

          {hoveredCategory && (
            <div className="w-2/4 mx-0 bg-white z-50 max-h-screen overflow-y-auto">
              <SubCategoryList
                parentCategoryId={hoveredCategory.id}
                parentCategoryName={hoveredCategory.name}
              />
            </div>
          )}

          <div
            className="flex-1 bg-black bg-opacity-50 backdrop-blur-sm"
            onClick={() => {
              setIsMenuOpen(false); 
              setHoveredCategory(null);
            }}
          />
        </div>
      )}
    </div>
  );
};

export default AppHeader;