import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import ProductCard from '../../common/ProductCard';
import axios from 'axios';

const ProductList = ({ subcategoryName }) => {
  const params = useParams();
  const currentSubcategoryName = params.subcategoryName || subcategoryName;
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('/fake_api.json');
        const subcategoryNameFormatted = currentSubcategoryName.replace(/-/g, ' ');
        const filteredProducts = response.data.filter(
          (product) => product.subcategory.toLowerCase() === subcategoryNameFormatted.toLowerCase()
        );
        setProducts(filteredProducts);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || err.message || 'Đã xảy ra lỗi');
        setLoading(false);
      }
    };

    fetchProducts();
  }, [currentSubcategoryName]);

  if (loading) {
    return <div className="text-center text-gray-500 p-4">Đang tải...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500 p-4">Lỗi: {error}</div>;
  }

  if (products.length === 0) {
    return (
      <div className="text-center my-12 text-gray-500 p-4">
        Không có sản phẩm nào cho danh mục {currentSubcategoryName.replace(/-/g, ' ')}
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 z-50 py-8">
      <h2 className="text-xl font-bold mb-4">Sản phẩm {currentSubcategoryName.replace(/-/g, ' ')}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 justify-items-center">
        {products.map((product) => (
          <div key={product.id} className="px-2">
            <Link to={`/product/${product.id}`}>
              <ProductCard
                id={product.id}
                image={product.image}
                name={product.name}
                code={product.code}
                price={product.price}
              />
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductList;