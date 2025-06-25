import React, { useState } from "react";

const bankLogos = [
  {
    name: "Vietcombank",
    src: "https://upload.wikimedia.org/wikipedia/commons/6/6b/Logo_Vietcombank.png",
    alt: "Vietcombank",
  },
  {
    name: "Techcombank",
    src: "https://upload.wikimedia.org/wikipedia/commons/2/2a/Techcombank_logo.png",
    alt: "Techcombank",
  },
  {
    name: "VietinBank",
    src: "https://upload.wikimedia.org/wikipedia/commons/2/2e/Logo_VietinBank.png",
    alt: "VietinBank",
  },
  {
    name: "PayPal",
    src: "https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg",
    alt: "PayPal",
  },
  {
    name: "MoMo",
    src: "https://upload.wikimedia.org/wikipedia/commons/4/41/MoMo_Logo.png",
    alt: "MoMo",
  },
];

const CheckoutForm = () => {
  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    address: "",
    phone: "",
    promo: "",
    cardName: "",
    cardNumber: "",
    expiry: "",
    cvv: "",
    paymentMethod: "card",
    billingMatches: true,
    shippingMethod: "home",
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Thanh toán thành công!\n" + JSON.stringify(formData, null, 2));
    // Gửi dữ liệu đến server nếu cần
  };

  return (
    <div className="checkout-container flex flex-col md:flex-row gap-8 p-6 bg-white rounded shadow-lg max-w-4xl mx-auto my-8">
      {/* LEFT SECTION */}
      <form className="left-section flex-1 space-y-4" onSubmit={handleSubmit}>
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Delivery</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="input input-bordered"
            required
          />
          <input
            name="phone"
            placeholder="Phone Number"
            value={formData.phone}
            onChange={handleChange}
            className="input input-bordered"
            required
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            name="firstName"
            placeholder="First Name"
            value={formData.firstName}
            onChange={handleChange}
            className="input input-bordered"
            required
          />
          <input
            name="lastName"
            placeholder="Last Name"
            value={formData.lastName}
            onChange={handleChange}
            className="input input-bordered"
            required
          />
        </div>
        <input
          name="address"
          placeholder="Street address or postcode"
          value={formData.address}
          onChange={handleChange}
          className="input input-bordered w-full"
          required
        />
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            name="billingMatches"
            checked={formData.billingMatches}
            onChange={handleChange}
          />
          <span className="text-gray-700">Billing matches shipping address</span>
        </label>

        {/* SHIPPING */}
        <h3 className="text-xl font-semibold mt-6 text-gray-800">Shipping</h3>
        <div className="bg-gray-50 p-3 rounded mb-2">
          <p className="font-medium">Standard international delivery</p>
          <div className="flex gap-6 mt-2">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="shippingMethod"
                value="home"
                checked={formData.shippingMethod === "home"}
                onChange={handleChange}
              />
              Giao tận nhà
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="shippingMethod"
                value="post"
                checked={formData.shippingMethod === "post"}
                onChange={handleChange}
              />
              Giao bưu điện
            </label>
          </div>
          <div className="mt-4">
            <p className="font-semibold">Địa chỉ liên hệ:</p>
            <p>HONGKONG bên hông CHỢ LỚN,QUẬN 5,THÀNH PHỐ HỒ CHÍ MINH</p>
            <p className="font-semibold mt-2">Cách thức liên hệ:</p>
            <ul className="list-disc list-inside text-gray-700">
              <li>
                Hotline:{" "}
                <a
                  href="tel:09JQKA2"
                  className="text-blue-600 hover:underline"
                >
                  09JQKA2
                </a>
              </li>
              <li>
                Email:{" "}
                <a
                  href="mailto:giakhoi03306@gmail.com"
                  className="text-blue-600 hover:underline"
                >
                  giakhoi03306@gmail.com
                </a>
              </li>
              <li>
                Fanpage:{" "}
                <a
                  href="/www.facebook.com/giakhoi0306"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  /www.facebook.com/giakhoi0306
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* PAYMENT */}
        <h3 className="text-xl font-semibold mt-6 text-gray-800">Payment</h3>
        <div className="flex gap-2 mb-2">
          <input
            name="promo"
            placeholder="Have a promo code?"
            value={formData.promo}
            onChange={handleChange}
            className="input input-bordered flex-1"
          />
          <button
            type="button"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            onClick={() => alert("Mã giảm giá chưa được hỗ trợ")}
          >
            Apply
          </button>
        </div>

        {/* Bank & Wallet Logos */}
        <div className="flex flex-wrap gap-4 items-center my-4">
          {bankLogos.map((bank) => (
            <img
              key={bank.name}
              src={bank.src}
              alt={bank.alt}
              title={bank.name}
              className="h-10 object-contain bg-white rounded shadow p-1"
              style={{ background: "#fff" }}
            />
          ))}
        </div>

        <p className="font-medium mt-4 mb-2">How would you like to pay?</p>
        <div className="flex gap-6 mb-2">
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="paymentMethod"
              value="card"
              checked={formData.paymentMethod === "card"}
              onChange={handleChange}
            />
            Credit or Debit Card
          </label>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="paymentMethod"
              value="paypal"
              checked={formData.paymentMethod === "paypal"}
              onChange={handleChange}
            />
            PayPal
          </label>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="paymentMethod"
              value="momo"
              checked={formData.paymentMethod === "momo"}
              onChange={handleChange}
            />
            MoMo
          </label>
        </div>

        {/* Card Payment */}
        {formData.paymentMethod === "card" && (
          <div className="space-y-2">
            <input
              name="cardName"
              placeholder="Name on Card"
              value={formData.cardName}
              onChange={handleChange}
              className="input input-bordered w-full"
              required
            />
            <input
              name="cardNumber"
              placeholder="Card Number"
              value={formData.cardNumber}
              onChange={handleChange}
              className="input input-bordered w-full"
              required
            />
            <div className="flex gap-2">
              <input
                name="expiry"
                placeholder="MM/YY"
                value={formData.expiry}
                onChange={handleChange}
                className="input input-bordered flex-1"
                required
              />
              <input
                name="cvv"
                placeholder="CVV"
                value={formData.cvv}
                onChange={handleChange}
                className="input input-bordered flex-1"
                required
              />
            </div>
          </div>
        )}

        {/* MoMo Payment */}
        {formData.paymentMethod === "momo" && (
          <div className="space-y-2 bg-pink-50 p-4 rounded">
            <p className="font-semibold text-pink-600">
              Quét mã QR MoMo để thanh toán
            </p>
            <img
              src="https://static.mservice.io/img/logo-momo.png"
              alt="MoMo QR"
              className="h-24 mx-auto"
            />
            <p className="text-sm text-gray-500 text-center">
              Vui lòng mở ứng dụng MoMo để quét mã và hoàn tất thanh toán.
            </p>
          </div>
        )}

        {/* PayPal Payment */}
        {formData.paymentMethod === "paypal" && (
          <div className="space-y-2 bg-blue-50 p-4 rounded">
            <p className="font-semibold text-blue-600">
              Bạn sẽ được chuyển đến PayPal để hoàn tất thanh toán.
            </p>
          </div>
        )}

        <button
          type="submit"
          className="mt-6 w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 font-semibold"
        >
          Thanh toán
        </button>
      </form>

      {/* RIGHT SECTION */}
      <div className="right-section w-full md:w-1/3 bg-gray-50 p-6 rounded shadow">
        <h3 className="text-xl font-bold mb-4 text-gray-800">Order Summary</h3>
        <p className="text-gray-600 mb-6">
          Your items and totals will appear here after checkout.
        </p>
        <h3 className="text-xl font-semibold mt-6 text-gray-800">Shipping</h3>
        <div className="bg-white p-3 rounded shadow">
          <p className="font-medium">Standard international delivery</p>
        </div>
      </div>
    </div>
  );
};

export default CheckoutForm;