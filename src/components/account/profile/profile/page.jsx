import { useEffect, useState } from 'react';
import axiosInstance from '../../../../utils/axios'; // Điều chỉnh đường dẫn theo cấu trúc dự án

export default function ProfileSection() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const userId = localStorage.getItem('userId'); // Lấy userId từ localStorage

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axiosInstance.get(`/Customer/${userId}`);
        setUser(response.data);
      } catch (error) {
        console.error('Lỗi khi lấy thông tin hồ sơ:', error);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchUserProfile();
    } else {
      console.error('Không tìm thấy userId trong localStorage');
      setLoading(false);
    }
  }, [userId]);

  if (loading) return <div>Đang tải...</div>;
  if (!user) return <div>Không tìm thấy thông tin người dùng</div>;

  return (
    <div className="border p-6 rounded-lg shadow-sm">
      <h2 className="text-xl font-semibold mb-4">HỒ SƠ</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <p className="text-sm font-medium">ĐỊA CHỈ EMAIL</p>
          <p className="text-sm">{user.email || 'Chưa cập nhật'}</p>
        </div>
        <div>
          <p className="text-sm font-medium">SINH NHẬT</p>
          <p className="text-sm">
            {user.createdAt
              ? new Date(user.createdAt).toLocaleDateString('vi-VN')
              : 'Chưa cập nhật'}
          </p>
        </div>
        <div>
          <p className="text-sm font-medium">GIỚI TÍNH</p>
          <p className="text-sm">{user.gender || 'Chưa cập nhật'}</p>
        </div>
      </div>
      <h3 className="text-md font-semibold mb-2">MÃ VẠCH THÀNH VIÊN</h3>
      <p className="text-sm">{userId || 'Chưa có mã'}</p>
      <p className="text-xs mt-2 text-gray-600">
        Vui lòng đưa mã số thẻ thành viên này cho nhân viên thu ngân khi bạn thanh toán cho sản phẩm đã mua.
      </p>
      <button className="mt-6 px-4 py-2 bg-black text-white rounded-lg text-sm">
        IN MÃ VẠCH
      </button>
    </div>
  );
}