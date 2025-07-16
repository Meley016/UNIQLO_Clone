import React from 'react';

export default function ChangePasswordSection() {
  return (
    <div className="border p-6 rounded-lg shadow-sm">
      <h2 className="text-xl font-semibold mb-4">THAY ĐỔI MẬT KHẨU</h2>
      <form className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Mật khẩu hiện tại</label>
          <input
            type="password"
            placeholder="Nhập mật khẩu hiện tại"
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Mật khẩu mới</label>
          <input
            type="password"
            placeholder="Nhập mật khẩu mới"
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Xác nhận mật khẩu mới</label>
          <input
            type="password"
            placeholder="Xác nhận mật khẩu mới"
            className="w-full p-2 border rounded"
          />
        </div>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600"
        >
          THAY ĐỔI MẬT KHẨU
        </button>
      </form>
    </div>
  );
}