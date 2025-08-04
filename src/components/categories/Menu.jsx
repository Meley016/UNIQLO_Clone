import React, { useState, useEffect } from 'react';
import { Menu } from 'antd';
import { RightOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axios';
import ProductCard from '../common/ProductCard';

const HamburgerMenu = ({ isMenuOpen, setIsMenuOpen }) => {
  const [categories, setCategories] = useState([]);
  const [hoveredCategory, setHoveredCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [errorProducts, setErrorProducts] = useState(null);
  const navigate = useNavigate();

  // Lấy danh sách danh mục chính
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axiosInstance.get('/Categories/all');
        console.log('Categories response:', response.data);
        const categoriesData = response.data.items || response.data;
        if (!Array.isArray(categoriesData)) {
          throw new Error('Dữ liệu danh mục không phải mảng');
        }
        setCategories(categoriesData);
      } catch (error) {
        console.error('Lỗi khi lấy danh mục:', error.message || 'Đã xảy ra lỗi');
      }
    };

    fetchCategories();
  }, []);

  // Lấy danh sách sản phẩm và lọc theo categoryId
  useEffect(() => {
    if (!hoveredCategory) {
      setProducts([]);
      setLoadingProducts(false);
      setErrorProducts(null);
      return;
    }

    const fetchProducts = async () => {
      setLoadingProducts(true);
      setErrorProducts(null);
      try {
        console.log('Fetching all products for filtering:', {
          categoryId: hoveredCategory.id,
          categoryName: hoveredCategory.categories_name,
        });
        const response = await axiosInstance.get('/Products', {
          params: {
            page: 1,
            pageSize: 100, // Lấy số lượng lớn để đảm bảo có đủ sản phẩm
          },
        });
        console.log('Products response:', response.data);
        if (!response.data.items || !Array.isArray(response.data.items)) {
          throw new Error('Dữ liệu sản phẩm không hợp lệ hoặc không phải mảng');
        }
        // Lọc sản phẩm theo categoryId
        const filteredProducts = response.data.items
          .filter((product) => product.categoryId === hoveredCategory.id)
          .slice(0, 6); // Giới hạn tối đa 6 sản phẩm
        setProducts(filteredProducts);
        setLoadingProducts(false);
      } catch (err) {
        console.error('Lỗi khi lấy sản phẩm:', err);
        setErrorProducts(err.message || 'Đã xảy ra lỗi khi lấy danh sách sản phẩm');
        setLoadingProducts(false);
      }
    };

    fetchProducts();
  }, [hoveredCategory]);

  const handleCategoryClick = (category) => {
    setHoveredCategory(category);
  };

  const handleProductClick = (productId) => {
    console.log('Navigating to product:', productId);
    navigate(`/product/${productId}`);
    setIsMenuOpen(false);
    setHoveredCategory(null);
  };

  const handleViewAllProducts = (categoryName) => {
    const categoryUrl = categoryName.toLowerCase().replace(/\s+/g, '-');
    console.log('Navigating to category:', categoryUrl);
    navigate(`/${categoryUrl}`);
    setIsMenuOpen(false);
    setHoveredCategory(null);
  };

  return (
    <div
      className={`fixed inset-0 h-full z-50 flex transition-opacity duration-700 ease-in-out ${
        isMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
    >
      <div
        className={`w-1/4 bg-white shadow-lg transform transition-transform duration-700 ease-in-out ${
          isMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <Menu
          className="my-12 mx-6"
          mode="vertical"
          items={categories.map((category) => ({
            key: category.id.toString(),
            label: (
              <div
                className="text-auto justify-between items-center w-full"
                onMouseEnter={() => handleCategoryClick(category)}
              >
                {category.categories_name}
                <RightOutlined className="ml-2" />
              </div>
            ),
          }))}
          style={{ backgroundColor: 'white', color: 'black', height: 'auto' }}
        />
      </div>
      {hoveredCategory && (
        <div
          className={`w-2/4 bg-white z-50 max-h-screen overflow-y-auto transform transition-transform duration-700 ease-in-out ${
            isMenuOpen ? 'translate-x-0' : '-translate-x-full'
          } p-6`}
        >
          <h3 className="text-xl font-semibold mb-4">
            Sản phẩm trong {hoveredCategory.categories_name}
          </h3>
          {loadingProducts && (
            <div className="text-center text-gray-500 p-4">Đang tải sản phẩm...</div>
          )}
          {errorProducts && (
            <div className="text-center text-red-500 p-4">Lỗi: {errorProducts}</div>
          )}
          {!loadingProducts && !errorProducts && products.length === 0 && (
            <div className="text-center text-gray-500 p-4">
              Không có sản phẩm nào trong danh mục này
            </div>
          )}
          {!loadingProducts && !errorProducts && products.length > 0 && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {products.map((product) => (
                  <div key={product.id} onClick={() => handleProductClick(product.id)}>
                    <ProductCard
                      id={product.id}
                      image={product.images?.[0] || '/default-image.jpg'}
                      name={product.name}
                      code={product.id}
                      price={product.price}
                    />
                  </div>
                ))}
              </div>
              <button
                onClick={() => handleViewAllProducts(hoveredCategory.categories_name)}
                className="block w-full text-center text-blue-500 hover:underline mt-4"
              >
                Xem tất cả sản phẩm
              </button>
            </>
          )}
        </div>
      )}
      <div
        className={`flex-1 bg-black bg-opacity-50 backdrop-blur-sm transition-opacity duration-700 ease-in-out ${
          isMenuOpen ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={() => {
          setIsMenuOpen(false);
          setHoveredCategory(null);
        }}
      />
    </div>
  );
};

export default HamburgerMenu;