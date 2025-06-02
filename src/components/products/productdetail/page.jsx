import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const ProductDetailPage = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get('/fake_api.json');
        const foundProduct = response.data.find(
          (prod) => prod.id === parseInt(productId)
        );
        if (!foundProduct) {
          throw new Error('Không tìm thấy sản phẩm');
        }
        setProduct(foundProduct);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || err.message || 'Đã xảy ra lỗi');
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  if (loading) {
    return <div className="text-center text-gray-500 p-4">Đang tải...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500 p-4">Lỗi: {error}</div>;
  }

  if (!product) {
    return (
      <div className="text-center my-12 text-gray-500 p-4">
        Không tìm thấy sản phẩm
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-xl font-bold mb-4 text-center">{product.name}</h2>
      <div className="flex flex-col md:flex-row gap-8 justify-center">
        <img
          src={product.image}
          alt={product.name}
          className="w-full md:w-1/2 h-96 object-cover rounded-lg"
        />
        <div className="flex flex-col gap-4">
          <p className="text-gray-600"><strong>Mã sản phẩm:</strong> {product.code}</p>
          <p className="text-pink-600 text-lg"><strong>Giá:</strong> {product.price.toLocaleString('vi-VN')} VND</p>
          <p className="text-gray-600"><strong>Danh mục con:</strong> {product.subcategory}</p>
          <button
            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            onClick={(e) => e.stopPropagation()}
          >
            Thêm vào giỏ hàng
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;