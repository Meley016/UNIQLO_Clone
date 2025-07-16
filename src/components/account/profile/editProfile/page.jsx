import React from 'react';

export default function EditProfileSection() {
  return (
    <div className="border p-6 rounded-lg shadow-sm">
      <h2 className="text-xl font-semibold mb-4">CHỈNH SỬA HỒ SƠ</h2>
      <form className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Email</label>
          <input
            type="email"
            defaultValue="minhtoan642004@gmail.com"
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Sinh nhật</label>
          <input
            type="date"
            defaultValue="2004-04-06"
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Giới tính</label>
          <select className="w-full p-2 border rounded">
            <option value="male">Nam</option>
            <option value="female">Nữ</option>
            <option value="other">Khác</option>
          </select>
        </div>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600"
        >
          LƯU THAY ĐỔI
        </button>
      </form>
    </div>
  );
}