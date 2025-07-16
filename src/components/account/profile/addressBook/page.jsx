import React from 'react';

export default function AddressBookSection() {
  return (
    <div className="border p-6 rounded-lg shadow-sm">
      <h2 className="text-xl font-semibold mb-4">SỔ ĐỊA CHỈ</h2>
      <p className="text-sm">Chưa có địa chỉ nào được lưu.</p>
      <button className="mt-6 px-4 py-2 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600">
        THÊM ĐỊA CHỈ
      </button>
    </div>
  );
}