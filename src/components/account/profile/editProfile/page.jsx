import { message } from 'antd';
import { useEffect, useState } from 'react';
import axiosInstance from '../../../../utils/axios'; // Điều chỉnh đường dẫn theo cấu trúc dự án

export default function EditProfileSection() {
  const [formData, setFormData] = useState({
    email: '',
    birthdate: '',
    gender: 'male',
  });
  const [loading, setLoading] = useState(true);
  const userId = localStorage.getItem('userId'); // Lấy userId từ localStorage

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axiosInstance.get(`/Customer/${userId}`);
        const user = response.data;
        setFormData({
          email: user.email || '',
          birthdate: user.createdAt ? new Date(user.createdAt).toISOString().split('T')[0] : '',
          gender: user.gender || 'male',
        });
      } catch (error) {
        console.error('Lỗi khi lấy thông tin hồ sơ:', error);
        message.error('Không thể tải thông tin hồ sơ.');
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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updates = {
        email: formData.email,
        createdAt: formData.birthdate ? new Date(formData.birthdate).toISOString() : undefined,
        gender: formData.gender,
      };
      await axiosInstance.patch(`/Customer/${userId}`, updates);
      message.success('Cập nhật hồ sơ thành công!');
    } catch (error) {
      console.error('Lỗi khi cập nhật hồ sơ:', error);
      message.error('Cập nhật thất bại. Vui lòng thử lại.');
    }
  };

  if (loading) return <div>Đang tải...</div>;

  return (
    <div className="border p-6 rounded-lg shadow-sm">
      <h2 className="text-xl font-semibold mb-4">CHỈNH SỬA HỒ SƠ</h2>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label className="block text-sm font-medium">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Sinh nhật</label>
          <input
            type="date"
            name="birthdate"
            value={formData.birthdate}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Giới tính</label>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          >
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