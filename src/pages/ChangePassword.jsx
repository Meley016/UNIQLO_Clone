// import React, { useState } from "react";
// import { Link } from "react-router-dom";
// const ChangePassword = () => {
//   const [form, setForm] = useState({
//     currentPassword: "",
//     newPassword: "",
//     showPassword: false,
//   });

//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setForm({   
//       ...form,
//       [name]: type === "checkbox" ? checked : value,
//     });
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     // Xử lý đổi mật khẩu ở đây
//     alert("Đổi mật khẩu thành công!");
//   };

//   return (
//     <div className="min-h-screen bg-[#fafafa] flex flex-col items-center py-10">
//       <div className="w-full max-w-5xl flex flex-col md:flex-row gap-8">
//         {/* Sidebar */}
//         <div className="w-full md:w-1/4">
//           <div className="text-xs font-semibold mb-2">Cài đặt hồ sơ</div>
//           <ul className="text-sm space-y-1 pl-2">
//             <li>
//               <a href="/edit-profile" className="hover:underline text-blue-600">Chỉnh sửa hồ sơ</a>
//             </li>
//             <li>
//               <span className="font-bold text-black">Thay đổi mật khẩu của tôi</span>
//             </li>
//             <li>Sổ địa chỉ</li>
//             <li>Tin nhắn văn bản và cài đặt riêng</li>
//             <li>Thẻ của tôi</li>
//             <li>Hủy bỏ thành viên</li>
//           </ul>
//         </div>
//         {/* Main content */}
//         <div className="w-full md:w-3/4">
//           <div className="bg-white border rounded shadow-sm p-8">
//             <h2 className="text-xl font-bold mb-6 tracking-wide">THAY ĐỔI MẬT KHẨU CỦA TÔI</h2>
//             <form onSubmit={handleSubmit} className="space-y-4">
//               <div>
//                 <label className="block text-sm font-semibold mb-1">
//                   MẬT KHẨU HIỆN TẠI
//                 </label>
//                 <input
//                   type={form.showPassword ? "text" : "password"}
//                   name="currentPassword"
//                   value={form.currentPassword}
//                   onChange={handleChange}
//                   className="w-full p-2 border rounded text-sm"
//                   required
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-semibold mb-1">
//                   MẬT KHẨU MỚI
//                 </label>
//                 <input
//                   type={form.showPassword ? "text" : "password"}
//                   name="newPassword"
//                   value={form.newPassword}
//                   onChange={handleChange}
//                   className="w-full p-2 border rounded text-sm"
//                   required
//                 />
//                 <p className="text-xs text-gray-500 mt-1">
                
//                 </p>
//               </div>
//               <div className="flex items-center mb-2">
//                 <input
//                   type="checkbox"
//                   name="showPassword"
//                   checked={form.showPassword}
//                   onChange={handleChange}
//                   id="showPassword"
//                   className="mr-2"
//                 />
//                 <label htmlFor="showPassword" className="text-sm">
//                   Hiện mật khẩu
//                 </label>
//               </div>
//               <button
//                 type="submit"
//                 className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 font-semibold tracking-wider"
//               >
//                 THAY ĐỔI MẬT KHẨU CỦA TÔI
//               </button>
//             </form>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ChangePassword;