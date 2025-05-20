import React from 'react';

const Category = ({ name, image }) => {
  return (
    <div className="bg-gray-200 p-4 rounded-lg text-center">
      <img
        src={image}
        alt={name}
        className="w-full h-48 object-cover mx-auto mb-2"
      />
      <h3 className="text-lg font-semibold">{name.toUpperCase()}</h3>
    </div>
  );
};

export default Category;