import React, { useState, useEffect } from 'react';
import Slider from 'react-slick';
import ProductCard from '../common/ProductCard';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const ProductList = ({ categoryId }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/fake_api.json');
        if (!response.ok) {
          throw new Error('Lỗi khi lấy dữ liệu sản phẩm');
        }
        const data = await response.json();
        // Lọc sản phẩm theo categoryId
        const filteredProducts = data.filter(
          (product) => product.category === categoryId
        );
        setProducts(filteredProducts);
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Đã xảy ra lỗi');
        setLoading(false);
      }
    };

    fetchProducts();
  }, [categoryId]); // Thêm categoryId vào dependency array để fetch lại khi categoryId thay đổi

  // const settings = {
  //   dots: true,
  //   infinite: products.length > 5, // Chỉ bật infinite nếu có đủ sản phẩm
  //   speed: 500,
  //   slidesToShow: Math.min(products.length, 5), // Hiển thị tối đa 5 sản phẩm
  //   slidesToScroll: 2,
  //   autoplay: true,
  //   autoplaySpeed: 3000,
  //   arrows: true,
  //   responsive: [
  //     {
  //       breakpoint: 1024,
  //       settings: {
  //         slidesToShow: Math.min(products.length, 3),
  //         slidesToScroll: 1,
  //       },
  //     },
  //     {
  //       breakpoint: 640,
  //       settings: {
  //         slidesToShow: Math.min(products.length, 2),
  //         slidesToScroll: 1,
  //       },
  //     },
  //   ],
  // };

  if (loading) {
    return <div className="text-center text-gray-500 p-4">Đang tải...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500 p-4">Lỗi: {error}</div>;
  }

  if (products.length === 0) {
    return (
      <div className="text-center text-gray-500 p-4">
        Không có sản phẩm nào cho danh mục {categoryId}
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-xl font-bold mb-4">Sản phẩm {categoryId}</h2>
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
    </div>
  );
};

export default ProductList;