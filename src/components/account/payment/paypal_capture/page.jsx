import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axiosInstance from '../../../../utils/axios'; // Điều chỉnh đường dẫn theo cấu trúc dự án

const CapturePaypal = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const captureOrder = async () => {
      const paypalOrderId = state?.paypalOrderId; // Lấy paypalOrderId từ state

      if (!paypalOrderId) {
        setError('Không tìm thấy ID đơn hàng PayPal.');
        return;
      }

      try {
        const response = await axiosInstance.post('/Orders/capture', paypalOrderId, {
          headers: {
            'Content-Type': 'application/json',
          },
        });
        console.log('Capture response:', response.data);
        setMessage('Thanh toán thành công! Đang chuyển hướng...');
        setTimeout(() => navigate('/payment-success'), 2000); // Chuyển hướng sau 2 giây
      } catch (err) {
        console.error('Error capturing PayPal order:', err.response ? err.response.data : err);
        setError('Đã xảy ra lỗi khi xác nhận thanh toán: ' + (err.response?.data?.message || 'Vui lòng thử lại'));
      }
    };

    captureOrder();
  }, [state, navigate]);

  return (
    <div className="container mx-auto px-4 py-8 text-center">
      <h2 className="text-2xl font-bold mb-6">Xác nhận thanh toán PayPal</h2>
      {message && <div className="text-green-500 mb-4">{message}</div>}
      {error && <div className="text-red-500 mb-4">{error}</div>}
      <p>Đang xử lý thanh toán, vui lòng đợi...</p>
    </div>
  );
};

export default CapturePaypal;