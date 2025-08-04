import axios from 'axios';

const getBaseUrl = () => {
  return import.meta.env.VITE_API_URL || '/api';
};

const axiosInstance = axios.create({
  baseURL: getBaseUrl(),
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    // Chỉ thêm Authorization cho các endpoint yêu cầu xác thực (ví dụ: /Products, /Account/*)
    if (token && !config.url?.startsWith('/Colors') && !config.url?.startsWith('/Sizes')) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      console.error('Không có quyền truy cập. Vui lòng đăng nhập lại.');
      localStorage.removeItem('accessToken');
      localStorage.removeItem('tokenExpiryTime'); // Nếu có
      // window.location.href = '/login'; // Thêm chuyển hướng
    }
    console.error('Response error:', error);
    return Promise.reject(error.response?.data?.message || 'Đã xảy ra lỗi');
  }
);

export default axiosInstance;