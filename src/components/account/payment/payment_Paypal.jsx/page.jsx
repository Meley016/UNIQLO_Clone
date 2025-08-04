import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axiosInstance from '../../../../utils/axios';

const PaypalCheckout = () => {
  const { state } = useLocation();
  const { cart, total, selectedAddress, orderData } = state || { cart: [], total: 0, selectedAddress: null, orderData: {} };
  const [shippingInfo, setShippingInfo] = useState({
    fullName: selectedAddress?.fullName || '',
    address: selectedAddress?.address || '',
    phone: selectedAddress?.phone || '',
  });
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Lấy _id từ storage
  const getUserIdFromStorage = () => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        console.log('Token payload:', payload);
        return payload.nameid || null;
      } catch (e) {
        console.error('Lỗi khi phân tích token:', e);
        setError('Lỗi khi phân tích token. Vui lòng đăng nhập lại!');
        return null;
      }
    }
    const storedId = localStorage.getItem('_id');
    if (storedId) {
      console.log('Sử dụng _id từ storage:', storedId);
      return storedId;
    }
    console.log('Không tìm thấy token hoặc _id trong localStorage');
    setError('Không tìm thấy thông tin người dùng. Vui lòng đăng nhập lại!');
    return null;
  };

  useEffect(() => {
    const userId = getUserIdFromStorage();
    if (!userId) {
      alert('Vui lòng đăng nhập để đặt hàng!');
      navigate('/login');
    }
  }, [navigate]);

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

    const customerId = getUserIdFromStorage();
    if (!customerId) {
      setError('Vui lòng đăng nhập để đặt hàng!');
      alert('Vui lòng đăng nhập để đặt hàng!');
      navigate('/login');
      return;
    }

    try {
      const order = {
        customerId,
        customerPhone: shippingInfo.phone,
        customerAddress: shippingInfo.address,
        items: cart.map((item) => ({
          productId: item.id,
          colorId: item.selectedColorId,
          sizeId: item.selectedSizeId,
          quantity: item.quantity,
          categoryId: item.categoryId,
          price: item.price, // Đảm bảo gửi giá thực tế
        })),
        payingStatus: 'pending',
      };

      console.log('Sending order:', order);
      const response = await axiosInstance.post('/Orders', order, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`, // Đảm bảo gửi token
        },
      });
      console.log('Response:', response.data);

      const { approveUrl, message, orderId, paypalOrderId, totalUSD, totalVND } = response.data;

      if (approveUrl && paypalOrderId) {
        // Lưu thông tin đơn hàng để sử dụng trong bước tiếp theo
        navigate('/capture-paypal', {
          state: {
            orderId,
            paypalOrderId,
            payingStatus: 'pending',
            totalUSD,
            totalVND,
            message,
          },
        });
        // Chuyển hướng đến PayPal để phê duyệt
        window.location.href = approveUrl;
      } else {
        setError('Không thể tạo đơn hàng PayPal hoặc thông tin không đầy đủ.');
        alert('Không thể tạo đơn hàng PayPal hoặc thông tin không đầy đủ.');
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Đã xảy ra lỗi khi đặt hàng PayPal: ' + err.message;
      console.error('Error placing PayPal order:', err.response ? err.response.data : err.message);
      setError(errorMessage);
      alert(errorMessage);
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