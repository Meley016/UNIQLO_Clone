import React from 'react';
import { Link } from 'react-router-dom';

const ProductCard = ({ id, image, name, code, price }) => {
  return (
    <Link
      to={`/product/${id}`}
      className="border border-gray-200 rounded-lg p-4 w-52 text-center shadow-md m-4 block hover:shadow-lg transition-shadow"
    >
      <img
        src={image}
        alt={name}
        className="w-full h-36 object-cover rounded-lg"
      />
      <h2 className="text-lg font-semibold text-gray-800 mt-3 mb-2">{name}</h2>
      <div className="flex justify-between text-sm text-gray-600">
        <span className="font-bold">{code}</span>
        <span className="text-pink-600">{price.toLocaleString('vi-VN')} VND</span>
      </div>
      <button
        className="mt-3 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-300"
        onClick={(e) => e.stopPropagation()} // Ngăn chặn điều hướng khi nhấn nút
      >
        Thêm vào giỏ hàng
      </button>
    </Link>
  );
};

export default ProductCard;