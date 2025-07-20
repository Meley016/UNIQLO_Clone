import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import ProductCard from '../../common/ProductCard';
import axiosInstance from '../../../utils/axios';

const ProductList = ({ categoryId }) => {
  const params = useParams();
  const currentCategoryId = params.categoryId || categoryId;
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        console.log('Fetching all products with params:', {
          page,
          pageSize: 100, // Lấy số lượng lớn để lọc
          categoryId: currentCategoryId || 'none',
        });
        const response = await axiosInstance.get('/Products', {
          params: {
            page,
            pageSize: 100, // Lấy đủ sản phẩm để lọc
          },
        });
        console.log('Products response:', response.data);
        if (!response.data.items || !Array.isArray(response.data.items)) {
          throw new Error('Dữ liệu sản phẩm không hợp lệ hoặc không phải mảng');
        }
        // Lọc sản phẩm theo categoryId nếu có
        const filteredProducts = currentCategoryId
          ? response.data.items.filter((product) => product.categoryId === currentCategoryId)
          : response.data.items;
        // Phân trang trong frontend
        const pageSize = 12;
        const startIndex = (page - 1) * pageSize;
        const paginatedProducts = filteredProducts.slice(startIndex, startIndex + pageSize);
        setProducts(paginatedProducts);
        setTotalPages(Math.ceil(filteredProducts.length / pageSize) || 1);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError(err.message || 'Đã xảy ra lỗi khi lấy danh sách sản phẩm');
        setLoading(false);
      }
    };
    fetchProducts();
  }, [currentCategoryId, page]);

  if (loading) {
    return <div className="text-center text-gray-500 p-4">Đang tải...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500 p-4">Lỗi: {error}</div>;
  }

  if (products.length === 0) {
    return (
      <div className="text-center my-12 text-gray-500 p-4">
        Không có sản phẩm nào {currentCategoryId ? 'cho danh mục này' : 'có sẵn'}
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-xl font-bold mb-4 text-center">
        {currentCategoryId ? 'Sản phẩm' : 'Tất cả sản phẩm'}
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 justify-items-center">
        {products.map((product) => (
          <div key={product.id} className="px-2">
            <Link to={`/product/${product.id}`}>
              <ProductCard
                id={product.id}
                image={product.images?.[0] || '/default-image.jpg'}
                name={product.name}
                code={product.id}
                price={product.price}
              />
            </Link>
          </div>
        ))}
      </div>
      <div className="flex justify-center mt-6">
        <button
          onClick={() => setPage(page - 1)}
          disabled={page === 1}
          className="px-4 py-2 mx-1 bg-gray-200 rounded disabled:opacity-50"
        >
          Trước
        </button>
        <span className="px-4 py-2 mx-1">{`Trang ${page} / ${totalPages}`}</span>
        <button
          onClick={() => setPage(page + 1)}
          disabled={page === totalPages}
          className="px-4 py-2 mx-1 bg-gray-200 rounded disabled:opacity-50"
        >
          Sau
        </button>
      </div>
    </div>
  );
};

export default ProductList;