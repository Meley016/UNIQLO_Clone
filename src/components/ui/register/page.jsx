import React, { useState } from 'react';
import { Button, Form, Input, message } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import axios from 'axios';

// Thêm interceptor để tự động gắn token vào header của các request
axios.interceptors.request.use(config => {
    const token = localStorage.getItem('accessToken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, error => Promise.reject(error));

const RegisterPage = () => {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const onFinish = async (values) => {
        setLoading(true);
        try {
            const response = await axios.post('http://localhost:5171/api/register', {
                Email: values.email, // Khớp với yêu cầu backend
                Password: values.password
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            const { Email, AccessToken, ExpriesIn } = response.data; // Khớp với LoginResponseModel
            console.log('Đăng ký thành công:', { Email, AccessToken, ExpriesIn });

            // Lưu token và email vào localStorage
            localStorage.setItem('accessToken', AccessToken);
            localStorage.setItem('userEmail', Email);
            localStorage.setItem('tokenExpiresIn', ExpriesIn);
            localStorage.setItem('loginTime', Date.now());

            message.success('Đăng ký thành công!');
            navigate('/'); // Điều hướng về trang chủ
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Đăng ký thất bại. Vui lòng thử lại!';
            message.error(errorMessage);
            console.error('Lỗi đăng ký:', error);
        } finally {
            setLoading(false);
        }
    };

    const onFinishFailed = (errorInfo) => {
        console.log('Form validation failed:', errorInfo);
        message.error('Vui lòng điền đầy đủ thông tin!');
    };

    return (
        <div className="bg-white p-4 rounded-lg w-full max-w-xs shadow-md">
            <Form
                name="register"
                labelCol={{ span: 0 }}
                wrapperCol={{ span: 24 }}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
                disabled={loading}
                className="space-y-3"
            >
                <Form.Item
                    name="email"
                    rules={[{ required: true, message: 'Vui lòng nhập email!', type: 'email' }]}
                >
                    <Input
                        prefix={<UserOutlined className="text-gray-400" />}
                        placeholder="Email"
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
                        placeholder="Mật khẩu"
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
                <Form.Item>
                    <Button
                        type="primary"
                        htmlType="submit"
                        size="large"
                        block
                        loading={loading}
                        className="bg-[#0066cc] hover:bg-[#005bb5] rounded-sm py-2 text-white font-medium"
                    >
                        Đăng ký
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