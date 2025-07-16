import React, { useState } from 'react';
import { Button, Form, Input, message } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import axiosInstance from '../../../utils/axios';

const LoginPage = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const response = await axiosInstance.post('/Account/login', {
        email: values.email,
        password: values.password,
      });

      const { email, accessToken, expriesIn } = response.data;

      console.log('Đăng nhập thành công:', { email, accessToken, expriesIn });

      // Lưu token và email vào localStorage
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('userEmail', email);
      localStorage.setItem('tokenexpriesInn', expriesIn);

      message.success('Đăng nhập thành công!');
      navigate('/');

      // Trigger sự kiện loginStatusChanged
      window.dispatchEvent(new Event('loginStatusChanged'));
    } catch (error) {
      const errorMessage = error || 'Đăng nhập thất bại. Vui lòng kiểm tra email hoặc mật khẩu!';
      message.error(errorMessage);
      console.error('Lỗi đăng nhập:', error);
    } finally {
      setLoading(false);
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Form validation failed:', errorInfo);
    message.error('Vui lòng điền đầy đủ thông tin!');
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="flex w-full max-w-4xl bg-white shadow-md rounded-lg overflow-hidden">
        <div className="w-1/2 p-6">
          <h2 className="text-2xl font-bold mb-4">ĐĂNG NHẬP</h2>
          <p className="text-gray-600 mb-4">Đăng nhập bằng địa chỉ email và mật khẩu của bạn.</p>
          <Form
            name="login"
            labelCol={{ span: 0 }}
            wrapperCol={{ span: 24 }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
            disabled={loading}
            className="space-y-4"
          >
            <Form.Item
              name="email"
              rules={[{ required: true, message: 'Vui lòng nhập email!', type: 'email' }]}
            >
              <Input
                prefix={<UserOutlined className="text-gray-400" />}
                placeholder="Địa chỉ Email *"
                size="large"
                className="border-gray-300 rounded-sm py-2 px-3 text-gray-700"
              />
            </Form.Item>
            <Form.Item
              name="password"
              rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
            >
              <Input.Password
                prefix={<LockOutlined className="text-gray-400" />}
                placeholder="Mật khẩu *"
                size="large"
                className="border-gray-300 rounded-sm py-2 px-3 text-gray-700"
              />
            </Form.Item>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                block
                loading={loading}
                className="bg-black hover:bg-gray-800 rounded-sm py-2 text-white font-medium"
              >
                ĐĂNG NHẬP
              </Button>
            </Form.Item>
            <div className="text-center text-sm">
              <Link to="/forgot-password" className="text-blue-600 hover:underline">
                Quên mật khẩu của bạn?
              </Link>
            </div>
            <div className="text-xs text-gray-500 mt-2">
              <p>ĐIỀU KHOẢN SỬ DỤNG</p>
              <p>CHÍNH SÁCH BẢO MẬT</p>
            </div>
          </Form>
        </div>

        <div className="w-1/2 bg-gray-50 p-6 flex flex-col justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-4">TẠO MỘT TÀI KHOẢN</h2>
            <p className="text-gray-600 mb-4">
              Hãy tạo tài khoản ngay! Bạn có thể tạo một tài khoản đặc biệt dành cho bạn với những ưu đãi hấp dẫn hoặc tạo tài khoản đơn giản cho nhân viên của bạn.
            </p>
          </div>
          <Link to="/register" 
                type="primary"
                size="large"
                block className="bg-black hover:bg-gray-800 rounded-sm py-2 text-white font-medium">
              Chưa có tài khoản?
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;