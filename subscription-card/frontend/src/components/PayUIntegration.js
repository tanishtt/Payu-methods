import { useState } from "react";
import axios from "axios";

export const PayUIntegration = () => {
  const [paymentData, setPaymentData] = useState({
    productinfo: "disneyhotstar",
    firstname: "Tanish",
    lastname: "Mohanta",
    email: "test@gmail.com",
    phone: "9876543210",
  });

  const handleInputChange = (e) => {
    setPaymentData({ ...paymentData, [e.target.name]: e.target.value });
  };

  const registerPayment = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5000/card-register-transation",
        paymentData
      );
      const { url, formData } = response.data;

      // Create a form dynamically to submit to PayU
      const form = document.createElement("form");
      form.action = url;
      form.method = "POST";

      // Append hidden input fields with PayU data
      Object.keys(formData).forEach((key) => {
        const input = document.createElement("input");
        input.type = "hidden";
        input.name = key;
        input.value = formData[key];
        form.appendChild(input);
      });
      console.log("registerPayment form", form);
      document.body.appendChild(form);
      form.submit();
    } catch (error) {
      console.error("Payment Error:", error);
    }
  };
  const CheckPaymentMandate = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5000/card-check-mandate",
        paymentData
      );
      const { url, formData } = response.data;

      // Create a form dynamically to submit to PayU
      const form = document.createElement("form");
      form.action = url;
      form.method = "POST";

      // Append hidden input fields with PayU data
      Object.keys(formData).forEach((key) => {
        const input = document.createElement("input");
        input.type = "hidden";
        input.name = key;
        input.value = formData[key];
        form.appendChild(input);
      });
      console.log("form", form);
      document.body.appendChild(form);
      form.submit();
    } catch (error) {
      console.error("Payment register Error:", error);
    }
  };
  const preDebitNotify = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5000/card-predebit-notify",
        {}
      );
      const { url, formData } = response.data;

      // Create a form dynamically to submit to PayU
      const form = document.createElement("form");
      form.action = url;
      form.method = "POST";

      // Append hidden input fields with PayU data
      Object.keys(formData).forEach((key) => {
        const input = document.createElement("input");
        input.type = "hidden";
        input.name = key;
        input.value = formData[key];
        form.appendChild(input);
      });
      document.body.appendChild(form);
      form.submit();
    } catch (error) {
      console.error("Payment Error:", error);
    }
  };

  const initiateRefund = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5000/refund/initiate-refund",
        {}
      );
      const { url, formData } = response.data;

      // Create a form dynamically to submit to PayU
      const form = document.createElement("form");
      form.action = url;
      form.method = "POST";

      // Append hidden input fields with PayU data
      Object.keys(formData).forEach((key) => {
        const input = document.createElement("input");
        input.type = "hidden";
        input.name = key;
        input.value = formData[key];
        form.appendChild(input);
      });
      document.body.appendChild(form);
      form.submit();
    } catch (error) {
      console.error("Payment Error:", error);
    }
  };

  const checkRefundStatus = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5000/refund/check-refund-status",
        {}
      );
      const { url, formData } = response.data;

      // Create a form dynamically to submit to PayU
      const form = document.createElement("form");
      form.action = url;
      form.method = "POST";

      // Append hidden input fields with PayU data
      Object.keys(formData).forEach((key) => {
        const input = document.createElement("input");
        input.type = "hidden";
        input.name = key;
        input.value = formData[key];
        form.appendChild(input);
      });
      document.body.appendChild(form);
      form.submit();
    } catch (error) {
      console.error("Payment Error:", error);
    }
  };

  return (
    <div className="p-4 max-w-lg mx-auto">
      <h1 className="text-xl font-bold">PayU Integration</h1>

      {/* Payment Form */}
      <div className="mt-4 space-y-2">
        <input
          type="text"
          name="productinfo"
          value={paymentData.productinfo}
          placeholder="Product Info"
          onChange={handleInputChange}
          className="w-full p-2 border"
        />
        <input
          type="text"
          name="firstname"
          value={paymentData.firstname}
          placeholder="First Name"
          onChange={handleInputChange}
          className="w-full p-2 border"
        />
        <input
          type="text"
          name="lastname"
          value={paymentData.lastname}
          placeholder="last Name"
          onChange={handleInputChange}
          className="w-full p-2 border"
        />
        <input
          type="email"
          name="email"
          value={paymentData.email}
          placeholder="Email"
          onChange={handleInputChange}
          className="w-full p-2 border"
        />
        <input
          type="text"
          name="phone"
          value={paymentData.phone}
          placeholder="Phone"
          onChange={handleInputChange}
          className="w-full p-2 border"
        />
        <button
          onClick={registerPayment}
          className="bg-blue-500 text-white px-4 py-2 mt-2"
        >
          Pay Now
        </button>
      </div>
      <br></br>
      <div onClick={CheckPaymentMandate}>
        <button>Check Mandate</button>
      </div>
      <br></br>
      <div onClick={preDebitNotify}>
        <button>Pre debit notify</button>
      </div>
      <br></br>
      <div onClick={initiateRefund}>
        <button>Refund initiation</button>
      </div>
      <br></br>
      <div onClick={checkRefundStatus}>
        <button>Check Refund Status</button>
      </div>
    </div>
  );
};
