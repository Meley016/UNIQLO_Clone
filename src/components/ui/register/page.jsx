import { CalendarOutlined, LockOutlined, PhoneOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Checkbox, Form, Input, message, Radio } from 'antd';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axiosInstance from '../../../utils/axios';

const RegisterPage = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      console.log('Đang gửi yêu cầu đăng ký - Dữ liệu:', values);
      console.log('URL yêu cầu:', '/Customer'); // Log để kiểm tra URL

      // Tính tuổi từ birthdate
      const birthdate = values.birthdate ? new Date(values.birthdate) : null;
      const age = birthdate ? new Date().getFullYear() - birthdate.getFullYear() : 0;

      // Ánh xạ gender
      const gender = values.gender === 'male' ? 'Male' : values.gender === 'female' ? 'Female' : 'Undefined';

      // Chuẩn bị dữ liệu theo mô hình Users
      const registrationData = {
        customerName: values.customerName,
        email: values.email,
        password: values.password,
        age: age,
        gender: gender,
        phoneNumber: values.phoneNumber || undefined,
        role: 'User', // Đặt mặc định là User, vì Admin không được tạo qua endpoint này
        createdAt: new Date().toISOString(), // Đảm bảo định dạng thời gian
      };

      const response = await axiosInstance.post('/Customer', registrationData);

      const { Id: userId, Email: email } = response.data; // Giả định response trả về Id và Email
      console.log('Đăng ký thành công - ID:', userId, 'Email:', email);

      // Lưu thông tin vào localStorage (giả định token không được trả về từ endpoint này)
      localStorage.setItem('userEmail', email);
      localStorage.setItem('userId', userId); // Lưu ID nếu cần

      message.success('Đăng ký thành công!');
      navigate('/'); // Điều hướng về trang chủ
      window.dispatchEvent(new Event('loginStatusChanged'));
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Đăng ký thất bại. Vui lòng thử lại!';
      console.error('Lỗi đăng ký chi tiết:', error);
      message.error(errorMessage.includes('405') ? 'Yêu cầu không hợp lệ. Vui lòng kiểm tra endpoint.' : errorMessage);
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
          rules={[{ required: true, message: 'Vui lòng nhập tên!' }]}
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
          name="phoneNumber"
          rules={[{ required: true, message: 'Vui lòng nhập số điện thoại!' }]}
        >
          <Input
            prefix={<PhoneOutlined className="text-gray-400" />}
            placeholder="Số điện thoại"
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