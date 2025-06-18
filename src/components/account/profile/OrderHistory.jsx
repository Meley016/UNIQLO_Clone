import React, { useEffect, useState } from 'react';

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const savedOrders = JSON.parse(localStorage.getItem('orderHistory')) || [];
    setOrders(savedOrders);
  }, []);

  if (orders.length === 0) {
    return <p className="text-sm text-gray-500">Chưa có đơn hàng nào.</p>;
  }

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Lịch sử đơn hàng</h3>
      <div className="space-y-6">
        {orders.map((order) => (
          <div key={order.id} className="border p-4 rounded-lg">
            <p className="text-sm text-gray-700">🕓 Ngày đặt: {order.date}</p>
            <p className="text-sm font-medium mt-2">Tổng tiền: {order.total.toLocaleString('vi-VN')} VND</p>
            <ul className="mt-2 text-sm text-gray-600 list-disc pl-5">
              {order.items.map((item, idx) => (
                <li key={idx}>
                  {item.name} ({item.selectedColor} - {item.selectedSize}) × {item.quantity}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderHistory;
