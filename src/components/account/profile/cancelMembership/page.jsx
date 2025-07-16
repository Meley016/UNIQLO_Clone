import React from 'react';

export default function CancelMembershipSection() {
  return (
    <div className="border p-6 rounded-lg shadow-sm">
      <h2 className="text-xl font-semibold mb-4">HỦY BỎ THÀNH VIÊN</h2>
      <p className="text-sm">Bạn có chắc chắn muốn hủy bỏ thành viên? Hành động này không thể hoàn tác.</p>
      <button className="mt-6 px-4 py-2 bg-red-500 text-white rounded-lg text-sm hover:bg-red-600">
        XÁC NHẬN HỦY BỎ
      </button>
    </div>
  );
}