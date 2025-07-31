import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axiosInstance from '../utils/axios'; // Adjust the import path as necessary

const PayPalRedirect = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('Đang xử lý thanh toán...');
  const [error, setError] = useState(null);

  useEffect(() => {
    const handlePayPalCallback = async () => {
      const token = searchParams.get('token'); // ID
      const cancel = searchParams.get('cancel'); // Ktra trạng thái

      if (!token) {
        setError('Không tìm thấy PayPal order ID.');
        setStatus('Lỗi xử lý thanh toán.');
        return;
      }

      const paypalOrderId = localStorage.getItem('paypalOrderId');
      if (!paypalOrderId || paypalOrderId !== token) {
        setError('PayPal order ID không hợp lệ.');
        setStatus('Lỗi xử lý thanh toán.');
        return;
      }

      try {
        if (cancel) {
          const response = await axiosInstance.post('/Orders/cancel', paypalOrderId, {
            headers: { 'Content-Type': 'application/json' },
          });
          setStatus('Thanh toán đã bị hủy.');
          localStorage.removeItem('paypalOrderId');
          localStorage.setItem('cart', JSON.stringify([])); // Xóa giỏ hàng
          setTimeout(() => navigate('/'), 3000); // Chuyển hướng về trang chủ
        } else {
          const response = await axiosInstance.post('/Orders/capture', paypalOrderId, {
            headers: { 'Content-Type': 'application/json' },
          });
          setStatus('Thanh toán thành công!');
          localStorage.removeItem('paypalOrderId');
          localStorage.setItem('cart', JSON.stringify([])); // Xóa giỏ hàng
          localStorage.setItem('coupons', JSON.stringify([])); // Xóa phiếu giảm giá
          setTimeout(() => navigate('/profile?section=orderHistory'), 3000);
        }
      } catch (err) {
        const errorMessage = err.response?.data?.message || err.message || 'Lỗi xử lý thanh toán';
        setError(errorMessage);
        setStatus('Lỗi xử lý thanh toán.');
        console.error('PayPal callback error:', err);
      }
    };

    handlePayPalCallback();
  }, [searchParams, navigate]);

  return (
    <div className="container mx-auto px-4 py-8 text-center">
      <h2 className="text-2xl font-bold mb-4">Xử lý thanh toán PayPal</h2>
      <p className="text-lg">{status}</p>
      {error && <p className="text-red-500 mt-4">{error}</p>}
      <p className="text-gray-500 mt-2">Bạn sẽ được chuyển hướng trong giây lát...</p>
    </div>
  );
};

export default PayPalRedirect;