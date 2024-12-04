import React from "react";

const PayUCheckout = () => {
  // const paymentSuccessful = async () => {};
  // const paymentFailed = async () => {};
  const handlePayment = async () => {
    // Example transaction data
    const transactionData = {
      amount: "1.0", // Amount to be paid
      firstname: "John",
      lastname: "Doe",
      email: "john@example.com",
      phone: "1234567890",
      productinfo: "Example Product",
    };

    // Call your backend to get the hash and transaction ID
    const response = await fetch("http://localhost:5000/initiate-payment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(transactionData),
    });

    const { key, txnid, hash, surl, furl } = await response.json();

    const data = {
      key,
      hash,
      txnid,
      amount: transactionData.amount,
      firstname: transactionData.firstname,
      email: transactionData.email,
      phone: transactionData.phone,
      productinfo: transactionData.productinfo,
      surl,
      furl,
      //   enforce_paymethod: "upi",
      //   pg: "UPI",
    };

    const handlers = {
      responseHandler: (BOLT) => {
        if (BOLT.response.txnStatus === "SUCCESS") {
          console.log("Payment successful:", BOLT.response, BOLT);
          alert("Payment successful.");
          //paymentSuccessful(BOLT.response);
          /*  //   {PG_TYPE: "CASH-PG";
        //   addedon: "2024-11-18 11:50:09";
        //   address1: "";
        //   address2: "";
        //   amount: "1.00";
        //   bank_ref_no: "b7602faa-a435-41a5-8468-db160e8f6bf7";
        //   bank_ref_num: "b7602faa-a435-41a5-8468-db160e8f6bf7";
        //   bankcode: "AMON";
        //   card_no: "";
        //   card_token: "";
        //   city: "";
        //   country: "";
        //   curl: "http://localhost:5000/failure";
        //   discount: "0.00";
        //   email: "johndoe@example.com";
        //   error: "E000";
        //   error_Message: "No Error";
        //   field0: "";
        //   field1: "";
        //   field2: "";
        //   field3: "";
        //   field4: "";
        //   field5: "";
        //   field6: "";
        //   field7: "";
        //   field8: "";
        //   field9: "Transaction Completed Successfully";
        //   firstname: "John";
        //   furl: "http://localhost:5000/failure";
        //   hash: "41e20476b4bc909ce69195f161cffb244176656ec2c440e9b548400d4a8b214a9e1244fc3f69347d48c38ab9731a0020b5a1e8a2e9e49a2c0730e78d5c553cfe";
        //   key: "CA6cjE";
        //   lastname: "";
        //   meCode: '{"":null}';
        //   mihpayid: "403993715532695032";
        //   mode: "CASH";
        //   net_amount_debit: 1;
        //   offer_availed: null;
        //   offer_key: null;
        //   payment_source: "payu";
        //   phone: "1234567890";
        //   productinfo: "Example Product";
        //   state: "";
        //   status: "success";
        //   surl: "http://localhost:5000/success";
        //   txnMessage: "Transaction Successful";
        //   txnStatus: "SUCCESS";
        //   txnid: "txn1731910717791";
        //   udf1: "";
        //   udf2: "";
        //   udf3: "";
        //   udf4: "";
        //   udf5: "";
        //   udf6: "";
        //   udf7: "";
        //   udf8: "";
        //   udf9: "";
        //   udf10: "";
        //   unmappedstatus: "captured";
        //   zipcode: "";}*/
        } else if (BOLT.response.txnStatus === "FAILED") {
          console.log("Payment failed. Please try again.", BOLT.response, BOLT);
          alert("Payment failed.", BOLT.response, BOLT);
          //it depends on reason, like bank authentication failed, gives this error, or calls /failure furl
          /* {PG_TYPE: "CASH-PG";
    addedon: "2024-11-18 11:53:24";
    address1: "";
    address2: "";
    amount: "1.00";
    bank_ref_no: null;
    bank_ref_num: null;
    bankcode: "AMON";
    card_no: "";
    card_token: "";
    city: "";
    country: "";
    curl: "http://localhost:5000/failure";
    discount: "0.00";
    email: "johndoe@example.com";
    error: "E500";
    error_Message: "Bank failed to authenticate the customer";
    field0: "";
    field1: "";
    field2: "";
    field3: "";
    field4: "";
    field5: "";
    field6: "";
    field7: "";
    field8: "";
    field9: "Technical Failure";
    firstname: "John";
    furl: "http://localhost:5000/failure";
    hash: "6603e8a7952a52dcd95f7de1beee7533e28eb957b7408c96d7d3e141a9703d565a034c97277dc1adeafd864e6e8e483b45f5e6690c8b2dee38746b5ec878116b";
    key: "CA6cjE";
    lastname: "";
    meCode: '{"":null}';
    mihpayid: "403993715532695093";
    mode: "CASH";
    net_amount_debit: 0;
    offer_availed: null;
    offer_key: null;
    payment_source: "payu";
    phone: "1234567890";
    productinfo: "Example Product";
    state: "";
    status: "failure";
    surl: "http://localhost:5000/success";
    txnMessage: "Bank failed to authenticate the customer";
    txnStatus: "FAILED";
    txnid: "txn1731910914491";
    udf1: "";
    udf2: "";
    udf3: "";
    udf4: "";
    udf5: "";
    udf6: "";
    udf7: "";
    udf8: "";
    udf9: "";
    udf10: "";
    unmappedstatus: "failed";
    zipcode: "";}   */
        } else if (BOLT.response.txnStatus === "CANCEL") {
          console.log("Payment canceled.", BOLT.response, BOLT);
          alert("Payment canceled.", BOLT.response, BOLT);
          //if cancel payment(x)
          /* //   {txnId: "txn1731910498985";
        //   txnMessage: "Overlay closed by consumer";
        //   txnStatus: "CANCEL";}*/
        }
      },
      catchException: (BOLT) => {
        console.log("Error:", BOLT.message, BOLT);
        alert("Error:" + BOLT.message);
      },
    };

    // Load the PayU Bolt Modal
    if (window.bolt) {
      window.bolt.launch(data, handlers);
    } else {
      console.error("PayU Bolt script not loaded.");
    }
  };

  return (
    <div>
      <button onClick={handlePayment}>Pay Now</button>
    </div>
  );
};

export default PayUCheckout;
