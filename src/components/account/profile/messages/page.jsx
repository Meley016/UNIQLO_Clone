import React from 'react';

export default function MessagesSection() {
  return (
    <div className="border p-6 rounded-lg shadow-sm">
      <h2 className="text-xl font-semibold mb-4">TIN NHẮN VĂN BẢN VÀ CÀI ĐẶT RIÊNG</h2>
      <p className="text-sm">Cài đặt thông báo tin nhắn văn bản.</p>
      <div className="mt-4">
        <label className="flex items-center space-x-2">
          <input type="checkbox" className="form-checkbox" />
          <span className="text-sm">Nhận thông báo qua SMS</span>
        </label>
      </div>
      <button className="mt-6 px-4 py-2 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600">
        LƯU CÀI ĐẶT
      </button>
    </div>
  );
}