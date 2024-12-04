import React, { useState } from "react";
import axios from "axios";

const CommerceProCheckout = () => {
  const [isLoading, setIsLoading] = useState(false);

  const handlePayment = async () => {
    try {
      setIsLoading(true);

      // Transaction data
      const expressData = {
        key: "CA6cjE",
        txnid: "txn_" + new Date().getTime(),
        amount: "500",
        phone: "7903109365",
        firstname: "John",
        lastname: "Doe",
        email: "tanish.mohanta@gmail.com",
        udf1: "",
        udf2: "",
        udf3: "",
        udf4: "",
        udf5: "",
        isCheckoutExpress: true,
        icp_source: "express",
        productinfo: "Sample Product",
        surl: "http://localhost:5000/success", // Backend success endpoint
        furl: "http://localhost:5000/failure", // Backend failure endpoint
        orderid: "order_" + new Date().getTime(),
        cart_details: {
          amount: "500",
          items: "2",
          sku_details: [
            {
              offer_key: ["offer_1", "offer_2"],
              amount_per_sku: "250",
              quantity: "2",
              sku_id: "sku_123",
              sku_name: "Sample SKU",
              logo: "https://plus.unsplash.com/premium_photo-1664474619075-644dd191935f?q=80&w=2069&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            },
          ],
        },
      };

      // Get hash and authentication headers from backend
      const { data } = await axios.post(
        "http://localhost:5000/generate-hash",
        expressData
      );

      // Launch PayU CommercePro Checkout
      console.log(data);
      const bolt = window.bolt;
      console.log("bolt", bolt);
      bolt.launch(
        {
          data: JSON.stringify(expressData),
          date: data.date,
          isCheckoutExpress: true,
          v2Hash: data.authHeader,
          mode: "dropOut", // Parameter for callback URL method
        },
        {
          responseHandler: function (express) {
            if (express.response.txnStatus === "SUCCESS") {
              console.log("Your payment has been successful", express.response);
              alert("Payment successful!");
            } else if (express.response.txnStatus === "FAILED") {
              console.log(
                "Payment failed. Please try again.",
                express.response
              );
              alert("Payment failed!");
            } else if (express.response.txnStatus === "CANCEL") {
              console.log("Payment Cancelled.", express.response);
              alert("Payment cancelled.");
            }
          },
          catchException: function (express) {
            console.log("Exception occurred:", express);
            alert("An exception occurred during payment.");
          },
        }
      );
    } catch (error) {
      console.error("Error during payment:", error);
      alert("Error initializing payment.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h1>PayU CommercePro Checkout</h1>
      <button onClick={handlePayment} disabled={isLoading}>
        {isLoading ? "Processing..." : "Pay Now"}
      </button>
    </div>
  );
};

export default CommerceProCheckout;
