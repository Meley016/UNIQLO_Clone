import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick-theme.css';
import 'slick-carousel/slick/slick.css';
import ProductList from '../components/products/productlist/page';
import axiosInstance from '../utils/axios';

const sliderSettings = {
  dots: true,
  infinite: true,
  speed: 2000,
  slidesToShow: 1,
  slidesToScroll: 1,
  arrows: true,
  autoplay: true,
  autoplaySpeed: 500,
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

const Home = () => {
  const [randomProducts, setRandomProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRandomProducts = async () => {
      try {
        const response = await axiosInstance.get('/Products', {
          params: {
            page: 1,
            pageSize: 20,
          },
        });
        if (!response.data.items) throw new Error('Lỗi khi lấy dữ liệu sản phẩm');
        const shuffled = response.data.items.sort(() => 0.5 - Math.random());
        setRandomProducts(shuffled.slice(0, 5));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Đã xảy ra lỗi');
      } finally {
        setLoading(false);
      }
    };

    fetchRandomProducts();
  }, []);

  if (loading) return <div className="text-center p-4 text-gray-500">Đang tải...</div>;
  if (error) return <div className="text-center p-4 text-red-500">Lỗi: {error}</div>;
  if (randomProducts.length === 0)
    return <div className="text-center p-4 text-gray-500">Không có sản phẩm.</div>;

  return (
    <div className="relative w-screen overflow-hidden">
      <Slider {...sliderSettings}>
        {randomProducts.map((product) => (
          <Link
            key={product.id}
            to={`/product/${product.id}`}
            className="relative w-full h-[60vh]" // Điều chỉnh chiều cao slider
          >
            <img
              src={product.images?.[0] || 'https://source.unsplash.com/800x500/?uniqlo,fashion'}
              alt={product.name}
              className="w-full h-full object-contain"
              loading="lazy"
              onError={(e) => {
                console.log(`Failed to load image: ${product.images?.[0]}`);
                e.target.src = 'https://source.unsplash.com/800x500/?uniqlo,fashion';
              }}
            />
            <div className="absolute bottom-4 left-4 text-white bg-black bg-opacity-50 p-3 rounded">
              <h2 className="text-lg font-semibold">{product.name}</h2>
              <p className="text-sm">{product.price.toLocaleString('vi-VN')} VND</p>
            </div>
          </Link>
        ))}
      </Slider>
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-6">Sản phẩm mới nhất</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {randomProducts.map((product) => (
            <div key={product.id} className="border p-4 rounded-lg shadow-md">
              <Link to={`/product/${product.id}`}>
                <img
                  src={product.images?.[0] || 'https://source.unsplash.com/800x500/?uniqlo,fashion'}
                  alt={product.name}
                  className="w-full h-48 object-contain mb-2"
                  loading="lazy"
                  onError={(e) => {
                    e.target.src = 'https://source.unsplash.com/800x500/?uniqlo,fashion';
                  }}
                />
                <h3 className="text-md font-medium">{product.name}</h3>
                <p className="text-md font-semibold">
                  {product.price.toLocaleString('vi-VN')} VND
                </p>
              </Link>
            </div>
          ))}
        </div>
        <h2 className="text-2xl font-bold mb-6 mt-10">Sản phẩm nổi bật</h2>
        <ProductList featured={true} />
      </div>
      <style jsx>{`
        .slick-slider {
          width: 100vw;
          height: 60vh; /* Điều chỉnh chiều cao slider */
          overflow: hidden;
        }
        .slick-list, .slick-track {
          width: 100%;
          height: 100%;
        }
        .slick-slide {
          outline: none;
          height: 60vh; /* Điều chỉnh chiều cao slide */
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
          object-fit: contain;
          display: block;
          transition: transform 0.3s ease;
        }
        .slick-slide img:hover {
          transform: scale(1.05);
          transform-origin: center;
          cursor: zoom-in;
        }
        .slick-dots {
          bottom: 20px;
        }
        .slick-dots li button:before {
          color: #d1d5db;
        }
        .slick-dots li.slick-active button:before {
          color: #374151;
        }
        .slick-prev, .slick-next {
          z-index: 10;
        }
        .slick-prev {
          left: 20px;
        }
        .slick-next {
          right: 20px;
        }
      `}</style>
    </div>
  );
};

export default Home;