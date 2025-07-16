import axios from 'axios';

// Hàm lấy base URL với fallback
const getBaseUrl = () => {
  return import.meta.env.VITE_API_URL || '/api'; // Sử dụng biến môi trường hoặc fallback
};

// Tạo instance Axios
const axiosInstance = axios.create({
  baseURL: getBaseUrl(),
  timeout: 30000, // Tăng timeout lên 30 giây
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor cho yêu cầu
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Interceptor cho phản hồi
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      console.error('Không có quyền truy cập. Vui lòng đăng nhập lại.');
      // window.location.href = '/login';
    }
    console.error('Response error:', error);
    return Promise.reject(error.response?.data?.message || 'Đã xảy ra lỗi');
  }
);

export default axiosInstance;