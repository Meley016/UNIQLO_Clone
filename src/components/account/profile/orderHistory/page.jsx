import { useEffect, useState } from 'react';

export default function OrderHistorySection() {
  const [orderHistory, setOrderHistory] = useState([]);
  const [selectedOrderId, setSelectedOrderId] = useState(null);

  // Lấy userId từ storage
  const getUserIdFromStorage = () => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        console.log('Token payload:', payload);
        return payload.nameid || null;
      } catch (e) {
        console.error('Lỗi khi phân tích token:', e);
        return null;
      }
    }
    const storedId = localStorage.getItem('_id');
    if (storedId) {
      console.log('Sử dụng _id từ storage:', storedId);
      return storedId;
    }
    console.log('Không tìm thấy token hoặc _id trong localStorage');
    return null;
  };

  const userId = getUserIdFromStorage();

  // Lấy thông tin user từ localStorage
  const getUserInfo = () => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return {
      CustomerName: user.CustomerName || 'Unknown',
      PhoneNumber: user.PhoneNumber || '0901234567',
    };
  };

  const userInfo = getUserInfo();

  // Các trạng thái đơn hàng
  const orderStatuses = [
    { step: 0, name: 'Chờ xác nhận', icon: '⏳', status: 'pending' },
    { step: 1, name: 'Đã xác nhận', icon: '✅', status: 'confirmed' },
    { step: 2, name: 'Đang đóng gói', icon: '📦', status: 'packaging' },
    { step: 3, name: 'Đang chuyển đến đơn vị vận chuyển', icon: '🚚', status: 'shipping' },
    { step: 4, name: 'Đang trên đường giao', icon: '🚛', status: 'delivering' },
    { step: 5, name: 'Đã nhận', icon: '🏠', status: 'delivered' },
  ];

  // Lấy cart từ localStorage và tạo orderHistory
  useEffect(() => {
    if (!userId) {
      console.log('Không tìm thấy userId, không thể tạo lịch sử đơn hàng.');
      return;
    }

    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    if (cart.length > 0) {
      // Tạo orderHistory từ cart
      const newOrder = {
        id: `ORDER-${Date.now()}`,
        CustomerID: userId,
        CustomerPhone: userInfo.PhoneNumber,
        CustomerAddress: '123 Duong So 1, Q1, TP.HCM', // Giả lập, cần lấy từ addresses
        payingStatus: 'pending',
        deliveryStatus: 'pending',
        CreatedAt: new Date().toISOString(),
        items: cart.map((item) => ({
          ProductId: item.id,
          ColorId: item.selectedColorId,
          SizeId: item.selectedSizeId,
          Quantity: item.quantity,
          CategoryId: item.categoryId,
        })),
        Price: cart.reduce((sum, item) => sum + (item.price || 0) * item.quantity, 0),
        PayPalOrderId: null,
      };

      const currentHistory = JSON.parse(localStorage.getItem('orderHistory') || '[]');
      const updatedHistory = [newOrder, ...currentHistory];
      setOrderHistory(updatedHistory);
      localStorage.setItem('orderHistory', JSON.stringify(updatedHistory));
    } else {
      const savedOrders = JSON.parse(localStorage.getItem('orderHistory') || '[]');
      setOrderHistory(savedOrders);
    }
  }, [userId]);

  // Hiển thị timeline khi bấm theo dõi
  const handleTrackOrder = (orderId) => {
    setSelectedOrderId(orderId);
  };

  // Đóng modal
  const handleCloseModal = () => {
    setSelectedOrderId(null);
  };

  // Xác định trạng thái hiện tại của đơn hàng
  const getOrderStatusStep = (order) => {
    if (order.payingStatus === 'cancelled') return -1;
    if (order.deliveryStatus === 'delivered') return 5;
    if (order.deliveryStatus === 'delivering') return 4;
    if (order.deliveryStatus === 'shipping') return 3;
    if (order.payingStatus === 'paid') return 2;
    return 0;
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
            <p><strong>Thời gian:</strong> {new Date(order.CreatedAt).toLocaleString('vi-VN')}</p>
            <p>
              <strong>Phương thức thanh toán:</strong>{' '}
              {order.PayPalOrderId ? 'PayPal' : 'COD'}
            </p>
            <p>
              <strong>Thông tin giao hàng:</strong> {userInfo.CustomerName}, {order.CustomerAddress},{' '}
              {order.CustomerPhone}
            </p>
            <p><strong>Tổng cộng:</strong> {order.Price.toLocaleString('vi-VN')} VND</p>
            <div className="mt-2">
              <p className="font-semibold">Sản phẩm:</p>
              {order.items.map((item, index) => {
                const cartItem = JSON.parse(localStorage.getItem('cart') || '[]').find(
                  (c) => c.id === item.ProductId
                );
                return (
                  <div key={index} className="flex items-center mt-2">
                    <img
                      src={cartItem?.image || '/default-image.jpg'}
                      alt={cartItem?.name || 'Unknown Product'}
                      className="w-12 h-12 object-cover rounded mr-2"
                    />
                    <div>
                      <p>{cartItem?.name || 'Unknown Product'}</p>
                      <p className="text-sm text-gray-500">
                        Màu sắc: {item.ColorId}, Kích cỡ: {item.SizeId}, Số lượng: {item.Quantity}
                      </p>
                    </div>
                  </div>
                );
              })}
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
                const currentStep = getOrderStatusStep(order);
                const isActive = currentStep >= status.step;
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