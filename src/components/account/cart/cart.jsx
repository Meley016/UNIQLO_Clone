import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../../utils/axios';

const CartPage = () => {
  const [cart, setCart] = useState([]);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [coupon, setCoupon] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [coupons, setCoupons] = useState([]);
  const [colorsData, setColorsData] = useState([]);
  const [sizesData, setSizesData] = useState([]);
  const [selectedItemIndex, setSelectedItemIndex] = useState(null);
  const [selectedColorId, setSelectedColorId] = useState(null);
  const [selectedSizeId, setSelectedSizeId] = useState(null);
  const [addresses, setAddresses] = useState(() => {
    const saved = localStorage.getItem('addresses');
    return saved ? JSON.parse(saved) : [];
  });
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [newAddress, setNewAddress] = useState({ fullName: '', phone: '', address: '' });
  const [paymentMethod, setPaymentMethod] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Lấy _id từ storage (ưu tiên token, nếu không dùng _id từ localStorage)
  const getUserIdFromStorage = () => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        console.log('Token payload:', payload);
        return payload.nameid || null; // Lấy nameid từ token (là _id)
      } catch (e) {
        console.error('Lỗi khi phân tích token:', e);
        setError('Lỗi khi phân tích token. Vui lòng đăng nhập lại!');
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

  // Fetch colors and sizes
  useEffect(() => {
    const fetchColorsAndSizes = async () => {
      try {
        const colorsResponse = await axiosInstance.get('/Colors/all');
        const colorsData = colorsResponse.data || [];
        if (!Array.isArray(colorsData)) throw new Error('Dữ liệu màu sắc không hợp lệ');
        setColorsData(colorsData);
      } catch (err) {
        const errorMessage = err.response?.data?.message || 'Lỗi khi tải màu sắc. Vui lòng thử lại!';
        setError(errorMessage);
        console.error('Error fetching colors:', err);
      }

      try {
        const sizesResponse = await axiosInstance.get('/Sizes/all');
        const sizesData = sizesResponse.data || [];
        if (!Array.isArray(sizesData)) throw new Error('Dữ liệu kích cỡ không hợp lệ');
        setSizesData(sizesData);
      } catch (err) {
        const errorMessage = err.response?.data?.message || 'Lỗi khi tải kích cỡ. Vui lòng thử lại!';
        setError(errorMessage);
        console.error('Error fetching sizes:', err);
      }
    };
    fetchColorsAndSizes();
  }, []);

  // Fetch coupons
  useEffect(() => {
    const savedCoupons = localStorage.getItem('coupons');
    setCoupons(savedCoupons ? JSON.parse(savedCoupons) : []);
  }, []);

  // Fetch cart products
  useEffect(() => {
    const fetchCartProducts = async () => {
      const savedCart = localStorage.getItem('cart');
      const cartItems = savedCart ? JSON.parse(savedCart) : [];
      if (cartItems.length === 0) {
        setCart([]);
        return;
      }

      try {
        const productIds = cartItems.map((item) => item.id);
        const response = await axiosInstance.get('/Products', { params: { page: 1, pageSize: 100 } });
        if (!response.data.items || !Array.isArray(response.data.items)) {
          throw new Error('Dữ liệu sản phẩm không hợp lệ');
        }

        const updatedCart = await Promise.all(
          cartItems.map(async (cartItem) => {
            const product = response.data.items.find((p) => p.id === cartItem.id);
            if (product) {
              const availableColors = product.variants ? [...new Set(product.variants.map((v) => v.colorId))] : [];
              const availableSizes = product.variants
                ? [
                    ...new Map(
                      product.variants.map((v) => [
                        v.sizeId,
                        { id: v.sizeId, name: sizesData.find((s) => s.id === v.sizeId)?.size_name || v.sizeId },
                      ])
                    ).values(),
                  ]
                : [];

              return {
                ...cartItem,
                name: product.name,
                price: product.price,
                image: product.images?.[0] || '/default-image.jpg',
                categoryId: product.categoryId,
                availableColors,
                availableSizes,
                selectedColorId: cartItem.selectedColorId || (availableColors.length > 0 ? availableColors[0] : null),
                selectedSizeId: cartItem.selectedSizeId || (availableSizes.length > 0 ? availableSizes[0]?.id : null),
              };
            }
            return cartItem;
          })
        );
        setCart(updatedCart);
        localStorage.setItem('cart', JSON.stringify(updatedCart));
      } catch (err) {
        const errorMessage = err.response?.data?.message || 'Lỗi khi tải giỏ hàng. Vui lòng thử lại!';
        setError(errorMessage);
        console.error('Error fetching cart products:', err);
      }
    };
    fetchCartProducts();
  }, []);

  // Fetch related products
  useEffect(() => {
    const fetchRelatedProducts = async () => {
      if (cart.length === 0) {
        setRelatedProducts([]);
        return;
      }

      try {
        const categoryIds = [...new Set(cart.map((item) => item.categoryId).filter(Boolean))];
        const response = await axiosInstance.get('/Products', { params: { page: 1, pageSize: 100 } });
        if (!response.data.items || !Array.isArray(response.data.items)) {
          throw new Error('Dữ liệu sản phẩm không hợp lệ');
        }

        const cartProductIds = cart.map((item) => item.id);
        const related = response.data.items
          .filter((product) => categoryIds.includes(product.categoryId) && !cartProductIds.includes(product.id))
          .sort(() => 0.5 - Math.random())
          .slice(0, 6);
        setRelatedProducts(related);
      } catch (err) {
        const errorMessage = err.response?.data?.message || 'Lỗi khi tải sản phẩm liên quan. Vui lòng thử lại!';
        setError(errorMessage);
        console.error('Error fetching related products:', err);
        setRelatedProducts([]);
      }
    };
    fetchRelatedProducts();
  }, [cart]);

  const getColorStyle = (colorId) => {
    const color = colorsData.find((c) => c.id === colorId);
    return {
      backgroundColor: color?.colors_code || '#000000',
      name: color?.colors_name || 'Không xác định',
    };
  };

  const handleQuantityChange = (index, quantity) => {
    const updatedCart = [...cart];
    updatedCart[index].quantity = Math.max(1, parseInt(quantity, 10));
    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  const handleRemove = (index) => {
    const updatedCart = cart.filter((_, i) => i !== index);
    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

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

  const calculateTotal = () => {
    let subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    if (appliedCoupon) {
      if (appliedCoupon.code === 'FREESHIP') {
        return subtotal;
      }
      const discountPercentage = parseInt(appliedCoupon.code.replace(/[^0-9]/g, '')) || 0;
      subtotal -= (subtotal * discountPercentage) / 100;
    }
    return subtotal;
  };

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const vat = subtotal * 0.1; // 10% VAT
  const total = calculateTotal() + vat;

  const handleColorSizeChange = (index) => {
    setSelectedItemIndex(index);
    setSelectedColorId(cart[index].selectedColorId);
    setSelectedSizeId(cart[index].selectedSizeId);
  };

  const saveColorSize = () => {
    if (selectedItemIndex !== null) {
      const updatedCart = [...cart];
      updatedCart[selectedItemIndex].selectedColorId = selectedColorId;
      updatedCart[selectedItemIndex].selectedSizeId = selectedSizeId;
      setCart(updatedCart);
      localStorage.setItem('cart', JSON.stringify(updatedCart));
      setSelectedItemIndex(null);
    }
  };

  const handleAddAddress = (e) => {
    e.preventDefault();
    const addressId = Date.now().toString();
    const newAddressData = { id: addressId, ...newAddress, createdAt: new Date().toISOString() };
    const updatedAddresses = [...addresses, newAddressData];
    setAddresses(updatedAddresses);
    localStorage.setItem('addresses', JSON.stringify(updatedAddresses));
    setNewAddress({ fullName: '', phone: '', address: '' });
    setShowAddressModal(false);
    setSelectedAddress(newAddressData);
    alert('Đã thêm địa chỉ thành công!');
  };

  const handlePlaceOrder = () => {
    if (!selectedAddress) {
      alert('Vui lòng chọn địa chỉ giao hàng!');
      return;
    }
    if (!paymentMethod) {
      alert('Vui lòng chọn phương thức thanh toán!');
      return;
    }
    const customerId = getUserIdFromStorage(); // Sử dụng hàm để lấy _id
    if (!customerId) {
      setError('Vui lòng đăng nhập để đặt hàng!');
      alert('Vui lòng đăng nhập để đặt hàng!');
      navigate('/login');
      return;
    }

    const orderData = {
      customerId,
      customerPhone: selectedAddress.phone,
      customerAddress: selectedAddress.address,
      items: cart.map((item) => ({
        productId: item.id,
        colorId: item.selectedColorId,
        sizeId: item.selectedSizeId,
        quantity: item.quantity,
        categoryId: item.categoryId,
      })),
    };
    navigate(paymentMethod === 'COD' ? '/payment-COD' : '/payment-Paypal', {
      state: { cart, total, selectedAddress, orderData },
    });
  };

  if (cart.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-6">Giỏ hàng</h2>
        <div className="text-center py-8 text-gray-500">Không có sản phẩm nào trong giỏ hàng của bạn.</div>
        {error && <div className="text-red-500 mb-4">{error}</div>}
        <button
          className="mt-4 bg-black text-white py-3 px-6 rounded hover:bg-gray-800 transition"
          onClick={() => navigate('/')}
        >
          Tiếp tục mua sắm
        </button>
        <div className="mt-12">
          <h2 className="text-xl font-bold mb-6 text-center">KHÁCH HÀNG KHÁC ĐÃ MUA</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {relatedProducts.map((product) => {
              const colors = [...new Set(product.variants?.map((v) => v.colorId) || [])];
              const sizeOptions = [
                ...new Map(
                  product.variants?.map((v) => [
                    v.sizeId,
                    { id: v.sizeId, name: sizesData.find((s) => s.id === v.sizeId)?.size_name || v.sizeId },
                  ])
                ).values(),
              ];
              return (
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
                    <button
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-red-500 text-lg"
                      onClick={(e) => {
                        e.stopPropagation();
                        const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
                        const exists = favorites.some((item) => item.id === product.id);
                        if (exists) {
                          localStorage.setItem(
                            'favorites',
                            JSON.stringify(favorites.filter((item) => item.id !== product.id))
                          );
                          alert('Đã xóa khỏi danh sách yêu thích!');
                        } else {
                          favorites.push({
                            id: product.id,
                            name: product.name,
                            image: product.images?.[0] || '/default-image.jpg',
                            price: product.price,
                          });
                          localStorage.setItem('favorites', JSON.stringify(favorites));
                          alert('Đã thêm vào danh sách yêu thích!');
                        }
                      }}
                    >
                      ♡
                    </button>
                  </div>
                  <div className="mb-2">
                    <label className="block text-xs font-medium text-gray-700">Màu sắc:</label>
                    <div className="flex gap-2 flex-wrap">
                      {colors.map((colorId) => (
                        <span
                          key={colorId}
                          className="w-4 h-4 rounded-full border-2 border-gray-300"
                          style={{ backgroundColor: getColorStyle(colorId).backgroundColor }}
                          title={getColorStyle(colorId).name}
                        ></span>
                      ))}
                    </div>
                  </div>
                  <div className="mb-2">
                    <label className="block text-xs font-medium text-gray-700">Kích cỡ:</label>
                    <div className="flex gap-2 flex-wrap">
                      {sizeOptions.map((size) => (
                        <span
                          key={size.id}
                          className="px-3 py-1 border rounded-md text-xs text-gray-700 bg-gray-50"
                        >
                          {size.name}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex justify-between text-xs text-gray-500 mb-1"></div>
                  <h3 className="text-sm font-medium mb-1 line-clamp-2">{product.name}</h3>
                  <div className="font-semibold text-sm text-red-600 mb-1">
                    {product.price?.toLocaleString('vi-VN')} VND
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6">Giỏ hàng</h2>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-1/3 space-y-4">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-4">Tổng đơn hàng</h3>
            <p className="text-gray-600">Tổng đơn hàng | Số sản phẩm: {cart.length} sản phẩm</p>
            <p className="text-gray-600 mt-2">Tổng giá: {subtotal.toLocaleString('vi-VN')} VND</p>
            <p className="text-gray-600 mt-2">VAT: {vat.toLocaleString('vi-VN')} VND</p>
            <p className="text-gray-600 mt-2 font-bold">Tổng đơn hàng: {total.toLocaleString('vi-VN')} VND</p>
          </div>

          {/* Payment Method Selection */}
          <div className="bg-white p-2 rounded-lg shadow-md">
            <select
              className="w-full border rounded px-3 py-2 mb-2"
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
            >
              <option value="">Chọn phương thức thanh toán</option>
              <option value="COD">Thanh toán COD</option>
              <option value="Paypal">Thanh toán PayPal</option>
            </select>
          </div>

          {/* Coupon Selection */}
          <div className="bg-white p-2 rounded-lg shadow-md flex items-center gap-2">
            <input
              type="text"
              value={coupon}
              onChange={(e) => setCoupon(e.target.value)}
              placeholder="Nhập mã giảm giá"
              className="border rounded px-3 py-2 w-full"
            />
            <button
              onClick={handleApplyCoupon}
              className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition flex items-center justify-center w-10 h-10"
              style={{ color: 'white' }}
            >
              ✓
            </button>
            {appliedCoupon && (
              <p className="text-green-600 mt-2">Đã áp dụng: {appliedCoupon.code} - {appliedCoupon.description}</p>
            )}
          </div>

          {/* Address Selection */}
          {addresses.length === 0 ? (
            <p className="text-sm ">Chưa có địa chỉ nào được lưu.</p>
          ) : (
            <div className="mb-4 bg-white p-2 rounded-lg shadow-md flex items-center gap-2">
              <select
                className="w-full border rounded px-3 py-2 flex-1"
                value={selectedAddress?.id || ''}
                onChange={(e) => {
                  const address = addresses.find((a) => a.id === e.target.value);
                  setSelectedAddress(address);
                }}
              >
                <option value="">Chọn địa chỉ</option>
                {addresses.map((address) => (
                  <option key={address.id} value={address.id}>
                    {`${address.fullName} - ${address.phone} - ${address.address}`}
                  </option>
                ))}
              </select>
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600"
                style={{ minWidth: '120px' }}
                onClick={() => setShowAddressModal(true)}
              >
                THÊM ĐỊA CHỈ
              </button>
            </div>
          )}
          {addresses.length === 0 && (
            <button
              className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600"
              onClick={() => setShowAddressModal(true)}
            >
              THÊM ĐỊA CHỈ
            </button>
          )}

          <button
            onClick={handlePlaceOrder}
            className="w-full bg-blue-500 text-white py-3 rounded hover:bg-blue-600 transition mt-4"
          >
            Đặt hàng
          </button>
          <button
            className="w-full bg-gray-200 text-black py-3 rounded hover:bg-gray-300 transition mt-2"
            onClick={() => navigate('/')}
          >
            Tiếp tục mua sắm
          </button>
        </div>

        <div className="w-full bg-white p-6 rounded-lg shadow-md md:w-2/3 space-y-4" style={{ maxHeight: '590px', overflowY: 'auto' }}>
          {cart.map((item, index) => (
            <div key={index} className="flex items-center border-b pb-4">
              <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded mr-4" />
              <div className="flex-1">
                <div className="font-semibold">{item.name}</div>
                <div className="text-gray-500 mt-2">
                  <label className="mr-2">Màu sắc:</label>
                  <span
                    className={`w-4 h-4 rounded-full border-2 border-gray-300 inline-block cursor-pointer ${
                      getColorStyle(item.selectedColorId).backgroundColor === '#FFFFFF' ? 'border-4 border-black' : ''
                    }`}
                    style={{
                      backgroundColor:
                        item.selectedColorId && colorsData.length > 0
                          ? getColorStyle(item.selectedColorId).backgroundColor
                          : '#ffffff',
                    }}
                    title={
                      item.selectedColorId && colorsData.length > 0
                        ? getColorStyle(item.selectedColorId).name
                        : 'Không xác định'
                    }
                    onClick={() => handleColorSizeChange(index)}
                  ></span>
                </div>
                <div className="text-gray-500 mt-2">
                  <label className="mr-2">Kích cỡ:</label>
                  <span
                    className="px-3 py-1 border rounded-md text-sm font-medium text-gray-700 bg-gray-50 cursor-pointer"
                    style={{ lineHeight: '1.5' }}
                    onClick={() => handleColorSizeChange(index)}
                  >
                    {sizesData.find((s) => s.id === item.selectedSizeId)?.size_name || item.selectedSizeId}
                  </span>
                </div>
                <div className="text-gray-500 mt-2">Giá: {item.price.toLocaleString('vi-VN')} VND</div>
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
              <button onClick={() => handleRemove(index)} className="mr-10 text-red-500 hover:underline">
                Xóa
              </button>
            </div>
          ))}
        </div>
      </div>
      {selectedItemIndex !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h3 className="text-lg font-semibold mb-4">Chọn màu sắc và kích cỡ</h3>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Màu sắc:</label>
              <div className="flex gap-2 flex-wrap">
                {cart[selectedItemIndex]?.availableColors.map((colorId) => (
                  <span
                    key={colorId}
                    className={`w-6 h-6 rounded-full border-2 border-gray-300 cursor-pointer ${
                      selectedColorId === colorId ? 'ring-2 ring-blue-500' : ''
                    } ${
                      getColorStyle(colorId).backgroundColor === '#FFFFFF' ? 'border-4 border-black' : ''
                    }`}
                    style={{ backgroundColor: colorsData.find((c) => c.id === colorId)?.colors_code || '#000000' }}
                    onClick={() => setSelectedColorId(colorId)}
                  ></span>
                ))}
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Kích cỡ:</label>
              <div className="flex gap-2 flex-wrap">
                {cart[selectedItemIndex]?.availableSizes.map((size) => (
                  <span
                    key={size.id}
                    className={`px-2 py-1 border rounded-md text-xs text-gray-700 bg-gray-50 cursor-pointer ${
                      selectedSizeId === size.id ? 'bg-blue-100' : ''
                    }`}
                    style={{ lineHeight: '1.2' }}
                    onClick={() => setSelectedSizeId(size.id)}
                  >
                    {size.name}
                  </span>
                ))}
              </div>
            </div>
            <div className="flex justify-end gap-4">
              <button
                className="bg-gray-300 text-black py-2 px-4 rounded hover:bg-gray-400 transition"
                onClick={() => setSelectedItemIndex(null)}
              >
                Hủy
              </button>
              <button
                className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition"
                onClick={saveColorSize}
              >
                Lưu
              </button>
            </div>
          </div>
        </div>
      )}
      {showAddressModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-lg font-semibold mb-4">Thêm địa chỉ mới</h2>
            <form onSubmit={handleAddAddress}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Họ và tên</label>
                <input
                  type="text"
                  value={newAddress.fullName}
                  onChange={(e) => setNewAddress({ ...newAddress, fullName: e.target.value })}
                  className="w-full border rounded px-3 py-2"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Số điện thoại</label>
                <input
                  type="tel"
                  value={newAddress.phone}
                  onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })}
                  className="w-full border rounded px-3 py-2"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Địa chỉ</label>
                <input
                  type="text"
                  value={newAddress.address}
                  onChange={(e) => setNewAddress({ ...newAddress, address: e.target.value })}
                  className="w-full border rounded px-3 py-2"
                  required
                />
              </div>
              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  className="bg-gray-300 text-black py-2 px-4 rounded hover:bg-gray-400 transition"
                  onClick={() => setShowAddressModal(false)}
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition"
                >
                  Lưu
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      <div className="mt-12">
        <h2 className="text-xl font-bold mb-6 text-center">KHÁCH HÀNG KHÁC ĐÃ MUA</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {relatedProducts.map((product) => {
            const colors = [...new Set(product.variants?.map((v) => v.colorId) || [])];
            const sizeOptions = [
              ...new Map(
                product.variants?.map((v) => [
                  v.sizeId,
                  { id: v.sizeId, name: sizesData.find((s) => s.id === v.sizeId)?.size_name || v.sizeId },
                ])
              ).values(),
            ];
            return (
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
                  <button
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-red-500 text-lg"
                    onClick={(e) => {
                      e.stopPropagation();
                      const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
                      const exists = favorites.some((item) => item.id === product.id);
                      if (exists) {
                        localStorage.setItem(
                          'favorites',
                          JSON.stringify(favorites.filter((item) => item.id !== product.id))
                        );
                        alert('Đã xóa khỏi danh sách yêu thích!');
                      } else {
                        favorites.push({
                          id: product.id,
                          name: product.name,
                          image: product.images?.[0] || '/default-image.jpg',
                          price: product.price,
                        });
                        localStorage.setItem('favorites', JSON.stringify(favorites));
                        alert('Đã thêm vào danh sách yêu thích!');
                      }
                    }}
                  >
                    ♡
                  </button>
                </div>
                <div className="mb-2">
                  <label className="block text-xs font-medium text-gray-700">Màu sắc:</label>
                  <div className="flex gap-2 flex-wrap">
                    {colors.map((colorId) => (
                      <span
                        key={colorId}
                        className="w-4 h-4 rounded-full border-2 border-gray-300"
                        style={{ backgroundColor: getColorStyle(colorId).backgroundColor }}
                        title={getColorStyle(colorId).name}
                      ></span>
                    ))}
                  </div>
                </div>
                <div className="mb-2">
                  <label className="block text-xs font-medium text-gray-700">Kích cỡ:</label>
                  <div className="flex gap-2 flex-wrap">
                    {sizeOptions.map((size) => (
                      <span
                        key={size.id}
                        className="px-3 py-1 border rounded-md text-xs text-gray-700 bg-gray-50"
                      >
                        {size.name}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex justify-between text-xs text-gray-500 mb-1"></div>
                <h3 className="text-sm font-medium mb-1 line-clamp-2">{product.name}</h3>
                <div className="font-semibold text-sm text-red-600 mb-1">
                  {product.price?.toLocaleString('vi-VN')} VND
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CartPage;