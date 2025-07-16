import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../../utils/axios';

const CartPage = () => {
  const [cart, setCart] = useState([]);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [coupon, setCoupon] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [coupons, setCoupons] = useState([]);
  const navigate = useNavigate();

  // Lấy danh sách phiếu giảm giá từ localStorage
  useEffect(() => {
    const savedCoupons = localStorage.getItem('coupons');
    setCoupons(savedCoupons ? JSON.parse(savedCoupons) : []);
  }, []);

  // Lấy giỏ hàng từ localStorage và kiểm tra sản phẩm qua API
  useEffect(() => {
    const fetchCartProducts = async () => {
      const savedCart = localStorage.getItem('cart');
      const cartItems = savedCart ? JSON.parse(savedCart) : [];
      if (cartItems.length === 0) {
        setCart([]);
        return;
      }

      try {
        // Lấy thông tin sản phẩm từ API
        const productIds = cartItems.map((item) => item.id);
        const response = await axiosInstance.get('/Products', {
          params: { page: 1, pageSize: 100 }, // Lấy đủ sản phẩm
        });
        console.log('Products response for cart:', response.data);
        if (!response.data.items || !Array.isArray(response.data.items)) {
          throw new Error('Dữ liệu sản phẩm không hợp lệ');
        }

        // Kết hợp dữ liệu từ API với giỏ hàng
        const updatedCart = cartItems.map((cartItem) => {
          const product = response.data.items.find((p) => p.id === cartItem.id);
          return product
            ? {
                ...cartItem,
                name: product.name,
                price: product.price,
                image: product.images?.[0] || '/default-image.jpg',
                categoryId: product.categoryId,
              }
            : cartItem;
        });
        setCart(updatedCart);
        localStorage.setItem('cart', JSON.stringify(updatedCart));
      } catch (err) {
        console.error('Error fetching cart products:', err);
      }
    };

    fetchCartProducts();
  }, []);

  // Lấy sản phẩm liên quan dựa trên categoryId của giỏ hàng
  useEffect(() => {
    const fetchRelatedProducts = async () => {
      if (cart.length === 0) {
        setRelatedProducts([]);
        return;
      }

      try {
        const categoryIds = [...new Set(cart.map((item) => item.categoryId).filter(Boolean))];
        console.log('Fetching related products for categories:', categoryIds);
        const response = await axiosInstance.get('/Products', {
          params: { page: 1, pageSize: 100 }, // Lấy đủ sản phẩm
        });
        console.log('Products response for related:', response.data);
        if (!response.data.items || !Array.isArray(response.data.items)) {
          throw new Error('Dữ liệu sản phẩm không hợp lệ');
        }

        // Lọc sản phẩm liên quan theo categoryId, loại trừ sản phẩm trong giỏ
        const cartProductIds = cart.map((item) => item.id);
        const related = response.data.items
          .filter((product) => categoryIds.includes(product.categoryId) && !cartProductIds.includes(product.id))
          .sort(() => 0.5 - Math.random())
          .slice(0, 6); // Lấy tối đa 6 sản phẩm
        setRelatedProducts(related);
      } catch (err) {
        console.error('Error fetching related products:', err);
        setRelatedProducts([]);
      }
    };

    fetchRelatedProducts();
  }, [cart]);

  // Cập nhật số lượng sản phẩm
  const handleQuantityChange = (index, quantity) => {
    const updatedCart = [...cart];
    updatedCart[index].quantity = Math.max(1, parseInt(quantity, 10));
    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  // Xóa sản phẩm khỏi giỏ hàng
  const handleRemove = (index) => {
    const updatedCart = cart.filter((_, i) => i !== index);
    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  // Áp dụng phiếu giảm giá
  const handleApplyCoupon = () => {
    const foundCoupon = coupons.find((c) => c.code === coupon);
    if (foundCoupon) {
      setAppliedCoupon(foundCoupon);
      setCoupon('');
      alert(`Áp dụng mã ${foundCoupon.code} thành công!`);
    } else {
      alert('Mã giảm giá không hợp lệ!');
    }
  };

  // Tính tổng giá trị
  const calculateTotal = () => {
    let total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    if (appliedCoupon) {
      if (appliedCoupon.code === 'FREESHIP') {
        return total; // Giả sử phí vận chuyển là 0
      }
      const discountPercentage = parseInt(appliedCoupon.code.replace(/[^0-9]/g, '')) || 0;
      total -= (total * discountPercentage) / 100;
    }
    return total;
  };

  // Gửi đơn hàng tới API /Orders
  const handleCheckout = async () => {
    if (cart.length === 0) {
      alert('Giỏ hàng trống!');
      return;
    }

    try {
      const order = {
        customerID: 'customer-id', // Thay bằng ID khách hàng thực tế (từ đăng nhập hoặc form)
        customerPhone: '0123456789', // Thay bằng thông tin từ form
        customerAddress: '123 Đường ABC, TP.HCM', // Thay bằng thông tin từ form
        items: cart.map((item) => ({
          productId: item.id,
          colorId: item.selectedColorId,
          sizeId: item.selectedSizeId,
          quantity: item.quantity,
          categoryId: item.categoryId,
        })),
        status: 'pending',
      };

      const response = await axiosInstance.post('/Orders', order);
      console.log('Order response:', response.data);
      alert('Đặt hàng thành công! Mã đơn hàng: ' + response.data.orderId);

      // Xóa giỏ hàng sau khi đặt hàng
      setCart([]);
      localStorage.removeItem('cart');
      navigate('/order-history'); // Chuyển hướng tới lịch sử đơn hàng
    } catch (err) {
      console.error('Error placing order:', err);
      alert('Đã xảy ra lỗi khi đặt hàng: ' + err.message);
    }
  };

  const total = calculateTotal();

  if (cart.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-6">Giỏ hàng</h2>
        <div className="text-center py-8 text-gray-500">
          Không có sản phẩm nào trong giỏ hàng của bạn.
        </div>
        <button
          className="mt-4 bg-black text-white py-3 px-6 rounded hover:bg-gray-800 transition"
          onClick={() => navigate('/')}
        >
          Tiếp tục mua sắm
        </button>
        {/* Sản phẩm liên quan */}
        <div className="mt-12">
          <h2 className="text-xl font-bold mb-6 text-center">KHÁCH HÀNG KHÁC ĐÃ MUA</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {relatedProducts.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-lg p-4 shadow-sm group cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => navigate(`/product/${product.id}`)}
              >
                <div className="relative mb-3">
                  <img
                    src={product.images?.[0] || '/default-image.jpg'}
                    alt={product.name}
                    className="w-full h-48 object-cover rounded"
                  />
                  <button className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-red-500 text-lg">
                    ♡
                  </button>
                </div>
                <div className="flex gap-1 mb-2">
                  {product.variants?.slice(0, 4).map((variant, idx) => (
                    <span
                      key={idx}
                      className="w-4 h-4 rounded-full border border-gray-300"
                      style={{
                        backgroundColor: variant.colorId === 'COL00' ? '#000' : variant.colorId === 'COL01' ? '#fff' : '#ccc',
                      }}
                      title={variant.colorId}
                    ></span>
                  ))}
                </div>
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                  <span>{product.categoryId}</span>
                  <span>{product.id}</span>
                </div>
                <h3 className="text-sm font-medium mb-1 line-clamp-2">{product.name}</h3>
                <div className="font-semibold text-sm text-red-600 mb-1">
                  {product.price?.toLocaleString('vi-VN')} VND
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6">Giỏ hàng</h2>
      <div className="space-y-4">
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
              <div className="text-gray-500">Giá: {item.price.toLocaleString('vi-VN')} VND</div>
              <div className="flex items-center mt-2">
                <label className="mr-2">Số lượng:</label>
                <input
                  type="number"
                  min="1"
                  value={item.quantity}
                  onChange={(e) => handleQuantityChange(index, e.target.value)}
                  className="w-16 border rounded px-2 py-1"
                />
              </div>
            </div>
            <button
              onClick={() => handleRemove(index)}
              className="ml-4 text-red-500 hover:underline"
            >
              Xóa
            </button>
          </div>
        ))}
      </div>
      <div className="mt-6">
        <input
          type="text"
          value={coupon}
          onChange={(e) => setCoupon(e.target.value)}
          placeholder="Nhập mã giảm giá"
          className="border rounded px-3 py-2 w-full md:w-1/3"
        />
        <button
          onClick={handleApplyCoupon}
          className="mt-2 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition"
        >
          Áp dụng
        </button>
      </div>
      <div className="mt-6 text-right font-bold text-xl">
        Tổng cộng: {total.toLocaleString('vi-VN')} VND
      </div>
      <button
        onClick={() => navigate('/paymentprocess')}
        className="mt-4 w-full bg-black text-white py-3 rounded hover:bg-gray-800 transition"
      >
        Thanh toán
      </button>
      <button
        className="mt-2 w-full bg-gray-200 text-black py-3 rounded hover:bg-gray-300 transition"
        onClick={() => navigate('/paymentprocess')}
      >
        Tiếp tục mua sắm
      </button>
      <div className="mt-12">
        <h2 className="text-xl font-bold mb-6 text-center">KHÁCH HÀNG KHÁC ĐÃ MUA</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {relatedProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-lg p-4 shadow-sm group cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => navigate(`/product/${product.id}`)}
            >
              <div className="relative mb-3">
                <img
                  src={product.images?.[0] || '/default-image.jpg'}
                  alt={product.name}
                  className="w-full h-48 object-cover rounded"
                />
                <button className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-red-500 text-lg">
                  ♡
                </button>
              </div>
              <div className="flex gap-1 mb-2">
                {product.variants?.slice(0, 4).map((variant, idx) => (
                  <span
                    key={idx}
                    className="w-4 h-4 rounded-full border border-gray-300"
                    style={{
                      backgroundColor: variant.colorId === 'COL00' ? '#000' : variant.colorId === 'COL01' ? '#fff' : '#ccc',
                    }}
                    title={variant.colorId}
                  ></span>
                ))}
              </div>
              <div className="flex justify-between text-xs text-gray-500 mb-1">
                <span>{product.categoryId}</span>
                <span>{product.id}</span>
              </div>
              <h3 className="text-sm font-medium mb-1 line-clamp-2">{product.name}</h3>
              <div className="font-semibold text-sm text-red-600 mb-1">
                {product.price?.toLocaleString('vi-VN')} VND
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CartPage;