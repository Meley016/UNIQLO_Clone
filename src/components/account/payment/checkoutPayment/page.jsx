import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const CheckoutPage = () => {
  const [cart, setCart] = useState([]);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [coupons, setCoupons] = useState([]);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
  const [selectedCoupon, setSelectedCoupon] = useState(null);
  const [shippingInfo, setShippingInfo] = useState({
    fullName: '',
    address: '',
    phone: '',
  });
  const navigate = useNavigate();

  // Lấy dữ liệu từ localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    const savedPaymentMethods = localStorage.getItem('paymentData');
    const savedCoupons = localStorage.getItem('coupons');
    setCart(savedCart ? JSON.parse(savedCart) : []);
    setPaymentMethods(savedPaymentMethods ? JSON.parse(savedPaymentMethods) : []);
    setCoupons(savedCoupons ? JSON.parse(savedCoupons) : []);
  }, []);

  // Xử lý thay đổi phương thức thanh toán và tự động điền thông tin COD
  const handlePaymentMethodChange = (e) => {
    const methodId = e.target.value;
    setSelectedPaymentMethod(methodId);

    if (methodId) {
      const selectedMethod = paymentMethods.find((method) => method.id === parseInt(methodId));
      if (selectedMethod && selectedMethod.method === 'cod') {
        setShippingInfo({
          fullName: selectedMethod.data.fullName || '',
          address: selectedMethod.data.address || '',
          phone: selectedMethod.data.phone || '',
        });
      } else {
        setShippingInfo({
          fullName: '',
          address: '',
          phone: '',
        });
      }
    } else {
      setShippingInfo({
        fullName: '',
        address: '',
        phone: '',
      });
    }
  };

  // Xử lý thay đổi thông tin giao hàng
  const handleShippingInfoChange = (e) => {
    const { name, value } = e.target;
    setShippingInfo((prev) => ({ ...prev, [name]: value }));
  };

  // Xử lý chọn phiếu giảm giá
  const handleSelectCoupon = (couponId) => {
    const foundCoupon = coupons.find((c) => c.id === parseInt(couponId));
    setSelectedCoupon(foundCoupon || null);
    if (foundCoupon) {
      alert(`Áp dụng mã ${foundCoupon.code} thành công!`);
    } else {
      alert('Đã hủy áp dụng mã giảm giá!');
    }
  };

  // Tính tổng giá trị
  const calculateTotal = () => {
    let total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    if (selectedCoupon) {
      if (selectedCoupon.code === 'FREESHIP') {
        return total; // Giả sử không tính phí vận chuyển
      }
      const discountPercentage = parseInt(selectedCoupon.code.replace(/[^0-9]/g, '')) || 0;
      total -= (total * discountPercentage) / 100;
    }
    return total;
  };

  // Xử lý xác nhận đơn hàng
  const handleConfirmOrder = (e) => {
    e.preventDefault();
    if (!selectedPaymentMethod) {
      alert('Vui lòng chọn phương thức thanh toán!');
      return;
    }
    if (!shippingInfo.fullName || !shippingInfo.address || !shippingInfo.phone) {
      alert('Vui lòng nhập đầy đủ thông tin giao hàng!');
      return;
    }

    const selectedMethod = paymentMethods.find((method) => method.id === parseInt(selectedPaymentMethod));
    if (!selectedMethod) {
      alert('Phương thức thanh toán không hợp lệ!');
      return;
    }

    // Tạo đơn hàng
    const order = {
      id: Date.now(),
      items: cart,
      total: calculateTotal(),
      paymentMethod: selectedMethod,
      shippingInfo,
      coupon: selectedCoupon,
      timestamp: new Date().toISOString(),
    };

    // Lưu đơn hàng vào localStorage
    const orderHistory = JSON.parse(localStorage.getItem('orderHistory')) || [];
    orderHistory.push(order);
    localStorage.setItem('orderHistory', JSON.stringify(orderHistory));

    // Xóa giỏ hàng và phiếu giảm giá đã sử dụng
    localStorage.setItem('cart', JSON.stringify([]));
    if (selectedCoupon) {
      const updatedCoupons = coupons.filter((c) => c.id !== selectedCoupon.id);
      localStorage.setItem('coupons', JSON.stringify(updatedCoupons));
      setCoupons(updatedCoupons);
      setSelectedCoupon(null);
    }

    alert('Đơn hàng đã được đặt thành công!');
    navigate('/profile?section=orderHistory');
  };

  const total = calculateTotal();

  if (cart.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-6">Thanh toán</h2>
        <div className="text-center py-8 text-gray-500">
          Giỏ hàng của bạn trống. Vui lòng thêm sản phẩm để tiếp tục.
        </div>
        <button
          className="mt-4 bg-black text-white py-3 px-6 rounded hover:bg-gray-800 transition"
          onClick={() => navigate('/')}
        >
          Tiếp tục mua sắm
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6">Thanh toán</h2>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Thông tin giỏ hàng */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-xl font-semibold mb-4">Sản phẩm trong giỏ hàng</h3>
          {cart.map((item, index) => (
            <div key={index} className="flex items-center border-b pb-4">
              <img
                src={item.image}
                alt={item.name}
                className="w-20 h-20 object-cover rounded mr-4"
              />
              <div className="flex-1">
                <div className="font-semibold">{item.name}</div>
                <div className="text-gray-500">Màu sắc: {item.selectedColorId}</div>
                <div className="text-gray-500">Kích cỡ: {item.selectedSizeId}</div>
                <div className="text-gray-500">
                  Giá: {(item.price * item.quantity).toLocaleString('vi-VN')} VND (x{item.quantity})
                </div>
              </div>
            </div>
          ))}
          <div className="mt-6">
            <h3 className="text-xl font-semibold mb-2">Phiếu giảm giá</h3>
            {coupons.length === 0 ? (
              <p className="text-gray-500">Bạn chưa có phiếu giảm giá nào. Hãy tham gia trò chơi trong <a href="/profile?section=coupons" className="text-blue-500 hover:underline">Phiếu giảm giá</a>.</p>
            ) : (
              <div className="flex items-center gap-2">
                <select
                  value={selectedCoupon ? selectedCoupon.id : ''}
                  onChange={(e) => handleSelectCoupon(e.target.value)}
                  className="w-full border rounded px-2 py-1"
                >
                  <option value="">Chọn phiếu giảm giá</option>
                  {coupons.map((coupon) => (
                    <option key={coupon.id} value={coupon.id}>
                      {coupon.code} - {coupon.description}
                    </option>
                  ))}
                </select>
                {selectedCoupon && (
                  <button
                    onClick={() => handleSelectCoupon('')}
                    className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition"
                  >
                    Hủy
                  </button>
                )}
              </div>
            )}
            {selectedCoupon && (
              <p className="text-green-600 mt-2">
                Đã áp dụng mã {selectedCoupon.code}: {selectedCoupon.description}
              </p>
            )}
          </div>
          <div className="mt-4 text-right font-bold text-xl">
            Tổng cộng: {total.toLocaleString('vi-VN')} VND
          </div>
        </div>

        {/* Thông tin thanh toán và giao hàng */}
        <div className="lg:col-span-1 sticky top-28 p-4 h-[calc(100vh-8rem)] overflow-y-auto">
          <h3 className="text-xl font-semibold mb-4">Thông tin thanh toán</h3>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Phương thức thanh toán:</label>
            {paymentMethods.length === 0 ? (
              <p className="text-gray-500">
                Chưa có phương thức thanh toán nào. Vui lòng thêm trong{' '}
                <a href="/profile?section=cards" className="text-blue-500 hover:underline">
                  Thẻ của tôi
                </a>.
              </p>
            ) : (
              <select
                value={selectedPaymentMethod}
                onChange={handlePaymentMethodChange}
                className="w-full border rounded px-2 py-1"
              >
                <option value="">Chọn phương thức</option>
                {paymentMethods.map((method) => (
                  <option key={method.id} value={method.id}>
                    {method.method === 'ewallet'
                      ? `Ví ${method.data.walletType} - ${method.data.phone}`
                      : method.method === 'bankcard'
                      ? `Thẻ ****${method.data.cardNumber.slice(-4)}`
                      : `COD - ${method.data.fullName}`}
                  </option>
                ))}
              </select>
            )}
          </div>
          <h3 className="text-xl font-semibold mb-4">Thông tin giao hàng</h3>
          <form className="space-y-4" onSubmit={handleConfirmOrder}>
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
              className="w-full bg-black text-white py-3 rounded hover:bg-gray-800 transition"
            >
              Xác nhận đơn hàng
            </button>
            <button
              type="button"
              onClick={() => navigate('/')}
              className="w-full bg-gray-200 text-black py-3 rounded hover:bg-gray-300 transition mt-2"
            >
              Tiếp tục mua sắm
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;