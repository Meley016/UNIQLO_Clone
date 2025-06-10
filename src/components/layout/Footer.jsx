import React from 'react';
import { Link } from 'react-router-dom';

const AppFooter = () => {
  return (
    <footer className="relative bg-gray-900 text-gray-300 py-10">
      <div className="container mx-auto px-4 relative z-0">
        <div className="flex justify-center space-x-12 mb-8 text-sm">
          <div className="flex items-center">
            <span className="mr-2">↻</span>
            <span>Đổi trả trong 30 ngày</span>
          </div>
          <div className="flex items-center">
            <span className="mr-2">🎧</span>
            <span>Hỗ trợ khách hàng 24/7</span>
          </div>
          <div className="flex items-center">
            <span className="mr-2">🔒</span>
            <span>Thanh toán an toàn 100%</span>
          </div>
        </div>
        <div className="text-center mb-10">
          <h2 className="text-xl font-bold text-blue-500 mb-2">
            ĐỪNG BỎ LỠ CÁC ƯU ĐÃI!
          </h2>
          <p className="mb-4">
            Đăng ký nhận bản tin để cập nhật các ưu đãi hấp dẫn!
          </p>
          <div className="flex justify-center">
            <input
              type="email"
              placeholder="Email"
              className="px-4 py-2 rounded-l-md bg-gray-800 border-none text-gray-300 focus:outline-none"
            />
            <button className="px-4 py-2 bg-white text-black rounded-r-md hover:bg-gray-200">
              Gửi
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          <div>
            <h3 className="text-2xl font-bold text-white mb-4">SHOP SIDA</h3>
            <p className="text-sm mb-2">Công ty TNHH SHOP SIDA</p>
            <p className="text-sm mb-2">Được cấp phép bởi Sở Kế hoạch và Đầu tư</p>
            <p className="text-sm mb-2">
              Số 12 Cống Quỳnh, Nguyễn Cư Trinh, Quận 1, Việt Nam
            </p>
            <p className="text-sm mb-2">shopsida@gmail.com</p>
            <p className="text-sm mb-2">Số điện thoại: +84 947315815</p>
            <p className="text-sm">
              Hỗ trợ khách hàng: 9:00 - 17:00 (Thứ 2 - Thứ 6)
            </p>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Cửa hàng</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="hover:underline">Trang chủ</Link></li>
              <li><Link to="/categories" className="hover:underline">Danh mục</Link></li>
              <li><Link to="/collections" className="hover:underline">Bộ sưu tập</Link></li>
              <li><Link to="/art-exhibitions" className="hover:underline">Triển lãm nghệ thuật</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Liên kết nhanh</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/about" className="hover:underline">Về ShopSida</Link></li>
              <li><Link to="/contact" className="hover:underline">Liên hệ</Link></li>
              <li><Link to="/blog" className="hover:underline">Blog</Link></li>
              <li><Link to="/embroidery-effects" className="hover:underline">Hiệu ứng thêu</Link></li>
              <li><Link to="/track-order" className="hover:underline">Theo dõi đơn hàng</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Thông tin</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/shipping-policy" className="hover:underline">Chính sách vận chuyển</Link></li>
              <li><Link to="/return-policy" className="hover:underline">Chính sách đổi trả</Link></li>
              <li><Link to="/terms-of-service" className="hover:underline">Điều khoản dịch vụ</Link></li>
              <li><Link to="/privacy-policy" className="hover:underline">Chính sách bảo mật</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Bản tin</h4>
            <p className="text-sm mb-4">Cập nhật ưu đãi hàng tuần của chúng tôi!</p>
          </div>
        </div>
        <div className="text-center mt-10">
          <p className="mb-4">Theo dõi chúng tôi trên các nền tảng khác</p>
          <div className="flex justify-center space-x-4">
            <Link to="https://facebook.com" className="text-gray-300 hover:text-white">📘</Link>
            <Link to="https://tiktok.com" className="text-gray-300 hover:text-white">🎵</Link>
            <Link to="https://instagram.com" className="text-gray-300 hover:text-white">📸</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default AppFooter;