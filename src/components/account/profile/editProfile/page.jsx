import { message } from 'antd';
import { useEffect, useState } from 'react';
import axiosInstance from '../../../../utils/axios';

export default function EditProfileSection() {
  const [formData, setFormData] = useState({
    email: '',
    birthdate: '',
    gender: 'Male', // Mặc định theo enum Gender
  });
  const [loading, setLoading] = useState(true);
  const _id = localStorage.getItem('_id');

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axiosInstance.get(`/Customer/${_id}`);
        const user = response.data;
        setFormData({
          email: user.Email || '',
          birthdate: user.CreatedAt ? new Date(user.CreatedAt).toISOString().split('T')[0] : '',
          gender: user.Gender || 'Male', // Sử dụng enum Gender
        });
      } catch (error) {
        console.error('Lỗi khi lấy thông tin hồ sơ:', error);
        message.error('Không thể tải thông tin hồ sơ.');
      } finally {
        setLoading(false);
      }
    };

    if (_id) {
      fetchUserProfile();
    } else {
      console.error('Không tìm thấy userId trong localStorage');
      setLoading(false);
    }
  }, [_id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updates = {
        Email: formData.email,
        CreatedAt: formData.birthdate ? new Date(formData.birthdate).toISOString() : undefined,
        Gender: formData.gender,
      };
      await axiosInstance.patch(`/Customer/${_id}`, updates);
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
            <option value="Male">Nam</option>
            <option value="Female">Nữ</option>
            <option value="Undefined">Khác</option>
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