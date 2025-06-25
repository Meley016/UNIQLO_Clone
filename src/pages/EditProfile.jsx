import React, { useState } from "react";

const EditProfile = () => {
  const [formData, setFormData] = useState({
    email: "minhtoan642004@gmail.com",
    changeEmail: false,
    firstName: "",
    lastName: "",
    province: "",
    district: "",
    ward: "",
    addressDetail: "",
    mobile: "",
    phone: "",
    birthDate: "2004-04-06",
    gender: "",
    subscribe: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Lưu thay đổi thành công!");
    // Bạn có thể thêm logic lưu dữ liệu ở đây
  };

  return (
    <div className="min-h-screen bg-[#fafafa] flex flex-col items-center py-10">
      <div className="w-full max-w-5xl flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <div className="w-full md:w-1/4">
          <div className="text-xs font-semibold mb-2">Tư cách thành viên</div>
          <ul className="text-sm space-y-1 mb-4 pl-2">
            <li>Hồ sơ</li>
            <li>Phiếu giảm giá</li>
            <li>Lịch sử mua hàng</li>
            <li>Lịch sử đơn hàng</li>
          </ul>
          <div className="text-xs font-semibold mb-2">Cài đặt hồ sơ</div>
          <ul className="text-sm space-y-1 pl-2">
            <li className="font-bold text-black">Chỉnh sửa hồ sơ</li>
            <li>Sổ địa chỉ</li>
            <li>Tin nhắn văn bản và cài đặt riêng</li>
            <li>Thay đổi mật khẩu của tôi</li>
            <li>Thẻ của tôi</li>
            <li>Hủy bỏ thành viên</li>
          </ul>
        </div>
        {/* Main Form */}
        <div className="w-full md:w-3/4">
          <div className="bg-white border rounded shadow-sm p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold tracking-wide">CHỈNH SỬA HỒ SƠ</h2>
              <span className="text-xs text-[#0099a8] font-semibold">Bắt buộc*</span>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email */}
              <div>
                <label className="block text-xs font-semibold mb-1">
                  ĐỊA CHỈ EMAIL*
                </label>
                <div className="flex items-center gap-4">
                  <span className="text-sm">{formData.email}</span>
                  <label className="flex items-center gap-1 text-xs font-normal">
                    <input
                      type="checkbox"
                      name="changeEmail"
                      checked={formData.changeEmail}
                      onChange={handleChange}
                    />
                    Thay đổi địa chỉ email
                  </label>
                </div>
                {formData.changeEmail && (
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="mt-2 w-full p-2 border rounded text-sm"
                    required
                  />
                )}
                <p className="text-xs text-gray-500 mt-1">
                  Nếu bạn muốn sử dụng địa chỉ hồ sơ làm "Địa chỉ thành viên", vui lòng điền đầy đủ thông tin bao gồm tên và số điện thoại của bạn.
                </p>
              </div>
              {/* Tên & Họ */}
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <label className="block text-xs font-semibold mb-1">TÊN*</label>
                  <input
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className="w-full p-2 border rounded text-sm"
                    required
                    placeholder="Vui lòng nhập tên của bạn"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-xs font-semibold mb-1">HỌ*</label>
                  <input
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className="w-full p-2 border rounded text-sm"
                    required
                    placeholder="Vui lòng nhập họ của bạn"
                  />
                </div>
              </div>
              {/* Tỉnh, Quận, Phường */}
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <label className="block text-xs font-semibold mb-1">TỈNH*</label>
                  <select
                    name="province"
                    value={formData.province}
                    onChange={handleChange}
                    className="w-full p-2 border rounded text-sm"
                    required
                  >
                    <option value="">Vui lòng chọn một tỉnh.</option>
                    <option value="HCM">TP. Hồ Chí Minh</option>
                    <option value="HN">Hà Nội</option>
                  </select>
                </div>
                <div className="flex-1">
                  <label className="block text-xs font-semibold mb-1">QUẬN*</label>
                  <select
                    name="district"
                    value={formData.district}
                    onChange={handleChange}
                    className="w-full p-2 border rounded text-sm"
                    required
                  >
                    <option value="">Vui lòng chọn quận của bạn.</option>
                    <option value="1">Quận 1</option>
                    <option value="2">Quận 2</option>
                  </select>
                </div>
                <div className="flex-1">
                  <label className="block text-xs font-semibold mb-1">PHƯỜNG*</label>
                  <select
                    name="ward"
                    value={formData.ward}
                    onChange={handleChange}
                    className="w-full p-2 border rounded text-sm"
                    required
                  >
                    <option value="">Vui lòng chọn phường của bạn.</option>
                    <option value="A">Phường A</option>
                    <option value="B">Phường B</option>
                  </select>
                </div>
              </div>
              {/* Chi tiết địa chỉ */}
              <div>
                <label className="block text-xs font-semibold mb-1">
                  CHI TIẾT ĐỊA CHỈ
                </label>
                <input
                  name="addressDetail"
                  value={formData.addressDetail}
                  onChange={handleChange}
                  className="w-full p-2 border rounded text-sm"
                  placeholder="tòa nhà A, block B, tháp C, đường D"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Để đảm bảo hợp lệ, vui lòng điền địa chỉ bằng tiếng Việt có dấu.
                </p>
              </div>
              {/* Điện thoại di động & Điện thoại bàn */}
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <label className="block text-xs font-semibold mb-1">
                    ĐIỆN THOẠI DI ĐỘNG*
                  </label>
                  <input
                    name="mobile"
                    value={formData.mobile}
                    onChange={handleChange}
                    className="w-full p-2 border rounded text-sm"
                    required
                    placeholder="Nhập 10 số bắt đầu bằng số 0"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-xs font-semibold mb-1">
                    ĐIỆN THOẠI
                  </label>
                  <input
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full p-2 border rounded text-sm"
                    placeholder="Nhập 10-11 số bắt đầu bằng 0"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Vui lòng nhập 10-11 số bắt đầu bằng 0
                  </p>
                </div>
              </div>
              {/* Sinh nhật */}
              <div>
                <label className="block text-xs font-semibold mb-1">
                  SINH NHẬT
                </label>
                <input
                  type="date"
                  name="birthDate"
                  value={formData.birthDate}
                  readOnly
                  className="w-full p-2 border rounded bg-gray-100 text-sm"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Không thể chỉnh sửa ngày sinh sau khi đăng ký tài khoản.
                </p>
              </div>
              {/* Giới tính */}
              <div>
                <label className="block text-xs font-semibold mb-1">
                  GIỚI TÍNH
                </label>
                <div className="flex gap-6 mt-1">
                  <label className="flex items-center gap-1 text-sm">
                    <input
                      type="radio"
                      name="gender"
                      value="Nam"
                      checked={formData.gender === "Nam"}
                      onChange={handleChange}
                    />
                    Nam
                  </label>
                  <label className="flex items-center gap-1 text-sm">
                    <input
                      type="radio"
                      name="gender"
                      value="Nữ"
                      checked={formData.gender === "Nữ"}
                      onChange={handleChange}
                    />
                    Nữ
                  </label>
                  <label className="flex items-center gap-1 text-sm">
                    <input
                      type="radio"
                      name="gender"
                      value=""
                      checked={formData.gender === ""}
                      onChange={handleChange}
                    />
                    Bỏ chọn
                  </label>
                </div>
              </div>
              {/* Xác nhận đăng ký */}
              <div>
                <label className="flex items-center text-sm">
                  <input
                    type="checkbox"
                    name="subscribe"
                    checked={formData.subscribe}
                    onChange={handleChange}
                  />
                  <span className="ml-2">Thư điện tử UNIQLO</span>
                </label>
              </div>
              {/* Nút lưu */}
              <button
                type="submit"
                className="w-full mt-6 bg-black text-white px-4 py-2 rounded hover:bg-gray-800 font-semibold tracking-wider"
              >
                LƯU THAY ĐỔI
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;