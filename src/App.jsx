import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css';
import AppHeader from './layout/Header';
import AppFooter from './layout/Footer';

const App = () => {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-100 flex flex-col">
        <div className="fixed top-0 w-full z-10">
          <AppHeader />
        </div>
        <main className="container mx-auto mt-20 px-4 py-8 flex-grow">
          <Routes>
            {/* <Route path="/" element={<HomePage />} /> */}
            <Route path="/men" element={<h2 className="text-2xl font-bold">Bộ sưu tập Nam</h2>} />
            <Route path="/women" element={<h2 className="text-2xl font-bold">Bộ sưu tập Nữ</h2>} />
            <Route path="/handbags" element={<h2 className="text-2xl font-bold">Túi Xách</h2>} />
            <Route path="/shoes" element={<h2 className="text-2xl font-bold">Giày</h2>} />
            <Route path="/accessories" element={<h2 className="text-2xl font-bold">Phụ Kiện</h2>} />
            <Route path="/account" element={<h2 className="text-2xl font-bold">Tài khoản</h2>} />
            <Route path="/cart" element={<h2 className="text-2xl font-bold">Giỏ hàng</h2>} />
            <Route path="/categories" element={<h2 className="text-2xl font-bold">Danh mục</h2>} />
            <Route path="/collections" element={<h2 className="text-2xl font-bold">Bộ sưu tập</h2>} />
            <Route path="/art-exhibitions" element={<h2 className="text-2xl font-bold">Triển lãm nghệ thuật</h2>} />
            <Route path="/about" element={<h2 className="text-2xl font-bold">Về ShopSida</h2>} />
            <Route path="/contact" element={<h2 className="text-2xl font-bold">Liên hệ</h2>} />
            <Route path="/blog" element={<h2 className="text-2xl font-bold">Blog</h2>} />
            <Route path="/embroidery-effects" element={<h2 className="text-2xl font-bold">Hiệu ứng thêu</h2>} />
            <Route path="/track-order" element={<h2 className="text-2xl font-bold">Theo dõi đơn hàng</h2>} />
            <Route path="/shipping-policy" element={<h2 className="text-2xl font-bold">Chính sách vận chuyển</h2>} />
            <Route path="/return-policy" element={<h2 className="text-2xl font-bold">Chính sách đổi trả</h2>} />
            <Route path="/terms-of-service" element={<h2 className="text-2xl font-bold">Điều khoản dịch vụ</h2>} />
            <Route path="/privacy-policy" element={<h2 className="text-2xl font-bold">Chính sách bảo mật</h2>} />
          </Routes>
        </main>
        <AppFooter />
      </div>
    </BrowserRouter>
  );
};

export default App;