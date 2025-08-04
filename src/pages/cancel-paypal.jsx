import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function PaypalCancel() {
  const [isConfirmed, setIsConfirmed] = useState(false);
  const navigate = useNavigate();

  // Dữ liệu giả lập để hiển thị UI
  const mockOrder = {
    orderId: '6890d93531751d78e7792957',
    paypalOrderId: '74567507V36166420',
    payingStatus: 'pending',
    totalUSD: 16,
    totalVND: 399999,
    message: 'Order placed, waiting for PayPal approval',
  };

  // Hàm mô phỏng xác nhận (sẽ được thay bằng API khi backend deploy)
  const handleConfirm = () => {
    // Dữ liệu mẫu để thêm vào orderHistory
    const mockOrderHistory = {
      id: mockOrder.orderId,
      timestamp: new Date().toISOString(),
      paymentMethod: { method: 'Paypal' },
      shippingInfo: {
        fullName: 'Nguyen Van A',
        address: '123 Duong So 1, Q1, TP.HCM',
        phone: '0901234567',
      },
      items: [
        {
          image: '/default-image.jpg',
          name: 'Sản phẩm mẫu',
          ColorId: 'M1',
          SizeId: 'S',
          Quantity: 1,
        },
      ],
      Price: mockOrder.totalVND,
      status: 5, // Đã nhận
      coupon: null,
    };

    // Lưu vào localStorage (mô phỏng)
    const currentHistory = JSON.parse(localStorage.getItem('orderHistory') || '[]');
    const updatedHistory = [...currentHistory, mockOrderHistory];
    localStorage.setItem('orderHistory', JSON.stringify(updatedHistory));

    setIsConfirmed(true);
    alert('Thanh toán thành công và đơn hàng đã được lưu vào lịch sử!');
  };

  if (isConfirmed) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Thanh toán thành công!</h2>
        <p>Cảm ơn bạn đã mua sắm. Đơn hàng của bạn đã được lưu vào lịch sử.</p>
        <button
          onClick={() => navigate('/order-history')}
          className="mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition"
        >
          Xem lịch sử đơn hàng
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6">Chi tiết đơn hàng</h2>
      <div className="space-y-4">
        <p><strong>Mã đơn hàng:</strong> {mockOrder.orderId}</p>
        <p><strong>Mã PayPal:</strong> {mockOrder.paypalOrderId}</p>
        <p><strong>Trạng thái thanh toán:</strong> {mockOrder.payingStatus}</p>
        <p><strong>Tổng tiền (USD):</strong> {mockOrder.totalUSD} USD</p>
        <p><strong>Tổng tiền (VND):</strong> {mockOrder.totalVND.toLocaleString('vi-VN')} VND</p>
        <p><strong>Thông báo:</strong> {mockOrder.message}</p>
        <button
          onClick={handleConfirm}
          className="w-full bg-green-500 text-white py-3 rounded hover:bg-green-600 transition"
        >
          Cancel
        </button>
        <button
          onClick={() => navigate('/cart')}
          className="w-full bg-gray-200 text-black py-3 rounded hover:bg-gray-300 transition mt-2"
        >
          Quay lại giỏ hàng
        </button>
      </div>
    </div>
  );
}

export default PaypalCancel;