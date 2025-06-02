import React from 'react';
import MainCategoryList from '../components/categories/MainCategoryList';
import ProductList from '../components/products/productlist/page';

const HomePage = () => {
  return (
    <div className="container mx-auto px-4 py-8 pt-24">
      <MainCategoryList />
      <ProductList/>
    </div>
  );
};

export default HomePage;