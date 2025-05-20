import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import CategoryCard from '../common/CategoryCard';

const SubCategoryList = ({ parentCategoryId, parentCategoryName }) => {
  const [subcategories, setSubcategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSubcategories = async () => {
      try {
        const response = await fetch('/subcategories.json');
        if (!response.ok) {
          throw new Error('Lỗi khi lấy dữ liệu danh mục con');
        }
        const data = await response.json();
        const parentCategory = data.find(
          (cat) => cat.parentCategoryId === parseInt(parentCategoryId)
        );
        setSubcategories(parentCategory?.subcategories || []);
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Đã xảy ra lỗi');
        setLoading(false);
      }
    };

    fetchSubcategories();
  }, [parentCategoryId]);

  if (loading) {
    return <div className="text-center text-gray-500 p-4">Đang tải...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500 p-4">Lỗi: {error}</div>;
  }

  if (subcategories.length === 0) {
    return (
      <div className="text-center my-12 text-gray-500 p-4">
        Không có danh mục con cho {parentCategoryName}
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 z-50 py-8">
      <h2 className="text-xl font-bold mb-4 text-center">
        Danh mục con {parentCategoryName}
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 justify-items-center">
        {subcategories.map((subcat) => (
          <div key={subcat.id} className="px-2">
            <Link
              to={`/${parentCategoryName.toLowerCase()}/${subcat.name.toLowerCase().replace(/\s+/g, '-')}`}
              className="block"
            >
              <CategoryCard
                id={subcat.id}
                image={subcat.image}
                name={subcat.name}
              />
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SubCategoryList;