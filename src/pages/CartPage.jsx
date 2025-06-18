import React, { useState } from "react";
import CheckoutForm from "./CheckoutForm";

const CartPage = () => {
  const [cartItems, setCartItems] = useState([
    { id: 1, name: "Sản phẩm A", price: 100000, quantity: 1 },
    { id: 2, name: "Sản phẩm B", price: 200000, quantity: 2 },
  ]);

  const getTotalPrice = () => {
    return cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  };

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "20px" }}>
      <h1>Giỏ hàng</h1>
      {cartItems.length === 0 ? (
        <p>Giỏ hàng trống.</p>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={{ borderBottom: "1px solid #ccc", textAlign: "left" }}>Tên sản phẩm</th>
              <th style={{ borderBottom: "1px solid #ccc" }}>Giá</th>
              <th style={{ borderBottom: "1px solid #ccc" }}>Số lượng</th>
              <th style={{ borderBottom: "1px solid #ccc" }}>Tổng</th>
            </tr>
          </thead>
          <tbody>
            {cartItems.map((item) => (
              <tr key={item.id}>
                <td>{item.name}</td>
                <td>{item.price.toLocaleString()}₫</td>
                <td>{item.quantity}</td>
                <td>{(item.price * item.quantity).toLocaleString()}₫</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <h2 style={{ marginTop: "30px" }}>
        Tổng cộng: {getTotalPrice().toLocaleString()}₫
      </h2>

      <div style={{ marginTop: "40px" }}>
        <CheckoutForm />
      </div>
    </div>
  );
};

export default CartPage;
