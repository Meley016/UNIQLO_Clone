import { useState, useEffect } from 'react';

function PaymentMethod() {
  // Khởi tạo trạng thái từ localStorage
  const [selectedMethod, setSelectedMethod] = useState('');
  const [savedMethods, setSavedMethods] = useState(() => {
    const saved = localStorage.getItem('savedMethods');
    return saved ? JSON.parse(saved) : [];
  });
  const [paymentData, setPaymentData] = useState(() => {
    const saved = localStorage.getItem('paymentData');
    return saved ? JSON.parse(saved) : [];
  });

  // Cập nhật localStorage khi savedMethods hoặc paymentData thay đổi
  useEffect(() => {
    localStorage.setItem('savedMethods', JSON.stringify(savedMethods));
  }, [savedMethods]);

  useEffect(() => {
    localStorage.setItem('paymentData', JSON.stringify(paymentData));
  }, [paymentData]);

  const handleMethodSelect = (method) => {
    setSelectedMethod(method);
  };

  // Xử lý submit form và lưu dữ liệu
  const handleSubmit = (e, data, method) => {
    e.preventDefault();
    const newPayment = {
      id: Date.now(),
      method,
      data,
      timestamp: new Date().toISOString(),
    };
    setPaymentData([...paymentData, newPayment]);

    // Thêm vào danh sách phương thức đã lưu
    const methodSummary = {
      id: newPayment.id,
      method,
      summary:
        method === 'ewallet'
          ? `Ví ${data.walletType} - ${data.phone}`
          : method === 'bankcard'
          ? `Thẻ ${data.cardNumber.slice(-4)}`
          : `COD - ${data.fullName}`,
    };
    setSavedMethods([...savedMethods, methodSummary]);

    alert('Thông tin thanh toán đã được lưu!');
    setSelectedMethod(''); // Reset form sau khi xác nhận
  };

  // Tải xuống dữ liệu dưới dạng file JSON
  const downloadJSON = () => {
    const dataStr = JSON.stringify(paymentData, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'payment_data.json';
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full flex">
        {/* Cột bên trái: Các nút phương thức thanh toán và phương thức đã lưu */}
        <div className="w-1/4 pr-4 border-r">
          <h2 className="text-lg font-semibold mb-4">Phương thức thanh toán</h2>
          <div className="flex flex-col space-y-4">
            <button
              onClick={() => handleMethodSelect('ewallet')}
              className={`px-4 py-2 rounded text-white font-medium ${
                selectedMethod === 'ewallet' ? 'bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'
              }`}
            >
              E-Wallet
            </button>
            <button
              onClick={() => handleMethodSelect('bankcard')}
              className={`px-4 py-2 rounded text-white font-medium ${
                selectedMethod === 'bankcard' ? 'bg-green-700' : 'bg-green-500 hover:bg-green-600'
              }`}
            >
              Thẻ ngân hàng
            </button>
            <button
              onClick={() => handleMethodSelect('cod')}
              className={`px-4 py-2 rounded text-white font-medium ${
                selectedMethod === 'cod' ? 'bg-gray-700' : 'bg-gray-500 hover:bg-gray-600'
              }`}
            >
              Thanh toán khi nhận hàng
            </button>
          </div>

          {/* Hiển thị phương thức đã lưu */}
          {savedMethods.length > 0 && (
            <div className="mt-6">
              <h3 className="text-md font-semibold mb-2">Phương thức đã lưu</h3>
              <ul className="space-y-2">
                {savedMethods.map((method) => (
                  <li
                    key={method.id}
                    onClick={() => handleMethodSelect(method.method)}
                    className="cursor-pointer p-2 bg-gray-100 rounded hover:bg-gray-200"
                  >
                    {method.summary}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Cột bên phải: Form hoặc thông báo */}
        <div className="w-3/4 pl-4">
          <h1 className="text-2xl font-bold mb-6">Chọn phương thức thanh toán</h1>

          {selectedMethod === '' && (
            <div className="text-center text-gray-500">
              Chưa chọn phương thức thanh toán
            </div>
          )}

          {/* Form E-Wallet */}
          {selectedMethod === 'ewallet' && (
            <div className="form-container">
              <h2 className="text-lg font-semibold mb-4">Thanh toán bằng E-Wallet</h2>
              <form
                className="space-y-4"
                onSubmit={(e) => {
                  const formData = new FormData(e.target);
                  const data = {
                    walletType: formData.get('walletType'),
                    phone: formData.get('phone'),
                  };
                  handleSubmit(e, data, 'ewallet');
                }}
              >
                <div>
                  <label className="block text-sm font-medium">Loại ví</label>
                  <select name="walletType" className="w-full p-2 border rounded">
                    <option value="">Chọn ví</option>
                    <option value="momo">Momo</option>
                    <option value="zalopay">ZaloPay</option>
                    <option value="viettelpay">Viettel Pay</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium">Số điện thoại</label>
                  <input
                    name="phone"
                    type="text"
                    placeholder="Nhập số điện thoại"
                    className="w-full p-2 border rounded"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
                >
                  Xác nhận
                </button>
              </form>
            </div>
          )}

          {/* Form Thẻ ngân hàng */}
          {selectedMethod === 'bankcard' && (
            <div className="form-container">
              <h2 className="text-lg font-semibold mb-4">Thanh toán bằng thẻ ngân hàng</h2>
              <form
                className="space-y-4"
                onSubmit={(e) => {
                  const formData = new FormData(e.target);
                  const data = {
                    cardNumber: formData.get('cardNumber'),
                    cardHolder: formData.get('cardHolder'),
                    expiryDate: formData.get('expiryDate'),
                    cvv: formData.get('cvv'),
                  };
                  handleSubmit(e, data, 'bankcard');
                }}
              >
                <div>
                  <label className="block text-sm font-medium">Số thẻ</label>
                  <input
                    name="cardNumber"
                    type="text"
                    placeholder="Nhập số thẻ"
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">Tên trên thẻ</label>
                  <input
                    name="cardHolder"
                    type="text"
                    placeholder="Nhập tên trên thẻ"
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div className="flex space-x-4">
                  <div>
                    <label className="block text-sm font-medium">Ngày hết hạn</label>
                    <input
                      name="expiryDate"
                      type="text"
                      placeholder="MM/YY"
                      className="w-full p-2 border rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium">CVV</label>
                    <input
                      name="cvv"
                      type="text"
                      placeholder="CVV"
                      className="w-full p-2 border rounded"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600"
                >
                  Xác nhận
                </button>
              </form>
            </div>
          )}

          {/* Form Thanh toán khi nhận hàng */}
          {selectedMethod === 'cod' && (
            <div className="form-container">
              <h2 className="text-lg font-semibold mb-4">Thanh toán khi nhận hàng</h2>
              <form
                className="space-y-4"
                onSubmit={(e) => {
                  const formData = new FormData(e.target);
                  const data = {
                    fullName: formData.get('fullName'),
                    address: formData.get('address'),
                    phone: formData.get('phone'),
                  };
                  handleSubmit(e, data, 'cod');
                }}
              >
                <div>
                  <label className="block text-sm font-medium">Họ và tên</label>
                  <input
                    name="fullName"
                    type="text"
                    placeholder="Nhập họ và tên"
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">Địa chỉ giao hàng</label>
                  <input
                    name="address"
                    type="text"
                    placeholder="Nhập địa chỉ"
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">Số điện thoại</label>
                  <input
                    name="phone"
                    type="text"
                    placeholder="Nhập số điện thoại"
                    className="w-full p-2 border rounded"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-gray-500 text-white p-2 rounded hover:bg-gray-600"
                >
                  Xác nhận
                </button>
              </form>
            </div>
          )}

          {/* Hiển thị dữ liệu thanh toán đã lưu */}
          {paymentData.length > 0 && (
            <div className="mt-8">
              <h2 className="text-lg font-semibold mb-4">Thông tin thanh toán đã lưu</h2>
              <ul className="space-y-4">
                {paymentData.map((payment) => (
                  <li key={payment.id} className="border p-4 rounded">
                    <p><strong>Phương thức:</strong> {payment.method}</p>
                    <p><strong>Thời gian:</strong> {payment.timestamp}</p>
                    <pre className="bg-gray-100 p-2 rounded">
                      {JSON.stringify(payment.data, null, 2)}
                    </pre>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default PaymentMethod;