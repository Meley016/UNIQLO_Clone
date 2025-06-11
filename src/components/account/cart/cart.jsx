import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Thêm dòng này

const CartPage = () => {
  const [cart, setCart] = useState([]);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const navigate = useNavigate(); // Thêm dòng này

 useEffect(() => {
  axios.get('/fake_api.json')
    .then(res => {
      const shuffled = res.data.sort(() => 0.5 - Math.random());
      setRelatedProducts(shuffled.slice(0, 6));
      console.log('relatedProducts:', shuffled.slice(0, 6));
    });
}, []);
  // Lấy giỏ hàng từ API
  useEffect(() => {
    axios.get('/api/cart')
      .then(res => setCart(res.data))
      .catch(() => setCart([]));
  }, []);

  // Cập nhật số lượng sản phẩm
  const handleQuantityChange = (productId, quantity) => {
    axios.put(`/api/cart/${productId}`, { quantity: Math.max(1, quantity) })
      .then(res => setCart(res.data));
  };

  // Xóa sản phẩm khỏi giỏ hàng
  const handleRemove = (productId) => {
    axios.delete(`/api/cart/${productId}`)
      .then(res => setCart(res.data));
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (cart.length === 0) {
  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6">Giỏ hàng</h2>
      <div className="text-center py-8 text-gray-500">Không có sản phẩm nào trong giỏ hàng của bạn.</div>
    <button
          className="mt-4 bg-black text-white py-3 px-6 rounded hover:bg-gray-800 transition"
          onClick={() => navigate('/')} // Thêm sự kiện này
        >        Tiếp tục mua sắm
      </button>
      {/* PHẦN KHÁCH HÀNG KHÁC ĐÃ MUA */}
      <div className="mt-12">
        <h2 className="text-xl font-bold mb-6 text-center">KHÁCH HÀNG KHÁC ĐÃ MUA</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {relatedProducts.map(product => (
            <div key={product.id} className="bg-white rounded-lg p-4 shadow-sm group cursor-pointer hover:shadow-md transition-shadow">
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
                    style={{ backgroundColor: color.code === 'COL00' ? '#000' : color.code === 'COL01' ? '#fff' : color.code === 'COL02' ? '#888' : color.code === 'COL22' ? '#e53e3e' : '#ccc', display: 'inline-block' }}
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
              <div className="font-semibold text-sm text-red-600 mb-1">{product.price?.toLocaleString('vi-VN')} VND</div>
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
        {cart.map(item => (
          <div key={item.id} className="flex items-center border-b pb-4">
            <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded mr-4" />
            <div className="flex-1">
              <div className="font-semibold">{item.name}</div>
              <div className="text-gray-500">Giá: {item.price.toLocaleString('vi-VN')} VND</div>
              <div className="flex items-center mt-2">
                <label className="mr-2">Số lượng:</label>
                <input
                  type="number"
                  min="1"
                  value={item.quantity}
                  onChange={e => handleQuantityChange(item.id, parseInt(e.target.value, 10))}
                  className="w-16 border rounded px-2 py-1"
                />
              </div>
            </div>
            <button
              onClick={() => handleRemove(item.id)}
              className="ml-4 text-red-500 hover:underline"
            >
              Xóa
            </button>
          </div>
        ))}
      </div>
      <div className="mt-6 text-right font-bold text-xl">
        Tổng cộng: {total.toLocaleString('vi-VN')} VND
      </div>
      <button className="mt-4 w-full bg-black text-white py-3 rounded hover:bg-gray-800 transition">
        Thanh toán
      </button>
   {/* PHẦN KHÁCH HÀNG KHÁC ĐÃ MUA */}
      <div className="mt-12">
        <h2 className="text-xl font-bold mb-6 text-center">KHÁCH HÀNG KHÁC ĐÃ MUA</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {relatedProducts.map(product => (
            <div key={product.id} className="bg-white rounded-lg p-4 shadow-sm group cursor-pointer hover:shadow-md transition-shadow">
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
                    style={{ backgroundColor: color.code === 'COL00' ? '#000' : color.code === 'COL01' ? '#fff' : color.code === 'COL02' ? '#888' : color.code === 'COL22' ? '#e53e3e' : '#ccc', display: 'inline-block' }}
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
              <div className="font-semibold text-sm text-red-600 mb-1">{product.price.toLocaleString('vi-VN')} VND</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CartPage; 