import React, { useState } from 'react';
import ProfileSection from './profile/page';
import CouponsSection from './coupons/page';
import PurchaseHistorySection from './purchaseHistory/page';
import OrderHistorySection from './orderHistory/page';
import EditProfileSection from './editProfile/page';
import AddressBookSection from './addressBook/page';
import MessagesSection from './messages/page';
import ChangePasswordSection from './changePassword/page';
import PaymentMethod from '../payment/page';

export default function Profile() {
  const [activeSection, setActiveSection] = useState('profile');

  const handleSectionChange = (section) => {
    setActiveSection(section);
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'profile':
        return <ProfileSection />;
      case 'coupons':
        return <CouponsSection />;
      case 'purchaseHistory':
        return <PurchaseHistorySection />;
      case 'orderHistory':
        return <OrderHistorySection />;
      case 'editProfile':
        return <EditProfileSection />;
      case 'addressBook':
        return <AddressBookSection />;
      case 'messages':
        return <MessagesSection />;
      case 'changePassword':
        return <ChangePasswordSection />;
      case 'cards':
        return <PaymentMethod />;
      case 'cancelMembership':
        return <CancelMembershipSection />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 w-full">
        <div className="space-y-4 text-sm">
          <div>
            <h2 className="font-semibold">Tư cách thành viên</h2>
            <div className="pl-2 space-y-2">
              <button
                onClick={() => handleSectionChange('profile')}
                className={`w-full text-left px-2 py-1 rounded ${
                  activeSection === 'profile' ? 'bg-gray-200' : 'hover:bg-gray-100'
                }`}
              >
                Hồ sơ
              </button>
              <button
                onClick={() => handleSectionChange('coupons')}
                className={`w-full text-left px-2 py-1 rounded ${
                  activeSection === 'coupons' ? 'bg-gray-200' : 'hover:bg-gray-100'
                }`}
              >
                Phiếu giảm giá
              </button>
              <button
                onClick={() => handleSectionChange('purchaseHistory')}
                className={`w-full text-left px-2 py-1 rounded ${
                  activeSection === 'purchaseHistory' ? 'bg-gray-200' : 'hover:bg-gray-100'
                }`}
              >
                Lịch sử mua hàng
              </button>
              <button
                onClick={() => handleSectionChange('orderHistory')}
                className={`w-full text-left px-2 py-1 rounded ${
                  activeSection === 'orderHistory' ? 'bg-gray-200' : 'hover:bg-gray-100'
                }`}
              >
                Lịch sử đơn hàng
              </button>
            </div>
          </div>
          <div>
            <h2 className="font-semibold">Cài đặt hồ sơ</h2>
            <div className="pl-2 space-y-2">
              <button
                onClick={() => handleSectionChange('editProfile')}
                className={`w-full text-left px-2 py-1 rounded ${
                  activeSection === 'editProfile' ? 'bg-gray-200' : 'hover:bg-gray-100'
                }`}
              >
                Chỉnh sửa hồ sơ
              </button>
              <button
                onClick={() => handleSectionChange('addressBook')}
                className={`w-full text-left px-2 py-1 rounded ${
                  activeSection === 'addressBook' ? 'bg-gray-200' : 'hover:bg-gray-100'
                }`}
              >
                Sổ địa chỉ
              </button>
              <button
                onClick={() => handleSectionChange('messages')}
                className={`w-full text-left px-2 py-1 rounded ${
                  activeSection === 'messages' ? 'bg-gray-200' : 'hover:bg-gray-100'
                }`}
              >
                Tin nhắn văn bản và cài đặt riêng
              </button>
              <button
                onClick={() => handleSectionChange('changePassword')}
                className={`w-full text-left px-2 py-1 rounded ${
                  activeSection === 'changePassword' ? 'bg-gray-200' : 'hover:bg-gray-100'
                }`}
              >
                Thay đổi mật khẩu
              </button>
              <button
                onClick={() => handleSectionChange('cards')}
                className={`w-full text-left px-2 py-1 rounded ${
                  activeSection === 'cards' ? 'bg-gray-200' : 'hover:bg-gray-100'
                }`}
              >
                Thẻ của tôi
              </button>
              <button
                onClick={() => handleSectionChange('cancelMembership')}
                className={`w-full text-left px-2 py-1 rounded ${
                  activeSection === 'cancelMembership' ? 'bg-gray-200' : 'hover:bg-gray-100'
                }`}
              >
                Hủy bỏ thành viên
              </button>
            </div>
          </div>
        </div>

        <div className="md:col-span-3">{renderContent()}</div>
      </div>
    </div>
  );
}