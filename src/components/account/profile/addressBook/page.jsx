import { useState } from 'react';

export default function AddressBookSection({
  addresses,
  selectedAddress,
  setSelectedAddress,
  showAddressModal,
  setShowAddressModal,
  newAddress,
  setNewAddress,
  handleAddAddress,
}) {
  const [editAddress, setEditAddress] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  // Load addresses from localStorage with error handling
  const loadAddressesFromStorage = () => {
    try {
      const storedAddresses = localStorage.getItem('addresses');
      if (storedAddresses) {
        const parsedAddresses = JSON.parse(storedAddresses);
        return Array.isArray(parsedAddresses) ? parsedAddresses : [];
      }
      return addresses.length > 0 ? addresses : [];
    } catch (error) {
      console.error('Error parsing addresses from localStorage:', error);
      return addresses.length > 0 ? addresses : [];
    }
  };

  const [localAddresses, setLocalAddresses] = useState(loadAddressesFromStorage);

  // Save addresses to localStorage
  const saveAddressesToStorage = (updatedAddresses) => {
    setLocalAddresses(updatedAddresses);
    localStorage.setItem('addresses', JSON.stringify(updatedAddresses));
  };

  // Handle editing an address
  const handleEditAddress = (address) => {
    setEditAddress(address);
    setShowEditModal(true);
  };

  // Save edited address
  const handleSaveEdit = () => {
    if (editAddress) {
      const updatedAddresses = localAddresses.map((addr) =>
        addr.id === editAddress.id ? editAddress : addr
      );
      saveAddressesToStorage(updatedAddresses);
      setSelectedAddress(editAddress);
      setShowEditModal(false);
    }
  };

  // Handle deleting an address
  const handleDeleteAddress = (id) => {
    const updatedAddresses = localAddresses.filter((addr) => addr.id !== id);
    saveAddressesToStorage(updatedAddresses);
    if (selectedAddress?.id === id) setSelectedAddress(null);
  };

  // Override handleAddAddress to sync with localAddresses
  const customHandleAddAddress = (e) => {
    e.preventDefault();
    const addressId = Date.now().toString();
    const newAddressData = { id: addressId, ...newAddress, createdAt: new Date().toISOString() };
    const updatedAddresses = [...localAddresses, newAddressData];
    saveAddressesToStorage(updatedAddresses);
    setNewAddress({ fullName: '', phone: '', address: '', email: '' });
    setShowAddressModal(false);
    setSelectedAddress(newAddressData);
    alert('Đã thêm địa chỉ thành công!');
  };

  return (
    <div className="border p-6 rounded-lg shadow-sm">
      <h2 className="text-xl font-semibold mb-4">SỔ ĐỊA CHỈ</h2>
      {localAddresses.length === 0 ? (
        <p className="text-sm">Chưa có địa chỉ nào được lưu.</p>
      ) : (
        <div className="mb-4 bg-white p-2 rounded-lg shadow-md flex items-center gap-2">
          <select
            className="w-full border rounded px-3 py-2 flex-1"
            value={selectedAddress?.id || ''}
            onChange={(e) => {
              const address = localAddresses.find((a) => a.id === e.target.value);
              setSelectedAddress(address);
            }}
          >
            <option value="">Chọn địa chỉ</option>
            {localAddresses.map((address) => (
              <option key={address.id} value={address.id}>
                {`${address.fullName} - ${address.phone} - ${address.address}`}
              </option>
            ))}
          </select>
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600"
            style={{ minWidth: '120px' }}
            onClick={() => setShowAddressModal(true)}
          >
            THÊM ĐỊA CHỈ
          </button>
        </div>
      )}
      {localAddresses.length === 0 && (
        <button
          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600"
          onClick={() => setShowAddressModal(true)}
        >
          THÊM ĐỊA CHỈ
        </button>
      )}
      {selectedAddress && (
        <div className="mt-2 p-2 border rounded bg-gray-50">
          <p><strong>Tên:</strong> {selectedAddress.fullName}</p>
          <p><strong>Số điện thoại:</strong> {selectedAddress.phone}</p>
          <p><strong>Địa chỉ:</strong> {selectedAddress.address}</p>
          <p><strong>Email:</strong> {selectedAddress.email || 'Chưa cập nhật'}</p>
          <div className="mt-2 space-x-2">
            <button
              className="px-2 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
              onClick={() => handleEditAddress(selectedAddress)}
            >
              Sửa
            </button>
            <button
              className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
              onClick={() => handleDeleteAddress(selectedAddress.id)}
            >
              Xóa
            </button>
          </div>
        </div>
      )}

      {/* Modal thêm địa chỉ mới */}
      {showAddressModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-lg font-semibold mb-4">Thêm địa chỉ mới</h2>
            <form onSubmit={customHandleAddAddress}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Họ và tên</label>
                <input
                  type="text"
                  value={newAddress.fullName}
                  onChange={(e) => setNewAddress({ ...newAddress, fullName: e.target.value })}
                  className="w-full border rounded px-3 py-2"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Số điện thoại</label>
                <input
                  type="tel"
                  value={newAddress.phone}
                  onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })}
                  className="w-full border rounded px-3 py-2"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Địa chỉ</label>
                <input
                  type="text"
                  value={newAddress.address}
                  onChange={(e) => setNewAddress({ ...newAddress, address: e.target.value })}
                  className="w-full border rounded px-3 py-2"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  value={newAddress.email}
                  onChange={(e) => setNewAddress({ ...newAddress, email: e.target.value })}
                  className="w-full border rounded px-3 py-2"
                  required
                />
              </div>
              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  className="bg-gray-300 text-black py-2 px-4 rounded hover:bg-gray-400 transition"
                  onClick={() => setShowAddressModal(false)}
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition"
                >
                  Lưu
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal chỉnh sửa địa chỉ */}
      {showEditModal && editAddress && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h3 className="text-lg font-semibold mb-4">Chỉnh sửa địa chỉ</h3>
            <form onSubmit={(e) => { e.preventDefault(); handleSaveEdit(); }}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Họ và tên</label>
                <input
                  type="text"
                  value={editAddress.fullName || ''}
                  onChange={(e) => setEditAddress({ ...editAddress, fullName: e.target.value })}
                  className="w-full border rounded px-3 py-2"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Số điện thoại</label>
                <input
                  type="tel"
                  value={editAddress.phone || ''}
                  onChange={(e) => setEditAddress({ ...editAddress, phone: e.target.value })}
                  className="w-full border rounded px-3 py-2"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Địa chỉ</label>
                <input
                  type="text"
                  value={editAddress.address || ''}
                  onChange={(e) => setEditAddress({ ...editAddress, address: e.target.value })}
                  className="w-full border rounded px-3 py-2"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  value={editAddress.email || ''}
                  onChange={(e) => setEditAddress({ ...editAddress, email: e.target.value })}
                  className="w-full border rounded px-3 py-2"
                  required
                />
              </div>
              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  className="bg-gray-300 text-black py-2 px-4 rounded hover:bg-gray-400 transition"
                  onClick={() => setShowEditModal(false)}
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition"
                >
                  Lưu
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}