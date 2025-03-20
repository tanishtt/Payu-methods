import React, { useState } from "react";
import axios from "axios";

const Checkout = () => {
  const [formData, setFormData] = useState({
    amount: "10.00",
    productinfo: "iPhone",
    firstname: "Ashish",
    email: "test@gmail.com",
    phone: "9876543210",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5000/create-payment",
        formData
      );
      const { url, paymentData } = response.data;

      // Create a form dynamically to submit to PayU
      const form = document.createElement("form");
      form.action = url;
      form.method = "POST";

      // Append hidden input fields with PayU data
      Object.keys(paymentData).forEach((key) => {
        const input = document.createElement("input");
        input.type = "hidden";
        input.name = key;
        input.value = paymentData[key];
        form.appendChild(input);
      });
      console.log("form", form);
      alert("h");
      document.body.appendChild(form);
      // form.submit();
    } catch (error) {
      console.error("Payment error:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        name="amount"
        value={formData.amount}
        onChange={handleChange}
        placeholder="Amount"
      />
      <input
        type="text"
        name="productinfo"
        value={formData.productinfo}
        onChange={handleChange}
        placeholder="Product Info"
      />
      <input
        type="text"
        name="firstname"
        value={formData.firstname}
        onChange={handleChange}
        placeholder="First Name"
      />
      <input
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        placeholder="Email"
      />
      <input
        type="text"
        name="phone"
        value={formData.phone}
        onChange={handleChange}
        placeholder="Phone"
      />
      <button type="submit">Pay Now</button>
    </form>
  );
};

export default  Checkout;
