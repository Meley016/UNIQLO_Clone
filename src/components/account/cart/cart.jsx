import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
const CartPage = () => {
  const [cart, setCart] = useState([]);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [isCartLoaded, setIsCartLoaded] = useState(false); // Thêm flag để theo dõi
  const navigate = useNavigate();
const handleCheckout = () => {
  if (cart.length === 0) return;

  // Lấy lịch sử đơn hàng hiện tại (nếu có)
  const existingOrders = JSON.parse(localStorage.getItem('orderHistory')) || [];

  // Tạo đơn hàng mới
  const newOrder = {
    id: Date.now(),
    items: cart,
    total: total,
    date: new Date().toLocaleString(),
  };

  // Lưu vào lịch sử
  const updatedOrders = [...existingOrders, newOrder];
  localStorage.setItem('orderHistory', JSON.stringify(updatedOrders));

  // Xóa giỏ hàng
  localStorage.removeItem('cart');
  setCart([]);

  alert('Thanh toán thành công! Đơn hàng đã được lưu.');
  navigate('/');
};

  // Load giỏ hàng từ localStorage khi component mount
  useEffect(() => {
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
      setCart(JSON.parse(storedCart));
    }
    setIsCartLoaded(true); // Đánh dấu đã load xong
  }, []);

  // Lưu giỏ hàng vào localStorage khi cart thay đổi (chỉ sau khi đã load)
  useEffect(() => {
    if (isCartLoaded) { // Chỉ lưu khi đã load xong
      localStorage.setItem('cart', JSON.stringify(cart));
    }
  }, [cart, isCartLoaded]);

  // Lấy sản phẩm liên quan từ fake API
  useEffect(() => {
    axios.get('/fake_api.json')
      .then(res => {
        const shuffled = res.data.sort(() => 0.5 - Math.random());
        setRelatedProducts(shuffled.slice(0, 6));
      });
  }, []);

  // Cập nhật số lượng sản phẩm
  const handleQuantityChange = (productId, selectedColor, selectedSize, quantity) => {
    const updatedCart = cart.map(item =>
      (item.id === productId && item.selectedColor === selectedColor && item.selectedSize === selectedSize)
        ? { ...item, quantity: Math.max(1, quantity) }
        : item
    );
    setCart(updatedCart);
  };

  // Xóa sản phẩm khỏi giỏ hàng
  const handleRemove = (productId, selectedColor, selectedSize) => {
    const updatedCart = cart.filter(item => 
      !(item.id === productId && item.selectedColor === selectedColor && item.selectedSize === selectedSize)
    );
    setCart(updatedCart);
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // --- Giao diện ---
  if (cart.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-6">Giỏ hàng</h2>
        <div className="text-center py-8 text-gray-500">Không có sản phẩm nào trong giỏ hàng của bạn.</div>
        <button
          className="mt-4 bg-black text-white py-3 px-6 rounded hover:bg-gray-800 transition"
          onClick={() => navigate('/')}
        >
          Tiếp tục mua sắm
        </button>

        {/* KHÁCH HÀNG KHÁC ĐÃ MUA */}
        <RelatedProductSection relatedProducts={relatedProducts} />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Phần giỏ hàng - 2/3 màn hình */}
        <div className="lg:col-span-2">
          <h2 className="text-2xl font-bold mb-6">GIỎ HÀNG</h2>
          
          <div className="space-y-4">
            {cart.map(item => (
              <div key={`${item.id}-${item.selectedColor}-${item.selectedSize}`} className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-start gap-4">
                  {/* Hình ảnh sản phẩm */}
                  <div className="w-24 h-32 bg-gray-200 rounded flex-shrink-0">
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="w-full h-full object-cover rounded" 
                    />
                  </div>
                  
                  {/* Thông tin sản phẩm */}
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-lg mb-1">{item.name}</h3>
                        <p className="text-sm text-gray-600 mb-2">Màu sắc: {item.selectedColor}</p>
                        <p className="text-sm text-gray-600 mb-2">Kích cỡ: {item.selectedSize}</p>
                        <p className="text-sm text-gray-600 mb-3">Vớ cổ: Sản phẩm được tặng kèm với tất cả các đơn hàng</p>
                        <p className="font-semibold text-lg">{item.price.toLocaleString('vi-VN')} VND</p>
                      </div>
                      
                      {/* Nút xóa */}
                      <button
                        onClick={() => handleRemove(item.id, item.selectedColor, item.selectedSize)}
                        className="text-gray-400 hover:text-gray-600 text-xl"
                      >
                        ×
                      </button>
                    </div>
                    
                    {/* Số lượng */}
                    <div className="mt-4">
                      <label className="block text-sm font-medium mb-2">SỐ LƯỢNG</label>
                      <div className="flex items-center">
                        <select
                          value={item.quantity}
                          onChange={e => handleQuantityChange(item.id, item.selectedColor, item.selectedSize, parseInt(e.target.value, 10))}
                          className="border border-gray-300 rounded px-3 py-1 bg-white min-w-16"
                        >
                          {[...Array(10)].map((_, i) => (
                            <option key={i + 1} value={i + 1}>{i + 1}</option>
                          ))}
                        </select>
                        <span className="ml-4 font-semibold">
                          TỔNG: {(item.price * item.quantity).toLocaleString('vi-VN')} VND
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Phần tổng đơn hàng - 1/3 màn hình */}
        <div className="lg:col-span-1">
          <div className="bg-white border border-gray-200 rounded-lg p-10 sticky top-20">
            <h3 className="font-bold text-lg mb-4">TỔNG ĐỚN HÀNG {cart.length} SẢN PHẨM</h3>
            
            <div className="space-y-3 mb-6">
              <div className="flex justify-between">
                <span>Tổng cộng</span>
                <span>{total.toLocaleString('vi-VN')} VND</span>
              </div>
              
              <div className="border-t pt-3">
                <div className="flex justify-between font-bold text-lg">
                  <span>TỔNG</span>
                  <span>{total.toLocaleString('vi-VN')} VND</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">Đã bao gồm thuế suất tại giá hàng</p>
              </div>
              
              <div className="border-t pt-3">
                <div className="flex justify-between font-bold text-lg">
                  <span>TỔNG ĐƠN ĐẶT HÀNG</span>
                  <span>{total.toLocaleString('vi-VN')} VND</span>
                </div>
              </div>
            </div>

            {/* Các tùy chọn bổ sung */}
            <div className="space-y-3 mb-6">
              <div className="flex items-center justify-between py-2 border-b">
                <span className="text-sm">📦 Phiếu giảm giá</span>
                <span className="text-sm"></span>
              </div>
              <div className="flex items-center justify-between py-2 border-b">
                <span className="text-sm">🏪 Tặng chọn địa hàng</span>
                <span className="text-sm"></span>
              </div>
            </div>

            <p className="text-xs text-gray-500 mb-4">
              Miễn phí giao hàng áp dụng cho đơn hàng trên 500.000 VND với tất cả các đơn hàng ở miễn phí giao hàng cho từ (Click & Collect).
            </p>

            {/* Nút thanh toán */}
            <div className="space-y-3">
           <button
            className="w-full bg-red-600 text-white py-3 rounded font-semibold hover:bg-red-700 transition"
            onClick={handleCheckout}
          >
            THANH TOÁN
          </button>

              <button
        className="w-full border border-gray-300 text-gray-700 py-3 rounded font-semibold hover:bg-gray-50 transition"
        onClick={() => navigate('/')}
        >
        TIẾP TỤC MUA SẮM
        </button>
            </div>
            
            <p className="text-xs text-gray-500 mt-3 text-center">
              Giá chốt: tính cẩn giá nhận phải qua hộp chọn
            </p>
          </div>
        </div>
      </div>

      {/* KHÁCH HÀNG KHÁC ĐÃ MUA */}
      <RelatedProductSection relatedProducts={relatedProducts} />
    </div>
  );
};

const RelatedProductSection = ({ relatedProducts }) => (
  <div className="mt-12">
    <h2 className="text-xl font-bold mb-6 text-center">KHÁCH HÀNG KHÁC ĐÃ MUA</h2>
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
      {relatedProducts.map(product => (
        <Link
          to={`/product/${product.id}`}
          key={product.id}
          className="bg-white rounded-lg p-4 shadow-sm group cursor-pointer hover:shadow-md transition-shadow block"
        >
          <div className="relative mb-3">
            <img
              src={product.image.startsWith('http') ? product.image : `/images/${product.image}`}
              alt={product.name}
              className="w-full h-48 object-cover rounded"
            />
            <button className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-red-500 text-lg">
              ♡
            </button>
          </div>
          <div className="flex gap-1 mb-2">
            {product.colors?.slice(0, 4).map((color, idx) => (
              <span
                key={idx}
                className="w-4 h-4 rounded-full border border-gray-300"
                style={{
                  backgroundColor:
                    color.code === 'COL00' ? '#000' :
                    color.code === 'COL01' ? '#fff' :
                    color.code === 'COL02' ? '#888' :
                    color.code === 'COL22' ? '#e53e3e' :
                    '#ccc',
                  display: 'inline-block'
                }}
                title={color.name}
              ></span>
            ))}
            {product.colors && product.colors.length > 4 && (
              <span className="text-xs text-gray-500">+{product.colors.length - 4}</span>
            )}
          </div>
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span>{product.subcategory}</span>
            <span>{product.code}</span>
          </div>
          <h3 className="text-sm font-medium mb-1 line-clamp-2">{product.name}</h3>
          <div className="text-xs text-gray-500 mb-1">{product.shortDescription}</div>
          <div className="font-semibold text-sm text-red-600 mb-1">
            {product.price?.toLocaleString('vi-VN')} VND
          </div>
        </Link>
      ))}
    </div>
  </div>
);

export default CartPage;