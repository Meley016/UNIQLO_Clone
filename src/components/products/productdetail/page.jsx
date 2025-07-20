import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, Link, useNavigate } from 'react-router-dom';
import ProductCard from '../../common/ProductCard';
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
  const [sizeOptions, setSizeOptions] = useState([]);
  const [colorsData, setColorsData] = useState([]);
  const [sizesData, setSizesData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Lấy dữ liệu sản phẩm
        const productResponse = await axiosInstance.get(`/Products/${id}`);
        const productData = productResponse.data;

        if (!productData) throw new Error('Sản phẩm không tồn tại');
        setProduct(productData);

        // Lấy dữ liệu màu sắc
        const colorsResponse = await axiosInstance.get('/Colors');
        if (!colorsResponse.data.items || !Array.isArray(colorsResponse.data.items)) {
          throw new Error('Dữ liệu màu sắc không hợp lệ');
        }
        setColorsData(colorsResponse.data.items);

        // Lấy dữ liệu kích cỡ
        const sizesResponse = await axiosInstance.get('/Sizes');
        if (!sizesResponse.data.items || !Array.isArray(sizesResponse.data.items)) {
          throw new Error('Dữ liệu kích cỡ không hợp lệ');
        }
        setSizesData(sizesResponse.data.items);

        // Lấy sản phẩm liên quan
        const relatedResponse = await axiosInstance.get('/Products', {
          params: { page: 1, pageSize: 100 },
        });
        if (!relatedResponse.data.items || !Array.isArray(relatedResponse.data.items)) {
          throw new Error('Dữ liệu sản phẩm liên quan không hợp lệ');
        }
        const related = relatedResponse.data.items
          .filter((p) => p.categoryId === productData.categoryId && p.id !== id)
          .slice(0, 4);
        setRelatedProducts(related);

        // Thiết lập biến thể mặc định
        const defaultVariant = productData.variants?.[0] || { colorId: 'COL00', sizeId: 'SIZE01' };
        setSelectedVariant({
          colorId: searchParams.get('colorId') || defaultVariant.colorId,
          sizeId: searchParams.get('sizeId') || defaultVariant.sizeId,
        });

        setLoading(false);
      } catch (err) {
        console.error('Lỗi:', err);
        setError(err.message || 'Đã xảy ra lỗi khi tải dữ liệu');
        setLoading(false);
      }
    };

    fetchData();
  }, [id, searchParams]);

  // Cập nhật sizeOptions khi selectedVariant.colorId thay đổi
  useEffect(() => {
    if (product && selectedVariant?.colorId) {
      const uniqueSizes = [
        ...new Map(
          product.variants
            .filter((v) => v.colorId === selectedVariant.colorId)
            .map((v) => [
              v.sizeId,
              {
                id: v.sizeId,
                name: sizesData.find((s) => s.id === v.sizeId)?.size_name || v.sizeId,
              },
            ])
        ).values(),
      ];
      setSizeOptions(uniqueSizes);

      // Đảm bảo sizeId được chọn hợp lệ
      const validSizeId = uniqueSizes.find((size) => size.id === selectedVariant.sizeId)
        ? selectedVariant.sizeId
        : uniqueSizes[0]?.id;
      if (validSizeId && validSizeId !== selectedVariant.sizeId) {
        setSelectedVariant((prev) => ({ ...prev, sizeId: validSizeId }));
        navigate(`/product/${id}?colorId=${selectedVariant.colorId}&sizeId=${validSizeId}`);
      }
    }
  }, [product, selectedVariant?.colorId, sizesData, id, navigate]);

  // Hàm lấy thông tin màu sắc
  const getColorStyle = (colorId) => {
    const color = colorsData.find((c) => c.id === colorId);
    return {
      backgroundColor: color?.colors_code || '#000000',
      name: color?.colors_name || 'Không xác định',
    };
  };

  const handleVariantChange = (colorId, sizeId) => {
    setSelectedVariant({ colorId, sizeId });
    navigate(`/product/${id}?colorId=${colorId}&sizeId=${sizeId}`);
  };

  const handleAddToCart = () => {
    if (!selectedVariant) return alert('Vui lòng chọn màu sắc và kích cỡ!');
    const selected = product.variants.find(
      (v) => v.colorId === selectedVariant.colorId && v.sizeId === selectedVariant.sizeId
    );
    if (!selected || selected.quantity <= 0) return alert('Sản phẩm không có sẵn!');

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
        categoryId: product.categoryId,
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
  const selected = product.variants.find(
    (v) => v.colorId === selectedVariant?.colorId && v.sizeId === selectedVariant?.sizeId
  );

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
            {selected && (
              <p className="text-sm text-gray-600 mb-4">
                Tồn kho: {selected.quantity} sản phẩm
              </p>
            )}

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
                    style={{ backgroundColor: getColorStyle(colorId).backgroundColor }}
                    title={getColorStyle(colorId).name}
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
                disabled={!selected || selected.quantity <= 0}
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
              <Link key={p.id} to={`/product/${p.id}`}>
                <ProductCard
                  id={p.id}
                  image={p.images?.[0] || '/default-image.jpg'}
                  name={p.name} 
                  code={p.id}
                  price={p.price}
                  variants={p.variants || []}
                />
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