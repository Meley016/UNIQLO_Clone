
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
  return (
    <div className="border p-6 rounded-lg shadow-sm">
      <h2 className="text-xl font-semibold mb-4">SỔ ĐỊA CHỈ</h2>
      {addresses.length === 0 ? (
        <p className="text-sm">Chưa có địa chỉ nào được lưu.</p>
      ) : (
        <div className="mb-4">
          <select
            className="w-full border rounded px-3 py-2 mb-2"
            value={selectedAddress?.id || ''}
            onChange={(e) => {
              const address = addresses.find((a) => a.id === e.target.value);
              setSelectedAddress(address);
            }}
          >
            <option value="">Chọn địa chỉ</option>
            {addresses.map((address) => (
              <option key={address.id} value={address.id}>
                {`${address.fullName} - ${address.phone} - ${address.address}`}
              </option>
            ))}
          </select>
        </div>
      )}
      <button
        className="mt-6 px-4 py-2 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600"
        onClick={() => setShowAddressModal(true)}
      >
        THÊM ĐỊA CHỈ
      </button>
    </div>
  );
}