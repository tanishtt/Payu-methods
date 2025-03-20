import { useState } from "react";
import axios from "axios";

export const PayUIntegration=()=> {
  const [paymentData, setPaymentData] = useState({
    amount: "10.00",
    productinfo: "iPhone",
    firstname: "Ashish",
    lastname:'moh',
    email: "test@gmail.com",
    phone: "9876543210",
  });
  const [invoiceId, setInvoiceId] = useState("");
  const [invoiceFile, setInvoiceFile] = useState(null);

  const handleInputChange = (e) => {
    setPaymentData({ ...paymentData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setInvoiceFile(e.target.files[0]);
  };

  const createPayment = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5000/create-payment",
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
      console.error("Payment Error:", error);
    }
  };

  const updateInvoice = async () => {
    try {
      await axios.post("http://localhost:5000/update-invoice", { invoiceId });
      alert("Invoice ID updated successfully");
    } catch (error) {
      console.error("Invoice Update Error:", error);
    }
  };

  const uploadInvoice = async () => {
    const formData = new FormData();
    formData.append("invoice", invoiceFile);

    try {
      const response = await axios.post(
        "http://localhost:5000/upload-invoice",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      const responseData =
        typeof response.data === "string"
          ? JSON.parse(response.data)
          : response.data;

      console.log("Response:", responseData);
      alert(responseData.responseMsg);
    } catch (error) {
      console.error("Invoice Upload Error:", error);
    }
  };

  return (
    <div className="p-4 max-w-lg mx-auto">
      <h1 className="text-xl font-bold">PayU Integration</h1>

      {/* Payment Form */}
      <div className="mt-4 space-y-2">
        <input
          type="text"
          name="amount"
          value={paymentData.amount}
          placeholder="Amount"
          onChange={handleInputChange}
          className="w-full p-2 border"
        />
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
          placeholder="Last Name"
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
          onClick={createPayment}
          className="bg-blue-500 text-white px-4 py-2 mt-2"
        >
          Pay Now
        </button>
      </div>

      {/* Invoice ID Update */}
      <h2>
        Invoice ID Update : it can be done directly fom backend after success or
        failure
      </h2>
      <div className="mt-4">
        <input
          type="text"
          placeholder="Invoice ID"
          onChange={(e) => setInvoiceId(e.target.value)}
          className="w-full p-2 border"
        />
        <button
          onClick={updateInvoice}
          className="bg-green-500 text-white px-4 py-2 mt-2"
        >
          Update Invoice
        </button>
      </div>

      {/* Invoice Upload */}
      <h2>
        Invoice Upload : it can be done directly fom backend after success or
        failure
      </h2>
      <div className="mt-4">
        <input
          type="file"
          onChange={handleFileChange}
          className="w-full p-2 border"
        />
        <button
          onClick={uploadInvoice}
          className="bg-purple-500 text-white px-4 py-2 mt-2"
        >
          Upload Invoice
        </button>
      </div>
    </div>
  );
}
