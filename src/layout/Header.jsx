import React, { useState } from 'react';
import { Layout, Menu } from 'antd';
import { Link } from 'react-router-dom';
import { MenuOutlined, SearchOutlined, HeartOutlined, UserOutlined } from '@ant-design/icons';

const { Header } = Layout;

const AppHeader = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
            Shop Sida
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
        <div className="fixed font-medium mb-6 inset-0 z-50 flex">
          <div className="w-1/4 bg-white shadow-lg">
            <Menu
              className='my-12 mx-6'
              mode="vertical"
              items={[
                { key: '1', label: <Link to="/men" onClick={() => setIsMenuOpen(false)} className="text-2xl my-12">Đồ Nam</Link> },
                { key: '2', label: <Link to="/women" onClick={() => setIsMenuOpen(false)} className="text-2xl my-12">Đồ Nữ</Link> },
                { key: '3', label: <Link to="/handbags" onClick={() => setIsMenuOpen(false)} className="text-2xl my-12">Túi Xách</Link> },
                { key: '4', label: <Link to="/shoes" onClick={() => setIsMenuOpen(false)} className="text-2xl my-12">Giày</Link> },
                { key: '5', label: <Link to="/accessories" onClick={() => setIsMenuOpen(false)} className="text-2xl my-12">Phụ Kiện</Link> },
              ]}
              style={{ backgroundColor: 'white', color: 'black', height: '90%' }}
            />
          </div>
          <div
            className="flex-1 bg-black bg-opacity-50 backdrop-blur-sm"
            onClick={() => setIsMenuOpen(false)}
          />
        </div>
      )}
    </div>
  );
};

export default AppHeader;