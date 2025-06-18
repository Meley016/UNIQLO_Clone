import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios'; 

const ProductDetail = () => {
  const { id } = useParams(); // Lấy productId
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedColor, setSelectedColor] = useState(searchParams.get('colorCode') || (product?.colors[0]?.code || 'COL00'));
  const [selectedSize, setSelectedSize] = useState(searchParams.get('sizeCode') || (product?.sizes[0]?.code || 'SMA004'));
  const [relatedProducts, setRelatedProducts] = useState([]);
 useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        console.log('Fetching product with id:', id); // Debug id
        const response = await axios.get('/fake_api.json');
        console.log('API data:', response.data); // Debug toàn bộ dữ liệu API
        const foundProduct = response.data.find((p) => p.id === parseInt(id));
        if (!foundProduct) throw new Error('Sản phẩm không tồn tại');
        console.log('Found product:', foundProduct); // Debug sản phẩm tìm thấy
        setProduct(foundProduct);

        // Lọc các sản phẩm liên quan cùng subcategory (trừ sản phẩm hiện tại)
        const related = response.data.filter(
          (p) => p.subcategory === foundProduct.subcategory && p.id !== parseInt(id)
        ).slice(0, 4); // Lấy tối đa 4 sản phẩm liên quan
        setRelatedProducts(related);

        // Cập nhật selectedColor và selectedSize dựa trên dữ liệu sản phẩm
        setSelectedColor(searchParams.get('colorCode') || foundProduct.colors[0]?.code || 'COL00');
        setSelectedSize(searchParams.get('sizeCode') || foundProduct.sizes[0]?.code || 'SMA004');
        setLoading(false);
      } catch (err) {
        setError(err.message || 'Đã xảy ra lỗi khi lấy sản phẩm');
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id, searchParams]);

  const handleColorChange = (colorCode) => {
    setSelectedColor(colorCode);
    navigate(`/product/${id}?colorCode=${colorCode}&sizeCode=${selectedSize}`);
  };

  const handleSizeChange = (sizeCode) => {
    setSelectedSize(sizeCode);
    navigate(`/product/${id}?colorCode=${selectedColor}&sizeCode=${sizeCode}`);
  };

const handleAddToCart = () => {
  if (!product) {
    alert('Sản phẩm chưa sẵn sàng để thêm vào giỏ hàng.');
    return;
  }

  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  const existingIndex = cart.findIndex(
    item =>
      item.id === product.id &&
      item.selectedColor === selectedColor &&
      item.selectedSize === selectedSize
  );

  if (existingIndex !== -1) {
    cart[existingIndex].quantity += 1;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      image: product.image,
      price: product.price,
      selectedColor,
      selectedSize,
      quantity: 1,
    });
  }

  localStorage.setItem('cart', JSON.stringify(cart));
  alert('✅ Đã thêm sản phẩm vào giỏ hàng!');
};

  if (loading) {
    return <div className="text-center text-gray-500 p-4">Đang tải...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500 p-4">Lỗi: {error}</div>;
  }

  if (!product) {
    return <div className="text-center my-12 text-gray-500 p-4">Không tìm thấy sản phẩm</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-screen">
        <div className="lg:col-span-2 overflow-y-auto max-h-[calc(100vh-8rem)]">
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="w-full lg:w-1/2">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-auto object-cover rounded-lg"
              />
            </div>
          </div>
          <div className="mt-6">
          <p className='font-semibold text-lg'>Mô tả</p>
          <p>Mã sản phẩm: {product.code}</p>
            <details className="mb-4">
              <summary className="text-lg font-semibold cursor-pointer bg-gray-100 rounded-md hover:bg-gray-200 transition">
                Mô tả ngắn
              </summary>
              <p className="text-gray-700 p-2">{product.shortDescription}</p>
            </details>
            <details className="mb-4">
              <summary className="text-lg font-semibold cursor-pointer bg-gray-100 rounded-md hover:bg-gray-200 transition">
                Mô tả chi tiết
              </summary>
              <p className="text-gray-700 p-2">{product.longDescription}</p>
            </details>
          </div>
        </div>

        <div className="lg:col-span-1 sticky top-28 p-4 h-[calc(100vh-8rem)] overflow-y-auto">
          <div className="w-full lg:w-1/2">
            <h1 className="text-2xl font-bold mb-2">{product.name}</h1>
            <p className="text-gray-600 mb-2">Mã sản phẩm: {product.code}</p>
            <p className="text-xl font-semibold mb-4">Giá: {product.price.toLocaleString('vi-VN')} VND</p>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Màu sắc:</label>
              <div className="flex gap-2">
                {product.colors.map((color) => (
                  <button
                    key={color.code}
                    onClick={() => handleColorChange(color.code)}
                    className={`w-8 h-8 rounded-full border ${selectedColor === color.code ? 'border-black' : 'border-gray-300'}`}
                    style={{ backgroundColor: color.code === 'COL00' ? '#000' : color.code === 'COL01' ? '#fff' : '#ccc' }}
                  >
                    {selectedColor === color.code && <span className="text-xs text-white">✓</span>}
                  </button>
                ))}
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Kích cỡ:</label>
              <div className="flex gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size.code}
                    onClick={() => handleSizeChange(size.code)}
                    className={`px-3 py-1 border rounded ${selectedSize === size.code ? 'border-black bg-gray-100' : 'border-gray-300'}`}
                  >
                    {size.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Nút mua hàng */}
            <button
              onClick={handleAddToCart}
              className="w-full bg-black text-white py-3 rounded hover:bg-gray-800 transition"
            >
              THÊM VÀO GIỎ HÀNG
            </button>
            
          </div>
        </div>
      </div>
      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-4">Sản phẩm được quan tâm</h3>
        {relatedProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {relatedProducts.map((relatedProduct) => (
              <Link to={`/product/${relatedProduct.id}`} key={relatedProduct.id} className="block">
                <div className="bg-white p-2 rounded-lg shadow">
                  <img
                    src={relatedProduct.image}
                    alt={relatedProduct.name}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                  <div className="p-2">
                    <h4 className="text-sm font-medium">{relatedProduct.name}</h4>
                    <p className="text-sm text-gray-600">
                      {relatedProduct.price.toLocaleString('vi-VN')} VND
                    </p>
                    <div className="flex gap-1 mb-1">
                      {relatedProduct.colors.slice(0, 3).map((color) => (
                        <div
                          key={color.code}
                          className="w-4 h-4 rounded-full border"
                          style={{ backgroundColor: color.code === 'COL00' ? '#000' : color.code === 'COL01' ? '#fff' : '#ccc' }}
                        ></div>
                      ))}
                      {relatedProduct.colors.length > 3 && (
                        <span className="text-xs text-gray-500">+{relatedProduct.colors.length - 3}</span>
                      )}
                    </div>
                    <div className="flex items-center">
                      <span className="text-xs text-yellow-500">★ 4.9</span>
                      <span className="text-xs text-gray-500 ml-1">(143)</span>
                    </div>
                    <button className="text-red-500 text-xs mt-1">❤️</button>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500">Không có sản phẩm liên quan</p>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;