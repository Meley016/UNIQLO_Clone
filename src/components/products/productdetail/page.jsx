import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, Link, useNavigate } from 'react-router-dom';
import axiosInstance from '../../../utils/axios';

const ProductDetail = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [isFavorite, setIsFavorite] = useState(false);
  const [sizeOptions, setSizeOptions] = useState([]); // <-- Danh sách size (id + name)

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axiosInstance.get(`/Products/${id}`);
        const productData = response.data;

        if (!productData) throw new Error('Sản phẩm không tồn tại');
        setProduct(productData);

        // Gợi ý sản phẩm liên quan
        const relatedResponse = await axiosInstance.get('/Products', {
          params: { page: 1, pageSize: 4, categoryId: productData.categoryId },
        });
        const related = relatedResponse.data.items.filter((p) => p.id !== id).slice(0, 4);
        setRelatedProducts(related);

        // Thiết lập biến thể mặc định
        const defaultVariant = productData.variants?.[0] || { colorId: 'COL00', sizeId: 'SMA004' };
        setSelectedVariant({
          colorId: searchParams.get('colorId') || defaultVariant.colorId,
          sizeId: searchParams.get('sizeId') || defaultVariant.sizeId,
        });
        // Tạo danh sách size có name
        const uniqueSizes = [
          ...new Map(
            (productData.variants || []).map((v) => [
              v.sizeId,
              { id: v.sizeId, name: v.size?.name || v.sizeId },
            ])
          ).values(),
        ];
        setSizeOptions(uniqueSizes);

        // Kiểm tra yêu thích
        const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
        setIsFavorite(favorites.some((item) => item.id === id));

        setLoading(false);
      } catch (err) {
        console.error('Lỗi:', err);
        setError(err.message || 'Đã xảy ra lỗi khi tải sản phẩm');
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, searchParams]);

  const handleVariantChange = (colorId, sizeId) => {
    setSelectedVariant({ colorId, sizeId });
    navigate(`/product/${id}?colorId=${colorId}&sizeId=${sizeId}`);
  };

  const handleAddToCart = () => {
    if (!selectedVariant) return alert('Vui lòng chọn màu sắc và kích cỡ!');
    const cart = JSON.parse(localStorage.getItem('cart')) || [];

    const existingIndex = cart.findIndex(
      (item) =>
        item.id === product.id &&
        item.selectedColorId === selectedVariant.colorId &&
        item.selectedSizeId === selectedVariant.sizeId
    );

    if (existingIndex !== -1) {
      cart[existingIndex].quantity += 1;
    } else {
      cart.push({
        id: product.id,
        name: product.name,
        image: product.images?.[0] || '/default-image.jpg',
        price: product.price,
        selectedColorId: selectedVariant.colorId,
        selectedSizeId: selectedVariant.sizeId,
        quantity: 1,
      });
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    alert('Đã thêm vào giỏ hàng!');
  };

  const handleToggleFavorite = () => {
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    if (isFavorite) {
      const updated = favorites.filter((item) => item.id !== product.id);
      localStorage.setItem('favorites', JSON.stringify(updated));
      setIsFavorite(false);
      alert('Đã xóa khỏi danh sách yêu thích!');
    } else {
      favorites.push({
        id: product.id,
        name: product.name,
        image: product.images?.[0] || '/default-image.jpg',
        price: product.price,
      });
      localStorage.setItem('favorites', JSON.stringify(favorites));
      setIsFavorite(true);
      alert('Đã thêm vào danh sách yêu thích!');
    }
  };

  if (loading) return <div className="text-center text-gray-500 p-4">Đang tải...</div>;
  if (error) return <div className="text-center text-red-500 p-4">Lỗi: {error}</div>;
  if (!product) return <div className="text-center p-4">Không tìm thấy sản phẩm</div>;

  const shortDescription = product.description?.slice(0, 100) + '...' || 'Không có mô tả';
  const longDescription = product.description || 'Không có mô tả chi tiết';
  const colors = [...new Set(product.variants?.map((v) => v.colorId) || [])];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-screen">
        <div className="lg:col-span-2 overflow-y-auto max-h-[calc(100vh-8rem)]">
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="w-full lg:w-1/2">
              <img
                src={product.images?.[0] || '/default-image.jpg'}
                alt={product.name}
                className="w-full h-auto object-cover rounded-lg"
              />
            </div>
          </div>

          <div className="mt-6">
            <p className="font-semibold text-lg">Mô tả</p>
            <p>Mã sản phẩm: {product.id}</p>
            <details className="mb-4">
              <summary className="text-lg font-semibold cursor-pointer bg-gray-100 rounded-md hover:bg-gray-200 transition">
                Mô tả ngắn
              </summary>
              <p className="text-gray-700 p-2">{shortDescription}</p>
            </details>
            <details className="mb-4">
              <summary className="text-lg font-semibold cursor-pointer bg-gray-100 rounded-md hover:bg-gray-200 transition">
                Mô tả chi tiết
              </summary>
              <p className="text-gray-700 p-2">{longDescription}</p>
            </details>
          </div>
        </div>

        <div className="lg:col-span-1 sticky top-28 p-4 h-[calc(100vh-8rem)] overflow-y-auto">
          <div className="w-full">
            <h1 className="text-2xl font-bold mb-2">{product.name}</h1>
            <p className="text-gray-600 mb-2">Mã sản phẩm: {product.id}</p>
            <p className="text-xl font-semibold mb-4">Giá: {product.price.toLocaleString('vi-VN')} VND</p>

            {/* Màu sắc */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Màu sắc:</label>
              <div className="flex gap-2">
                {colors.map((colorId) => (
                  <button
                    key={colorId}
                    onClick={() => handleVariantChange(colorId, selectedVariant.sizeId)}
                    className={`w-8 h-8 rounded-full border ${
                      selectedVariant.colorId === colorId ? 'border-black' : 'border-gray-300'
                    }`}
                    style={{
                      backgroundColor:
                        colorId === 'COL00' ? '#000' : colorId === 'COL01' ? '#fff' : colorId,
                    }}
                  >
                    {selectedVariant.colorId === colorId && (
                      <span className="text-xs text-white">✓</span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Kích cỡ */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Kích cỡ:</label>
              <div className="flex gap-2 flex-wrap">
                {sizeOptions.map((size) => (
                  <button
                    key={size.id}
                    onClick={() => handleVariantChange(selectedVariant.colorId, size.id)}
                    className={`px-3 py-1 border rounded ${
                      selectedVariant.sizeId === size.id
                        ? 'border-black bg-gray-100'
                        : 'border-gray-300'
                    }`}
                  >
                    {size.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Nút chức năng */}
            <div className="flex gap-2">
              <button
                onClick={handleAddToCart}
                className="w-full bg-black text-white py-3 rounded hover:bg-gray-800 transition"
              >
                THÊM VÀO GIỎ HÀNG
              </button>
              <button
                onClick={handleToggleFavorite}
                className={`px-3 py-3 rounded ${
                  isFavorite
                    ? 'bg-red-500 text-white'
                    : 'bg-gray-200 text-red-500'
                } hover:bg-red-600 hover:text-white transition`}
                title={isFavorite ? 'Xóa khỏi yêu thích' : 'Thêm vào yêu thích'}
              >
                ❤️
              </button>
            </div>
            <Link to="/favorites" className="block mt-2 text-blue-600 hover:underline text-center">
              Xem danh sách yêu thích
            </Link>
          </div>
        </div>
      </div>

      {/* Sản phẩm liên quan */}
      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-4">Sản phẩm được quan tâm</h3>
        {relatedProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {relatedProducts.map((p) => (
              <Link to={`/product/${p.id}`} key={p.id} className="block">
                <div className="bg-white p-2 rounded-lg shadow">
                  <img
                    src={p.images?.[0] || '/default-image.jpg'}
                    alt={p.name}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                  <div className="p-2">
                    <h4 className="text-sm font-medium">{p.name}</h4>
                    <p className="text-sm text-gray-600">
                      {p.price.toLocaleString('vi-VN')} VND
                    </p>
                    <div className="flex gap-1 mb-1">
                      {[...new Set(p.variants?.map((v) => v.colorId) || [])]
                        .slice(0, 3)
                        .map((colorId) => (
                          <div
                            key={colorId}
                            className="w-4 h-4 rounded-full border"
                            style={{
                              backgroundColor:
                                colorId === 'COL00'
                                  ? '#000'
                                  : colorId === 'COL01'
                                  ? '#fff'
                                  : colorId,
                            }}
                          ></div>
                        ))}
                    </div>
                    <div className="flex items-center text-xs text-yellow-500">
                      ★ 4.9 <span className="text-gray-500 ml-1">(143)</span>
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
