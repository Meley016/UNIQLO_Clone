import React, { useState, useEffect } from 'react';
import { Dropdown, Menu, message } from 'antd';
import { DownOutlined, UserOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';

const UserMenu = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  // Kiểm tra trạng thái đăng nhập khi component mount
  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    setIsLoggedIn(!!token);
  }, []);

  // Xử lý đăng xuất
  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('tokenExpiresIn');
    setIsLoggedIn(false);
    message.success('Đăng xuất thành công!');
    navigate('/login');
  };

  // Menu thả xuống khi đã đăng nhập
  const userMenu = (
    <Menu>
      <Menu.Item key="profile">
        <Link to="/profile">Hồ sơ</Link>
      </Menu.Item>
      <Menu.Item key="orders">
        <Link to="/orders">Đơn hàng</Link>
      </Menu.Item>
      <Menu.Item key="cart">
        <Link to="/cart">Giỏ hàng</Link>
      </Menu.Item>
      <Menu.Item key="payment">
        <Link to="/payment">Thanh toán</Link>
      </Menu.Item>
      <Menu.Item key="logout" onClick={handleLogout}>
        Đăng xuất
      </Menu.Item>
    </Menu>
  );

  return isLoggedIn ? (
    <Dropdown overlay={userMenu} trigger={['click']}>
      <button
        className="hover:text-blue-600 p-2 rounded-full transition-colors duration-100 flex items-center"
        aria-label="Tài khoản"
      >
        <UserOutlined className="text-2xl" />
      </button>
    </Dropdown>
  ) : (
    <button
      onClick={() => navigate('/login')}
      className="hover:text-blue-600 p-2 rounded-full transition-colors duration-100 flex items-center"
      aria-label="Tài khoản"
    >
      <UserOutlined className="text-2xl" />
    </button>
  );
};

export default UserMenu;