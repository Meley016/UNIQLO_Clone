import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axiosInstance from '../../../../utils/axios';

const PaypalCheckout = () => {
  const { state } = useLocation();
  const { cart, total } = state || { cart: [], total: 0 };
  const [shippingInfo, setShippingInfo] = useState({
    fullName: '',
    address: '',
    phone: '',
  });
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleShippingInfoChange = (e) => {
    const { name, value } = e.target;
    setShippingInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleConfirmOrder = async (e) => {
    e.preventDefault();
    setError(null);

    if (!shippingInfo.fullName || !shippingInfo.address || !shippingInfo.phone) {
      setError('Vui lòng nhập đầy đủ thông tin giao hàng!');
      alert('Vui lòng nhập đầy đủ thông tin giao hàng!');
      return;
    }

    if (cart.length === 0) {
      setError('Giỏ hàng trống!');
      alert('Giỏ hàng trống!');
      return;
    }

    try {
      const order = {
        customerID: shippingInfo.fullName,
        customerPhone: shippingInfo.phone,
        customerAddress: shippingInfo.address,
        price: total,
        items: cart.map((item) => ({
          productId: item.id,
          colorId: item.selectedColorId,
          sizeId: item.selectedSizeId,
          quantity: item.quantity,
          categoryId: item.categoryId,
        })),
        payingStatus: 'pending',
      };

      const response = await axiosInstance.post('/Orders', order);
      const { paypalOrderId, approveUrl } = response.data;

      if (approveUrl) {
        window.location.href = approveUrl; // Chuyển hướng đến PayPal
      } else {
        setError('Không thể tạo đơn hàng PayPal.');
        alert('Không thể tạo đơn hàng PayPal.');
      }
    } catch (err) {
      console.error('Error placing PayPal order:', err);
      setError('Đã xảy ra lỗi khi đặt hàng PayPal: ' + err.response?.data?.message || err.message);
      alert('Đã xảy ra lỗi khi đặt hàng PayPal: ' + err.message);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6">Thanh toán PayPal</h2>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Họ và tên</label>
          <input
            type="text"
            name="fullName"
            value={shippingInfo.fullName}
            onChange={handleShippingInfoChange}
            placeholder="Nhập họ và tên"
            className="w-full border rounded px-2 py-1"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Địa chỉ</label>
          <input
            type="text"
            name="address"
            value={shippingInfo.address}
            onChange={handleShippingInfoChange}
            placeholder="Nhập địa chỉ"
            className="w-full border rounded px-2 py-1"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Số điện thoại</label>
          <input
            type="tel"
            name="phone"
            value={shippingInfo.phone}
            onChange={handleShippingInfoChange}
            placeholder="Nhập số điện thoại"
            className="w-full border rounded px-2 py-1"
            required
          />
        </div>
        <button
          type="submit"
          onClick={handleConfirmOrder}
          className="w-full bg-blue-500 text-white py-3 rounded hover:bg-blue-600 transition"
        >
          Thanh toán với PayPal
        </button>
        <button
          onClick={() => navigate(-1)}
          className="w-full bg-gray-200 text-black py-3 rounded hover:bg-gray-300 transition mt-2"
        >
          Quay lại
        </button>
      </div>
    </div>
  );
};

export default PaypalCheckout;