import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css';
import HomePage from './pages/Home';
import AppHeader from './components/layout/Header';
import AppFooter from './components/layout/Footer';
import ProductList from './components/products/productlist/page';
import LoginPage from './components/ui/login/page';
import LoginLayout from './components/ui/login/layout';
import RegisterPage from './components/ui/register/page';
import RegisterLayout from './components/ui/register/layout';
import SubCategoryList from './components/categories/SubCategoryList';
import MainCategoryList from './components/categories/MainCategoryList';
import ProductDetail from './components/products/productdetail/page';
<<<<<<< HEAD
import CartPage from './components/account/cart/cart';
import Profile from './pages/profile';
import Search from './components/search/page';
import SearchResults from './components/search/results/page';
=======

>>>>>>> f26f639a1c73a61a562f7c317869a75d950ee885
const App = () => {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-100 flex flex-col">
        <div className="fixed top-0 w-full z-10">
          <AppHeader />
        </div>
        <main className="pt-28 flex-1"> 
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/profile" element={<Homeprofile />} /> 
            <Route path="/:parentCategoryName" element={<SubCategoryList />} />
            <Route path="/:parentCategoryName/:subcategoryName" element={<ProductList />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/cart" element={<CartPage />} />
<<<<<<< HEAD
            <Route path="/profile" element={<Profile />} />
            <Route path="/search" element={<Search />} />
            <Route path="/searchresults" element={<SearchResults/>} />
=======
>>>>>>> f26f639a1c73a61a562f7c317869a75d950ee885
            <Route
              path="/login"
              element={
                <LoginLayout>
                  <LoginPage />
                </LoginLayout>
              }
            />
            <Route
              path="/register"
              element={
                <RegisterLayout>
                  <RegisterPage />
                </RegisterLayout>
              }
            />
          </Routes>
        </main>
        <AppFooter />
      </div>
    </BrowserRouter>
  );
};

export default App;