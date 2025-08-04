import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick-theme.css';
import 'slick-carousel/slick/slick.css';
import axiosInstance from '../../../utils/axios';
import ProductCard from '../../common/ProductCard';

const ProductDetail = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const sliderRef = useRef(null);

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
      const productResponse = await axiosInstance.get(`/Products/${id}`);
      const productData = productResponse.data;
      if (!productData) throw new Error('Sản phẩm không tồn tại');
      console.log('Product data:', productData);
      console.log('Product images:', productData.images);
      setProduct(productData);

      // Fetch all colors
      const colorsResponse = await axiosInstance.get('/Colors/all');
      const colorsData = colorsResponse.data || [];
      if (!Array.isArray(colorsData)) throw new Error('Dữ liệu màu sắc không hợp lệ');
      setColorsData(colorsData);

      // Fetch all sizes
      const sizesResponse = await axiosInstance.get('/Sizes/all');
      const sizesData = sizesResponse.data || [];
      if (!Array.isArray(sizesData)) throw new Error('Dữ liệu kích cỡ không hợp lệ');
      setSizesData(sizesData);

      // Fetch related products
      const relatedResponse = await axiosInstance.get('/Products', {
        params: { page: 1, pageSize: 100 },
      });
      const relatedData = relatedResponse.data.items || relatedResponse.data || [];
      if (!Array.isArray(relatedData)) throw new Error('Dữ liệu sản phẩm liên quan không hợp lệ');
      const related = relatedData
        .filter((p) => p.categoryId === productData.categoryId && p.id !== id)
        .slice(0, 4);
      setRelatedProducts(related);

      // Set default variant
      const defaultVariant = productData.variants?.[0] || { colorId: null, sizeId: null };
      const initialColorId = searchParams.get('colorId') || defaultVariant.colorId;
      const initialSizeId = searchParams.get('sizeId') || defaultVariant.sizeId;
      setSelectedVariant({
        colorId: initialColorId,
        sizeId: initialSizeId,
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

  useEffect(() => {
    if (product && selectedVariant?.colorId && product.variants) {
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

      const validSizeId = uniqueSizes.find((size) => size.id === selectedVariant.sizeId)
        ? selectedVariant.sizeId
        : uniqueSizes[0]?.id;
      if (validSizeId && validSizeId !== selectedVariant.sizeId) {
        setSelectedVariant((prev) => ({ ...prev, sizeId: validSizeId }));
        navigate(`/product/${id}?colorId=${selectedVariant.colorId}&sizeId=${validSizeId}`);
      }
    }
  }, [product, selectedVariant?.colorId, sizesData, id, navigate]);

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
    if (!selectedVariant?.colorId || !selectedVariant?.sizeId) {
      return alert('Vui lòng chọn màu sắc và kích cỡ!');
    }
    const selected = product.variants?.find(
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
        image: product.images?.[0] || 'https://via.placeholder.com/400',
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
        image: product.images?.[0] || 'https://via.placeholder.com/400',
        price: product.price,
      });
      localStorage.setItem('favorites', JSON.stringify(favorites));
      setIsFavorite(true);
      alert('Đã thêm vào danh sách yêu thích!');
    }
  };

  const handleThumbnailClick = (index) => {
    if (sliderRef.current) {
      sliderRef.current.slickGoTo(index);
      console.log('Thumbnail clicked, navigating to slide:', index);
    }
  };

  if (loading) return <div className="text-center text-gray-500 p-4 text-lg">Đang tải...</div>;
  if (error) return <div className="text-center text-red-500 p-4 text-lg">Lỗi: {error}</div>;
  if (!product) return <div className="text-center p-4 text-lg">Không tìm thấy sản phẩm</div>;

  const shortDescription = product.description?.slice(0, 100) + '...' || 'Không có mô tả';
  const longDescription = product.description || 'Không có mô tả chi tiết';
  const colors = [...new Set(product.variants?.map((v) => v.colorId) || [])];
  const selected = product.variants?.find(
    (v) => v.colorId === selectedVariant?.colorId && v.sizeId === selectedVariant?.sizeId
  );

  const sliderSettings = {
    dots: product.images && product.images.length > 1,
    infinite: product.images && product.images.length > 1,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: product.images && product.images.length > 1,
    autoplay: product.images && product.images.length > 1,
    autoplaySpeed: 3000,
    lazyLoad: 'ondemand',
    adaptiveHeight: false,
    customPaging: () => (
      <div className="w-3 h-3 bg-gray-300 rounded-full hover:bg-gray-500 transition"></div>
    ),
    appendDots: (dots) => (
      <div>
        <ul className="flex justify-center gap-2 mt-4">{dots}</ul>
      </div>
    ),
    prevArrow: (
      <button className="slick-prev bg-gray-800 text-white p-2 rounded-full hover:bg-gray-600 transition">
        ❮
      </button>
    ),
    nextArrow: (
      <button className="slick-next bg-gray-800 text-white p-2 rounded-full hover:bg-gray-600 transition">
        ❯
      </button>
    ),
    afterChange: (current) => console.log('Current slide:', current),
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <style>
        {`
          .slick-slider {
            width: 100%;
            height: 100%;
            overflow: hidden;
          }
          .slick-list, .slick-track {
            width: 100%;
            height: 100%;
          }
          .slick-slide {
            outline: none;
            height: 100%;
            min-height: 400px;
          }
          .slick-slide > div {
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .slick-slide img {
            width: 100%;
            height: 100%;
            max-height: 500px;
            object-fit: contain;
            display: block;
            transition: transform 0.3s ease;
          }
          .slick-slide img:hover {
            transform: scale(1.05);
            transform-origin: center;
            cursor: zoom-in;
          }
          .slick-dots li button:before {
            color: #d1d5db;
          }
          .slick-dots li.slick-active button:before {
            color: #374151;
          }
        `}
      </style>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
        <div className="lg:col-span-2">
          <div className="relative w-full h-[400px] sm:h-[500px] rounded-lg overflow-hidden">
            <Slider {...sliderSettings} ref={sliderRef}>
              {product.images && product.images.length > 0 ? (
                product.images
                  .filter((image) => image && typeof image === 'string')
                  .map((image, index) => (
                    <div key={index} className="relative w-full h-full">
                      <div className="w-full h-full flex items-center justify-center">
                        <img
                          src={image || 'https://via.placeholder.com/400'}
                          alt={`${product.name} - ${index + 1}`}
                          className="w-full h-full object-contain transition-transform duration-300 hover:scale-105 cursor-zoom-in"
                          style={{ transformOrigin: 'center' }}
                          onError={(e) => {
                            console.log(`Failed to load image: ${image}`);
                            e.target.src = 'https://via.placeholder.com/400';
                          }}
                        />
                      </div>
                    </div>
                  ))
              ) : (
                <div className="relative w-full h-full">
                  <div className="w-full h-full flex items-center justify-center">
                    <img
                      src="https://via.placeholder.com/400"
                      alt={product.name}
                      className="w-full h-full object-contain transition-transform duration-300 hover:scale-105 cursor-zoom-in"
                      style={{ transformOrigin: 'center' }}
                      onError={() => console.log('Failed to load default image')}
                    />
                  </div>
                </div>
              )}
            </Slider>
          </div>
          {product.images && product.images.length > 1 && (
            <div className="flex gap-2 mt-4 justify-center">
              {product.images
                .filter((image) => image && typeof image === 'string')
                .map((image, index) => (
                  <img
                    key={index}
                    src={image || 'https://via.placeholder.com/400'}
                    alt={`${product.name} - thumbnail ${index + 1}`}
                    className="w-16 h-16 object-cover rounded-md cursor-pointer hover:opacity-80 transition"
                    onClick={() => handleThumbnailClick(index)}
                    onError={(e) => {
                      console.log(`Failed to load thumbnail: ${image}`);
                      e.target.src = 'https://via.placeholder.com/400';
                    }}
                  />
                ))}
            </div>
          )}
          <div className="mt-8">
            <h2 className="text-xl font-semibold text-gray-800">Mô tả sản phẩm</h2>
            <p className="text-gray-600 mt-2">Mã sản phẩm: {product.id}</p>
            <details className="mt-4">
              <summary className="text-lg font-medium cursor-pointer bg-gray-100 rounded-md p-3 hover:bg-gray-200 transition">
                Mô tả ngắn
              </summary>
              <p className="text-gray-700 p-4 bg-gray-50 rounded-md">{shortDescription}</p>
            </details>
            <details className="mt-4">
              <summary className="text-lg font-medium cursor-pointer bg-gray-100 rounded-md p-3 hover:bg-gray-200 transition">
                Mô tả chi tiết
              </summary>
              <p className="text-gray-700 p-4 bg-gray-50 rounded-md">{longDescription}</p>
            </details>
          </div>
        </div>

        <div className="lg:col-span-1 bg-white p-6 rounded-lg shadow-md">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-3">{product.name}</h1>
          <p className="text-gray-600 mb-2">Mã sản phẩm: {product.id}</p>
          <p className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4">
            Giá: {product.price.toLocaleString('vi-VN')} VND
          </p>
          {selected && (
            <p className="text-sm text-gray-600 mb-4">
              Tồn kho: {selected.quantity} sản phẩm
            </p>
          )}

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Màu sắc:</label>
            <div className="flex gap-3 flex-wrap">
              {colors.map((colorId) => (
                <button
                  key={colorId}
                  onClick={() => handleVariantChange(colorId, selectedVariant?.sizeId || sizeOptions[0]?.id)}
                  className={`w-10 h-10 rounded-full border-2 transition-all duration-300 ${
                    selectedVariant?.colorId === colorId ? 'border-blue-500 scale-110' : 'border-gray-300'
                  } hover:scale-110`}
                  style={{ backgroundColor: getColorStyle(colorId).backgroundColor }}
                  title={getColorStyle(colorId).name}
                >
                  {selectedVariant?.colorId === colorId && (
                    <span className="text-xs text-white font-bold">✓</span>
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Kích cỡ:</label>
            <div className="flex gap-3 flex-wrap">
              {sizeOptions.map((size) => (
                <button
                  key={size.id}
                  onClick={() => handleVariantChange(selectedVariant?.colorId || colors[0], size.id)}
                  className={`px-4 py-2 border rounded-md text-sm font-medium transition-all duration-300 ${
                    selectedVariant?.sizeId === size.id
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-300 text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {size.name}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-3 items-center">
            <button
              onClick={handleAddToCart}
              className={`flex-1 py-3 rounded-lg text-white font-medium transition-all duration-300 ${
                !selected || selected.quantity <= 0
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
              disabled={!selected || selected.quantity <= 0}
            >
              THÊM VÀO GIỎ HÀNG
            </button>
            <button
              onClick={handleToggleFavorite}
              className={`p-3 rounded-lg transition-all duration-300 ${
                isFavorite
                  ? 'bg-red-500 text-white hover:bg-red-600'
                  : 'bg-gray-100 text-red-500 hover:bg-red-100'
              }`}
              title={isFavorite ? 'Xóa khỏi yêu thích' : 'Thêm vào yêu thích'}
            >
              ❤️
            </button>
          </div>
          <Link
            to="/favorites"
            className="block mt-4 text-blue-600 hover:underline text-center text-sm font-medium"
          >
            Xem danh sách yêu thích
          </Link>
        </div>
      </div>

      <div className="mt-12">
        <h3 className="text-xl font-semibold text-gray-800 mb-6">Sản phẩm được quan tâm</h3>
        {relatedProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {relatedProducts.map((p) => (
              <Link key={p.id} to={`/product/${p.id}`} className="block">
                <ProductCard
                  id={p.id}
                  image={p.images?.[0] || 'https://via.placeholder.com/400'}
                  name={p.name}
                  code={p.id}
                  price={p.price}
                  variants={p.variants || []}
                />
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 text-lg">Không có sản phẩm liên quan</p>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;