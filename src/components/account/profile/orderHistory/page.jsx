import { useEffect, useState } from 'react';
import axiosInstance from '../../../../utils/axios';

export default function OrderHistorySection() {
  const [orderHistory, setOrderHistory] = useState([]);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const userId = 'user123'; // Giả lập userId, thay bằng token nếu có

  // Các trạng thái đơn hàng
  const orderStatuses = [
    { step: 0, name: 'Chờ xác nhận', icon: '⏳' },
    { step: 1, name: 'Đã xác nhận', icon: '✅' },
    { step: 2, name: 'Đang đóng gói', icon: '📦' },
    { step: 3, name: 'Đang chuyển đến đơn vị vận chuyển', icon: '🚚' },
    { step: 4, name: 'Đang trên đường giao', icon: '🚛' },
    { step: 5, name: 'Đã nhận', icon: '🏠' },
  ];

  // Lấy dữ liệu từ API và localStorage
  useEffect(() => {
    const fetchOrderHistory = async () => {
      try {
        const response = await axiosInstance.get(`/Orders/user/${userId}`, { params: { page: 1, pageSize: 10 } });
        if (response.data.orders && Array.isArray(response.data.orders)) {
          const orders = response.data.orders.map((order) => ({
            ...order,
            timestamp: order.CreatedAt,
            paymentMethod: { method: order.PayingMethod || 'COD' }, // Lấy từ backend
            shippingInfo: {
              fullName: order.CustomerName || order.CustomerId, // Điều chỉnh theo backend
              address: order.CustomerAddress,
              phone: order.CustomerPhone,
            },
            items: order.Items.map((item) => ({
              ...item,
              image: '/default-image.jpg', // Giả lập, cần lấy từ sản phẩm
              name: item.ProductName || 'Unknown Product',
            })),
            Price: order.TotalAmount || 0, // Lấy từ backend
          }));
          setOrderHistory(orders);
          localStorage.setItem('orderHistory', JSON.stringify(orders));
        } else {
          throw new Error('Dữ liệu lịch sử đơn hàng không hợp lệ');
        }
      } catch (err) {
        console.error('Error fetching order history:', err);
        const savedOrders = localStorage.getItem('orderHistory');
        if (savedOrders) {
          setOrderHistory(JSON.parse(savedOrders));
        }
      }
    };
    fetchOrderHistory();
  }, [userId]);

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
            <p><strong>Thời gian:</strong> {new Date(order.timestamp).toLocaleString('vi-VN')}</p>
            <p>
              <strong>Phương thức thanh toán:</strong>{' '}
              {order.paymentMethod.method === 'COD'
                ? `COD - ${order.shippingInfo.fullName}`
                : order.paymentMethod.method === 'Paypal'
                ? 'PayPal'
                : 'Unknown'}
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
            <p><strong>Tổng cộng:</strong> {order.Price.toLocaleString('vi-VN')} VND</p>
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
                      Màu sắc: {item.ColorId}, Kích cỡ: {item.SizeId}, Số lượng: {item.Quantity}
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
                const isActive = order && (order.status || 0) >= status.step; // Sử dụng status từ order
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
              className="mt-4 w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition"
            >
              Đóng
            </button>
          </div>
        </div>
      )}
    </div>
  ); 
}