import { BrowserRouter, Route, Routes } from 'react-router-dom';
import CartPage from './components/account/cart/cart';
import PaymentMethod from './components/account/payment/page';
import CODCheckout from './components/account/payment/payment_COD.jsx/page';
import PaypalCheckout from './components/account/payment/payment_Paypal.jsx/page';
import Profile from './components/account/profile/page';
import AppFooter from './components/layout/Footer';
import AppHeader from './components/layout/Header';
import Favorites from './components/products/favorites/page';
import ProductDetail from './components/products/productdetail/page';
import ProductList from './components/products/productlist/page';
import Search from './components/search/page';
import SearchResults from './components/search/results/page';
import LoginLayout from './components/ui/login/layout';
import LoginPage from './components/ui/login/page';
import RegisterLayout from './components/ui/register/layout';
import RegisterPage from './components/ui/register/page';
import './index.css';
import HomePage from './pages/Home';
import PaypalSuccess from './pages/paypal_success';
import PayPalRedirect from './services/paypalRedirect';

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
            <Route path='/payment-success' element={<PaypalSuccess />} />
            <Route path="/paypal-redirect" element={<PayPalRedirect />} />
            {/* <Route path="/:parentCategoryName" element={<SubCategoryList />} /> */}
            <Route path="/:parentCategoryName" element={<ProductList />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/favorites" element={<Favorites />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/payment" element={<PaymentMethod/>} />
            <Route path="/search" element={<Search />} />
            <Route path='/payment-COD' element={<CODCheckout/>} />
            <Route path='/payment-Paypal' element={<PaypalCheckout/>} />
            <Route path="/searchresults" element={<SearchResults/>} />
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