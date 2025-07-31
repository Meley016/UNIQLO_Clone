import React, { useState } from 'react';
import { Button, Form, Input, Radio, Checkbox, message } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { LockOutlined, UserOutlined, CalendarOutlined } from '@ant-design/icons';
import axiosInstance from '../../../utils/axios';

const RegisterPage = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      console.log('Đang gửi yêu cầu đăng ký:', values);

      // Tính tuổi từ birthdate
      const birthdate = values.birthdate ? new Date(values.birthdate) : null;
      const age = birthdate ? new Date().getFullYear() - birthdate.getFullYear() : 0;

      // Ánh xạ gender
      const gender = values.gender === 'male' ? 'Male' : values.gender === 'female' ? 'Female' : 'Undefined';

      const response = await axiosInstance.post('/Account/register', {
        Email: values.email,
        Password: values.password,
        CustomerName: values.customerName || undefined,
        Age: age,
        Gender: gender,
        Newsletter: values.newsletter || false,
        AgreePromo1: values.agreePromo1 || false,
        AgreePromo2: values.agreePromo2 || false,
      });

      const { Email, AccessToken, ExpriesIn } = response.data;
      console.log('Đăng ký thành công:', { Email, AccessToken, ExpriesIn });

      // Lưu token và email vào localStorage
      localStorage.setItem('accessToken', AccessToken);
      localStorage.setItem('userEmail', Email);
      localStorage.setItem('tokenExpiresIn', ExpriesIn);
      localStorage.setItem('loginTime', Date.now());

      message.success('Đăng ký thành công!');
      navigate('/'); // Điều hướng về trang chủ
    } catch (error) {
      const errorMessage = error.message || 'Đăng ký thất bại. Vui lòng thử lại!';
      message.error(errorMessage);
      console.error('Lỗi đăng ký:', error);
    } finally {
      setLoading(false);
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Xác thực form thất bại:', errorInfo);
    message.error('Vui lòng điền đầy đủ thông tin bắt buộc!');
  };

  return (
    <div className="bg-white p-6 rounded-lg w-full max-w-xl mx-auto shadow-md">
      <Form
        form={form}
        name="register"
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
        disabled={loading}
        className="space-y-4"
      >
        <h2 className="text-xl font-bold text-center">TẠO MỘT TÀI KHOẢN</h2>

        <Form.Item
          name="customerName"
          rules={[{ required: false, message: 'Vui lòng nhập tên!' }]}
        >
          <Input
            prefix={<UserOutlined className="text-gray-400" />}
            placeholder="Tên người dùng"
            size="large"
            className="border-gray-300 rounded-sm py-2 px-3 text-gray-700"
          />
        </Form.Item>

        <Form.Item
          name="email"
          rules={[{ required: true, message: 'Vui lòng nhập email!', type: 'email' }]}
        >
          <Input
            prefix={<UserOutlined className="text-gray-400" />}
            placeholder="Địa chỉ email"
            size="large"
            className="border-gray-300 rounded-sm py-2 px-3 text-gray-700"
          />
        </Form.Item>

        <Form.Item
          name="password"
          rules={[
            { required: true, message: 'Vui lòng nhập mật khẩu!' },
            { min: 8, message: 'Mật khẩu phải có ít nhất 8 ký tự!' },
          ]}
        >
          <Input.Password
            prefix={<LockOutlined className="text-gray-400" />}
            placeholder="Mật khẩu (Tối thiểu 8 ký tự)"
            size="large"
            className="border-gray-300 rounded-sm py-2 px-3 text-gray-700"
          />
        </Form.Item>

        <Form.Item
          name="confirmPassword"
          dependencies={['password']}
          rules={[
            { required: true, message: 'Vui lòng xác nhận mật khẩu!' },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('Mật khẩu xác nhận không khớp!'));
              },
            }),
          ]}
        >
          <Input.Password
            prefix={<LockOutlined className="text-gray-400" />}
            placeholder="Xác nhận mật khẩu"
            size="large"
            className="border-gray-300 rounded-sm py-2 px-3 text-gray-700"
          />
        </Form.Item>

        <Form.Item
          name="birthdate"
          rules={[{ required: false, message: 'Vui lòng nhập ngày sinh!' }]}
        >
          <Input
            type="date"
            prefix={<CalendarOutlined className="text-gray-400" />}
            placeholder="Sinh nhật"
            size="large"
            className="border-gray-300 rounded-sm py-2 px-3 text-gray-700"
          />
        </Form.Item>

        <Form.Item
          name="gender"
          rules={[{ required: false, message: 'Vui lòng chọn giới tính!' }]}
        >
          <Radio.Group className="flex gap-4">
            <Radio value="male">Nam</Radio>
            <Radio value="female">Nữ</Radio>
            <Radio value="none">Bỏ chọn</Radio>
          </Radio.Group>
        </Form.Item>

        <Form.Item name="newsletter" valuePropName="checked">
          <Checkbox>Nhận thư từ UNIQLO</Checkbox>
        </Form.Item>

        <Form.Item>
          <h3 className="font-bold">TIN NHẮN VÀ CÀI ĐẶT RIÊNG</h3>
          <Form.Item name="agreePromo1" valuePropName="checked" noStyle>
            <Checkbox>Nhận tin nhắn quảng cáo (không cá nhân hóa)</Checkbox>
          </Form.Item>
          <Form.Item name="agreePromo2" valuePropName="checked" noStyle>
            <Checkbox>Nhận tin nhắn quảng cáo (cá nhân hóa)</Checkbox>
          </Form.Item>
        </Form.Item>

        <Form.Item
          name="agreeTerms"
          valuePropName="checked"
          rules={[{ required: true, message: 'Vui lòng đồng ý với điều khoản!' }]}
        >
          <Checkbox>
            Tôi đồng ý với <Link to="/terms" className="text-blue-600 hover:underline">điều khoản sử dụng</Link> và{' '}
            <Link to="/privacy" className="text-blue-600 hover:underline">chính sách bảo mật</Link>
          </Checkbox>
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            size="large"
            block
            loading={loading}
            className="bg-[#0066cc] hover:bg-[#005bb5] rounded-sm py-2 text-white font-medium"
          >
            ĐĂNG KÝ
          </Button>
        </Form.Item>

        <div className="text-center space-y-1 text-sm">
          <span>Đã có tài khoản? </span>
          <Link to="/login" className="text-blue-600 hover:underline">
            Đăng nhập
          </Link>
        </div>
      </Form>
    </div>
  );
};

export default RegisterPage;