import React from 'react';

const CategoryCard = ({ image, name }) => {
  return (
    <div className="border border-gray-200 rounded-lg p-4 w-52 text-center shadow-md m-4">
      <img
        src={image}
        className="w-full h-36 object-cover rounded-lg"
      />
      <h2 className="text-lg font-semibold text-gray-800 mt-3 mb-2">{name}</h2>
      <div className="flex justify-between text-sm text-gray-600">
      </div>
      <button
        className="mt-3 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-300"
        onClick={(e) => e.stopPropagation()} 
      >
        Xem
      </button>
    </div>
  );
};

export default CategoryCard;