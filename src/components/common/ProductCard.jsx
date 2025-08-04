import React from 'react';

const ProductCard = ({ image, name, code, price, colors = [] }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-md p-4 w-full h-full flex flex-col justify-between">
      <img
        src={image}
        alt={name}
        className="w-full h-40 object-contain mb-3 rounded"
      />

      <div className="flex-grow flex flex-col justify-between text-center">
        <h2 className="text-base font-semibold text-gray-800 mb-1 line-clamp-2 min-h-[2.5rem]">
          {name}
        </h2>
        <div className="text-xs text-gray-500 break-words mb-1">{code}</div>
        <div className="text-red-500 font-semibold text-sm mb-2">
          {price.toLocaleString('vi-VN')} VND
        </div>

        {colors.length > 0 && (
          <div className="flex justify-center gap-1 mb-3">
            {colors.map((color, index) => {
              const bgColor =
                typeof color === 'string'
                  ? color
                  : color?.code || color?.name || '#ccc'; // fallback nếu color là object
              return (
                <div
                  key={index}
                  className="w-5 h-5 rounded-full border border-gray-300"
                  style={{ backgroundColor: bgColor }}
                  title={bgColor}
                />
              );
            })}
          </div>
        )}
      </div>

      <button
        className="mt-auto px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition"
        onClick={(e) => e.stopPropagation()}
      >
        Thêm vào giỏ hàng
      </button>
    </div>
  );
};

export default ProductCard;
