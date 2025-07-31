import { HeartOutlined, MenuOutlined, SearchOutlined } from '@ant-design/icons';
import { Layout } from 'antd';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import UserMenu from '../account/usermenu/page';
import HamburgerMenu from '../categories/Menu';

const { Header: AntHeader } = Layout;

const AppHeader = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="relative">
      <AntHeader
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 1,
          width: '100%',
          backgroundColor: 'white',
          borderBottom: '1px solid #e5e7eb',
          height: '100px',
          margin: 0,
          padding: 0,
        }}
      >
        <div
          className="container mx-auto px-4 py-0 flex justify-between items-center"
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
            <Link
              to="/search"
              className="focus:outline-none hover:text-blue-600 p-2 rounded-full transition-colors duration-200"
              aria-label="Tìm kiếm"
            >
              <SearchOutlined className="text-2xl" />
            </Link>
          </div>
          <Link
            to="/"
            className="flex items-center text-3xl md:text-4xl lg:text-5xl font-serif uppercase tracking-widest text-black font-bold mx-auto"
            style={{ lineHeight: '100px' }}
          >
            <img
              src="/Logo1.png"
              alt="Shop Sida Logo"
              className="h-max w-36 mr-2"
            />
          </Link>
          <div className="flex items-center space-x-6 text-black h-full">
            <Link
              to="/payment-success"
              className="hover:text-blue-600 p-2 rounded-full transition-colors duration-200 flex items-center"
            >
              <HeartOutlined className="text-2xl" />
            </Link>
            <UserMenu />
          </div>
        </div>
      </AntHeader>
      <HamburgerMenu isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
    </div>
  );
};

export default AppHeader;