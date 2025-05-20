import React, { useState, useEffect } from 'react';
import Slider from 'react-slick';
import ProductCard from './ProductCard';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/products.json');
        if (!response.ok) {
          throw new Error('Lỗi khi lấy dữ liệu sản phẩm');
        }
        const data = await response.json();
        setProducts(data);
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Đã xảy ra lỗi');
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const settings = {
    dots: true, // Hiển thị chấm chỉ dẫn
    infinite: true, // Vòng lặp vô hạn
    speed: 500, // Tốc độ chuyển slide (ms)
    slidesToShow: 5, // Hiển thị sản phẩm mỗi lần
    slidesToScroll: 2, // Cuộn sản phẩm mỗi lần
    autoplay: true, // Tự động cuộn
    autoplaySpeed: 3000, // Tốc độ tự động cuộn (ms)
    arrows: true, // Hiển thị nút điều hướng
    responsive: [
      {
        breakpoint: 1024, // Dưới 1024px (lg)
        settings: {
          slidesToShow: 3, // Hiển thị sản phẩm
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 640, // Dưới 640px (sm)
        settings: {
          slidesToShow: 2, // Hiển thị sản phẩm
          slidesToScroll: 1,
        },
      },
    ],
  };

  if (loading) {
    return <div className="text-center text-gray-500">Đang tải...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">Lỗi: {error}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Slider {...settings}>
        {products.map((product) => (
          <div key={product.id} className="px-2">
            <ProductCard
              image={product.image}
              name={product.name}
              code={product.code}
              price={product.price}
            />
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default ProductList;