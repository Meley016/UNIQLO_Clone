import React, { useState, useEffect } from 'react';
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/solid';

export default function OrderHistorySection() {
  const [orderHistory, setOrderHistory] = useState([]);
  const [selectedOrderId, setSelectedOrderId] = useState(null);

  // Các trạng thái đơn hàng
  const orderStatuses = [
    { step: 0, name: 'Chờ xác nhận', icon: '⏳' },
    { step: 1, name: 'Đã xác nhận', icon: '✅' },
    { step: 2, name: 'Đang đóng gói', icon: '📦' },
    { step: 3, name: 'Đang chuyển đến đơn vị vận chuyển', icon: '🚚' },
    { step: 4, name: 'Đang trên đường giao', icon: '🚛' },
    { step: 5, name: 'Đã nhận', icon: '🏠' },
  ];

  // Lấy dữ liệu từ localStorage
  useEffect(() => {
    const savedOrders = localStorage.getItem('orderHistory');
    if (savedOrders) {
      const orders = JSON.parse(savedOrders);
      // Mô phỏng trạng thái nếu chưa có (cho các đơn hàng cũ)
      const updatedOrders = orders.map((order) => ({
        ...order,
        status: order.status !== undefined ? order.status : Math.floor(Math.random() * 6), // Random status từ 0-5
      }));
      setOrderHistory(updatedOrders);
      localStorage.setItem('orderHistory', JSON.stringify(updatedOrders));
    }
  }, []);

  // Hiển thị timeline khi bấm theo dõi
  const handleTrackOrder = (orderId) => {
    setSelectedOrderId(orderId);
  };

  // Đóng modal
  const handleCloseModal = () => {
    setSelectedOrderId(null);
  };

  if (orderHistory.length === 0) {
    return (
      <div className="border p-6 rounded-lg shadow-sm">
        <h2 className="text-xl font-semibold mb-4">LỊCH SỬ ĐƠN HÀNG</h2>
        <p className="text-sm">Không có lịch sử đơn hàng để hiển thị.</p>
      </div>
    );
  }

  return (
    <div className="border p-6 rounded-lg shadow-sm">
      <h2 className="text-xl font-semibold mb-4">LỊCH SỬ ĐƠN HÀNG</h2>
      <div className="space-y-4">
        {orderHistory.map((order) => (
          <div key={order.id} className="border p-4 rounded">
            <p><strong>Mã đơn hàng:</strong> {order.id}</p>
            <p><strong>Thời gian:</strong> {order.timestamp}</p>
            <p>
              <strong>Phương thức thanh toán:</strong>{' '}
              {order.paymentMethod.method === 'ewallet'
                ? `Ví ${order.paymentMethod.data.walletType} - ${order.paymentMethod.data.phone}`
                : order.paymentMethod.method === 'bankcard'
                ? `Thẻ ****${order.paymentMethod.data.cardNumber.slice(-4)}`
                : `COD - ${order.paymentMethod.data.fullName}`}
            </p>
            <p>
              <strong>Thông tin giao hàng:</strong> {order.shippingInfo.fullName}, {order.shippingInfo.address},{' '}
              {order.shippingInfo.phone}
            </p>
            {order.coupon && (
              <p>
                <strong>Phiếu giảm giá:</strong> {order.coupon.code} - {order.coupon.description}
              </p>
            )}
            <p><strong>Tổng cộng:</strong> {order.total.toLocaleString('vi-VN')} VND</p>
            <div className="mt-2">
              <p className="font-semibold">Sản phẩm:</p>
              {order.items.map((item, index) => (
                <div key={index} className="flex items-center mt-2">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-12 h-12 object-cover rounded mr-2"
                  />
                  <div>
                    <p>{item.name}</p>
                    <p className="text-sm text-gray-500">
                      Màu sắc: {item.selectedColorId}, Kích cỡ: {item.selectedSizeId}, Số lượng:{' '}
                      {item.quantity}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <button
              onClick={() => handleTrackOrder(order.id)}
              className="mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition"
            >
              Theo dõi đơn hàng
            </button>
          </div>
        ))}
      </div>

      {/* Modal Timeline */}
      {selectedOrderId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h3 className="text-xl font-semibold mb-4">Theo dõi đơn hàng #{selectedOrderId}</h3>
            <div className="relative">
              <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-300"></div>
              {orderStatuses.map((status, index) => {
                const order = orderHistory.find((o) => o.id === selectedOrderId);
                const isActive = order && order.status >= status.step;
                return (
                  <div key={status.step} className="flex items-center mb-4 relative">
                    <div
                      className={`w-8 h-8 flex items-center justify-center rounded-full ${
                        isActive ? 'bg-blue-500 text-white' : 'bg-gray-300 text-black'
                      } z-10`}
                    >
                      {status.icon}
                    </div>
                    <div className="ml-4">
                      <p className={`font-medium ${isActive ? 'text-blue-500' : 'text-black'}`}>
                        {status.name}
                      </p>
                    </div>
                    {index < orderStatuses.length - 1 && (
                      <div
                        className={`absolute left-4 top-8 h-12 w-0.5 ${
                          isActive ? 'bg-blue-500' : 'bg-gray-300'
                        }`}
                      ></div>
                    )}
                  </div>
                );
              })}
            </div>
            <button
              onClick={handleCloseModal}
              className="mt-4 w-full bg-blue-500 text-white py-2 rounded hover:bg-white-600 transition"
            >
              Đóng
            </button>
          </div>
        </div>
      )}
    </div>
  );
}