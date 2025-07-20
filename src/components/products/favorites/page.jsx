import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    // Lấy danh sách yêu thích từ localStorage
    const savedFavorites = JSON.parse(localStorage.getItem('favorites')) || [];
    setFavorites(savedFavorites);
  }, []);

  const handleRemoveFavorite = (id) => {
    const updatedFavorites = favorites.filter((item) => item.id !== id);
    localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
    setFavorites(updatedFavorites);
    alert('Đã xóa khỏi danh sách yêu thích!');
  };

  if (favorites.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8 text-center text-gray-500">
        Chưa có sản phẩm nào trong danh sách yêu thích
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-4 text-center">Danh sách yêu thích</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {favorites.map((product) => (
          <div key={product.id} className="bg-white p-2 rounded-lg shadow">
            <Link to={`/product/${product.id}`} className="block">
              <img
                src={product.image || '/default-image.jpg'}
                alt={product.name}
                className="w-full h-48 object-cover rounded-t-lg"
              />
              <div className="p-2">
                <h4 className="text-sm font-medium">{product.name}</h4>
                <p className="text-sm text-gray-600">{product.price.toLocaleString('vi-VN')} VND</p>
              </div>
            </Link>
            <button
              onClick={() => handleRemoveFavorite(product.id)}
              className="w-full mt-2 bg-red-500 text-white py-1 rounded hover:bg-red-600 transition"
            >
              Xóa khỏi yêu thích
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Favorites;