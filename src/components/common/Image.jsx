import React from 'react';
import { Link } from 'react-router-dom';

const Image = ({ imageSrc, categoryName }) => {
  return (
    <Link
      to={`/${categoryName.toLowerCase()}`}
      className="block w-full"
    >
      <img
        src={imageSrc}
        alt={categoryName}
        className="w-full max-h-[300px] object-cover rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
      />
      <p className="text-center mt-2 text-sm font-medium">{categoryName}</p>
    </Link>
  );
};

export default Image;