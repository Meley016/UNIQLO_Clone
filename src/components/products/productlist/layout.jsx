import React from 'react';

const ProductListLayout = ({ children }) => {
  return (
    <div className="container mx-auto px-4 py-8 z-50">
      {children}
    </div>
  );
};

export default ProductListLayout;