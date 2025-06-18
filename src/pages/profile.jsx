import React from "react";
import OrderHistory from "../components/account/profile/OrderHistory";
export default function Profile() {
  return (
    <div className="p-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="space-y-4 text-sm">
          <div>
            <h2 className="font-semibold">Tư cách thành viên</h2>
            <ul className="pl-2">
              <li>Hồ sơ</li>
              <li>Phiếu giảm giá</li>
              <li>Lịch sử mua hàng</li>
             {/* LỊCH SỬ MUA HÀNG */}
            <div className="mt-10">
            <h2 className="text-xl font-semibold mb-4">Lịch sử mua hàng</h2>
            <OrderHistory />
            </div>

            </ul>
            
          </div>     

     
          <div>
            <h2 className="font-semibold">Cài đặt hồ sơ</h2>
            <ul className="pl-2">
              <li>Chỉnh sửa hồ sơ</li>
              <li>Sổ địa chỉ</li>
              <li>Tin nhắn văn bản và cài đặt riêng</li>
              <li>Thay đổi mật khẩu của tôi</li>
              <li>Thẻ của tôi</li>
              <li>Hủy bỏ thành viên</li>
            </ul>
          </div>
        </div>

        {/* Profile Info */}
        <div className="md:col-span-3 border p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-4">HỒ SƠ</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <p className="text-sm font-medium">ĐỊA CHỈ EMAIL</p>
              <p className="text-sm">minhtoan642004@gmail.com</p>
            </div>
            <div>
              <p className="text-sm font-medium">SINH NHẬT</p>
              <p className="text-sm">06/04/2004</p>
            </div>
            <div>
              <p className="text-sm font-medium">GIỚI TÍNH</p>
              <p className="text-sm">Nam</p>
            </div>
          </div>

          <h3 className="text-md font-semibold mb-2">MÃ VẠCH THÀNH VIÊN</h3>
          <p className="text-sm">7256138772460</p>
          <p className="text-xs mt-2 text-gray-600">
            Vui lòng đưa mã số thẻ thành viên này cho nhân viên thu ngân khi bạn thanh toán cho sản phẩm đã mua.
          </p>

          <button className="mt-6 px-4 py-2 bg-black text-white rounded-lg text-sm">
            IN MÃ VẠCH
          </button>
        </div>
      </div>
    </div>
  );
}