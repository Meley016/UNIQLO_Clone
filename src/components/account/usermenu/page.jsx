import React, { useState, useEffect } from 'react';
import { Dropdown, Menu, message, Badge } from 'antd';
import { DownOutlined, UserOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';

const UserMenu = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const navigate = useNavigate();

  // Kiểm tra trạng thái đăng nhập
  const checkLoginStatus = () => {
    const token = localStorage.getItem('accessToken');
    setIsLoggedIn(!!token);
  };

const updateCartCount = () => {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  // Đếm số loại sản phẩm khác nhau (id + selectedColor + selectedSize)
  const uniqueCount = cart.length;
  setCartCount(uniqueCount);
};

  useEffect(() => {
    checkLoginStatus();
    updateCartCount();

    window.addEventListener('loginStatusChanged', checkLoginStatus);
    window.addEventListener('storage', () => {
      checkLoginStatus();
      updateCartCount();
    });

    return () => {
      window.removeEventListener('loginStatusChanged', checkLoginStatus);
      window.removeEventListener('storage', updateCartCount);
    };
  }, []);

  // Khi thêm/xóa sản phẩm ở trang khác, có thể dispatch sự kiện này để cập nhật realtime
  useEffect(() => {
    const handler = () => updateCartCount();
    window.addEventListener('cartChanged', handler);
    return () => window.removeEventListener('cartChanged', handler);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('tokenExpiresIn');
    setIsLoggedIn(false);
    message.success('Đăng xuất thành công!');
    navigate('/login');
    window.dispatchEvent(new Event('loginStatusChanged'));
  };

  const userMenu = (
    <Menu>
      <Menu.Item key="profile">
        <Link to="/profile">Hồ sơ</Link>
      </Menu.Item>
      <Menu.Item key="orders">
        <Link to="/orders">Đơn hàng</Link>
      </Menu.Item>
      <Menu.Item key="cart">
        <Link to="/cart">
          Giỏ hàng{' '}
          <Badge count={cartCount} size="small" offset={[8, 0]}>
            <ShoppingCartOutlined />
          </Badge>
        </Link>
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
        className="hover:text-blue-600 p-2 rounded-full transition-colors duration-200 flex items-center"
        aria-label="Tài khoản"
      >
        <UserOutlined className="text-2xl" />
      </button>
    </Dropdown>
  ) : (
    <button
      onClick={() => navigate('/login')}
      className="hover:text-blue-600 p-2 rounded-full transition-colors duration-200 flex items-center"
      aria-label="Tài khoản"
    >
      <UserOutlined className="text-2xl" />
    </button>
  );
};

export default UserMenu;