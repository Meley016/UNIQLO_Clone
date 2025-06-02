import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import CategoryCard from '../common/CategoryCard';
import axios from 'axios';

const SubCategoryList = ({ parentCategoryId, parentCategoryName, onSubCategoryClick }) => {
  const params = useParams();
  const navigate = useNavigate();
  const currentParentCategoryName = params.parentCategoryName || parentCategoryName;
  const [subcategories, setSubcategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSubcategories = async () => {
      try {
        const response = await axios.get('/subcategories.json');
        const parentCategory = response.data.find(
          (cat) =>
            cat.parentCategoryName.toLowerCase() === currentParentCategoryName.toLowerCase() ||
            cat.parentCategoryId === parseInt(parentCategoryId)
        );
        setSubcategories(parentCategory?.subcategories || []);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || err.message || 'Lỗi khi lấy danh mục con');
        setLoading(false);
      }
    };

    fetchSubcategories();
  }, [parentCategoryId, currentParentCategoryName]);

  if (loading) {
    return <div className="text-center text-gray-500 p-4">Đang tải...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500 p-4">Lỗi: {error}</div>;
  }

  if (subcategories.length === 0) {
    return (
      <div className="text-center my-12 text-gray-500 p-4">
        Hiện chưa có danh mục con cho {currentParentCategoryName}
      </div>
    );
  }

  const handleSubCategoryClick = (subcategoryName) => {
    if (onSubCategoryClick) {
      onSubCategoryClick(subcategoryName);
    }
    navigate(`/${currentParentCategoryName.toLowerCase()}/${subcategoryName.toLowerCase().replace(/\s+/g, '-')}`);
  };

  return (
    <div className="container mx-auto px-4 z-50 py-8">
      <h2 className="text-xl font-bold mb-4 text-center">
        {currentParentCategoryName}
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 justify-items-center">
        {subcategories.map((subcat) => (
          <div key={subcat.id} className="px-2">
            <Link
              to={`/${currentParentCategoryName.toLowerCase()}/${subcat.name.toLowerCase().replace(/\s+/g, '-')}`}
              className="block"
              onClick={() => handleSubCategoryClick(subcat.name)}
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