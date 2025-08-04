import { UserOutlined } from '@ant-design/icons';
import { Dropdown, Menu, message } from 'antd';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const UserMenu = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  // Kiểm tra trạng thái đăng nhập
  const checkLoginStatus = () => {
    const token = localStorage.getItem('accessToken');
    setIsLoggedIn(!!token); // Cập nhật trạng thái dựa trên token
  };

  // Kiểm tra khi component mount và khi có sự kiện
  useEffect(() => {
    checkLoginStatus();

    window.addEventListener('loginStatusChanged', checkLoginStatus);
    window.addEventListener('storage', checkLoginStatus);

    return () => {
      window.removeEventListener('loginStatusChanged', checkLoginStatus);
      window.removeEventListener('storage', checkLoginStatus);
    };
  }, []);

  const handleLogout = () => {
    // Xóa tất cả các khóa liên quan trong localStorage
    localStorage.removeItem('accessToken');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('tokenExpiresIn');
    localStorage.removeItem('_id'); // Thêm _id
    localStorage.removeItem('addresses'); // Thêm địa chỉ
    localStorage.removeItem('cart'); // Thêm giỏ hàng
    localStorage.removeItem('orderHistory'); // Thêm lịch sử đơn hàng
    localStorage.removeItem('user'); // Thêm thông tin user (nếu có)

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