import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../../../utils/axios';

const CheckoutPage = () => {
  const [cart, setCart] = useState([]);
  const [coupons, setCoupons] = useState([]);
  const [selectedCoupon, setSelectedCoupon] = useState(null);
  const [shippingInfo, setShippingInfo] = useState({
    fullName: '',
    address: '',
    phone: '',
  });
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Lấy dữ liệu từ localStorage và chuẩn hóa
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    const savedCoupons = localStorage.getItem('coupons');
    const parsedCart = savedCart ? JSON.parse(savedCart) : [];
    // Chuẩn hóa cart để khớp với OrderItem
    const normalizedCart = parsedCart
      .map(item => ({
        ...item,
        productId: item.id || item.productId, // Chuyển id thành productId nếu cần
        selectedColorId: item.selectedColorId || item.colorId,
        selectedSizeId: item.selectedSizeId || item.sizeId,
        quantity: parseInt(item.quantity) || 1, // Đảm bảo quantity là số nguyên > 0
        name: item.name || 'Unknown Product',
        price: parseFloat(item.price) || 0,
        image: item.image || 'https://via.placeholder.com/150',
      }))
      .filter(item => 
        item.productId && 
        item.selectedColorId && 
        item.selectedSizeId && 
        item.quantity > 0 && 
        item.productId !== 'string' && 
        item.selectedColorId !== 'string' && 
        item.selectedSizeId !== 'string'
      ); // Loại bỏ item không hợp lệ
    setCart(normalizedCart);
    setCoupons(savedCoupons ? JSON.parse(savedCoupons) : []);
    console.log('Normalized cart:', JSON.stringify(normalizedCart, null, 2));
  }, []);

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

  // Tính tổng giá trị (tạm thời, vì backend tính giá cuối cùng)
  const calculateTotal = () => {
    let total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    if (selectedCoupon) {
      if (selectedCoupon.code === 'FREESHIP') {
        return total;
      }
      const discountPercentage = parseInt(selectedCoupon.code.replace(/[^0-9]/g, '')) || 0;
      total -= (total * discountPercentage) / 100;
    }
    return total;
  };

  // Xử lý xác nhận đơn hàng
  const handleConfirmOrder = async (e) => {
    e.preventDefault();
    setError(null);

    // Kiểm tra thông tin giao hàng
    if (!shippingInfo.fullName || !shippingInfo.address || !shippingInfo.phone) {
      setError('Vui lòng nhập đầy đủ thông tin giao hàng!');
      alert('Vui lòng nhập đầy đủ thông tin giao hàng!');
      return;
    }

    // Kiểm tra dữ liệu giỏ hàng
    if (cart.length === 0) {
      setError('Giỏ hàng trống!');
      alert('Giỏ hàng trống!');
      return;
    }

    for (const item of cart) {
      if (!item.productId || !item.selectedColorId || !item.selectedSizeId || item.quantity <= 0) {
        setError('Giỏ hàng chứa sản phẩm không hợp lệ!');
        alert('Giỏ hàng chứa sản phẩm không hợp lệ!');
        console.log('Invalid cart item:', item);
        return;
      }
    }

    // Chuẩn bị dữ liệu đơn hàng
    const order = {
      customerID: shippingInfo.fullName,
      customerPhone: shippingInfo.phone,
      customerAddress: shippingInfo.address,
      items: cart.map((item) => ({
        productId: item.productId,
        colorId: item.selectedColorId,
        sizeId: item.selectedSizeId,
        quantity: item.quantity,
      })),
      payingStatus: 'pending',
    };

    console.log('Sending order to backend:', JSON.stringify(order, null, 2));

    try {
      const response = await axiosInstance.post('/Orders', order);
      const result = response.data;

      localStorage.setItem('paypalOrderId', result.paypalOrderId);
      window.location.href = result.approveUrl;
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Lỗi khi đặt hàng';
      console.error('Order request failed:', err.response?.data || err);
      setError(errorMessage);
      alert(`Lỗi: ${errorMessage}`);
    }
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
      {error && <div className="text-red-500 mb-4">{error}</div>}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-xl font-semibold mb-4">Sản phẩm trong giỏ hàng</h3>
          {cart.map((item, index) => (
            <div key={index} className="flex items-center border-b pb-4">
              <img
                src={item.image || 'https://via.placeholder.com/150'}
                alt={item.name}
                className="w-20 h-20 object-cover rounded mr-4"
                onError={(e) => { e.target.src = 'https://via.placeholder.com/150'; }}
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
              <p className="text-gray-500">
                Bạn chưa có phiếu giảm giá nào. Hãy tham gia trò chơi trong{' '}
                <a href="/profile?section=coupons" className="text-blue-500 hover:underline">
                  Phiếu giảm giá
                </a>.
              </p>
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
        <div className="lg:col-span-1 sticky top-28 p-4 h-[calc(100vh-8rem)] overflow-y-auto">
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
              Thanh toán với PayPal
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