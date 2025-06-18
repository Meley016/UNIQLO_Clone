import React, { useState } from "react";

const CheckoutForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    cardNumber: "",
    expiry: "",
    cvv: "",
    amount: 0,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Giả lập thanh toán
    alert("Thanh toán thành công!\n" + JSON.stringify(formData, null, 2));
    // Gửi dữ liệu đến server nếu cần
  };

  return (
    <div style={{ maxWidth: 500, margin: "0 auto", padding: 20 }}>
      <h2>Thanh toán đơn hàng</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Họ tên:</label>
          <input
            type="text"
            name="name"
            onChange={handleChange}
            required
            style={{ width: "100%", padding: 8 }}
          />
        </div>
        <div>
          <label>Số thẻ:</label>
          <input
            type="text"
            name="cardNumber"
            onChange={handleChange}
            required
            placeholder="1234 5678 9012 3456"
            style={{ width: "100%", padding: 8 }}
          />
        </div>
        <div>
          <label>Ngày hết hạn:</label>
          <input
            type="text"
            name="expiry"
            onChange={handleChange}
            placeholder="MM/YY"
            required
            style={{ width: "100%", padding: 8 }}
          />
        </div>
        <div>
          <label>CVV:</label>
          <input
            type="password"
            name="cvv"
            onChange={handleChange}
            required
            style={{ width: "100%", padding: 8 }}
          />
        </div>
        <div>
          <label>Số tiền (VNĐ):</label>
          <input
            type="number"
            name="amount"
            onChange={handleChange}
            required
            style={{ width: "100%", padding: 8 }}
          />
        </div>
        <button type="submit" style={{ marginTop: 20, padding: 10 }}>
         Thanh toán
        </button>
      </form>
    </div>
  );
};

export default CheckoutForm;
