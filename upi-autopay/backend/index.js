const express = require("express");
const axios = require("axios");
const crypto = require("crypto");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

const PAYU_KEY = "CA6cjE";
const PAYU_SALT = "PZcsi0LUtvGm1pR775XzH2pug5QyLKW1";
const PAYU_URL = "https://test.payu.in/_payment";
const PAYU_RECURRING_URL = "https://test.payu.in/merchant/postservice?form=2";
const PAYU_PREDEBIT_URL =
  "https://test.info.payu.in/merchant/postservice.php?form=2";
// Success and failure URLs
const SURL = "http://localhost:5000/payment-success";
const FURL = "http://localhost:5000/payment-failure/";

// 1. Register UPI Autopay
const generateHash = (params) => {
  const hashString = `${PAYU_KEY}|${params.txnid}|${params.amount}|${params.productinfo}|${params.firstname}|${params.email}|||||||||||${PAYU_SALT}`;
  return crypto.createHash("sha512").update(hashString).digest("hex");
};

app.post("/register-upi", async (req, res) => {
  try {
    const { amount, productinfo, firstname, lastname, email, phone } = req.body;

    const txnid = `txn_${Date.now()}`;
    const hash = generateHash({ txnid, amount, productinfo, firstname, email });

    const formData = {
      key: PAYU_KEY,
      txnid,
      amount,
      productinfo,
      firstname,
      lastname,
      email,
      phone,
      address1: "123 Street",
      address2: "Near Park",
      city: "Mumbai",
      state: "Maharashtra",
      country: "India",
      zipcode: "400001",
      pg: "UPI",
      bankcode: "UPI",
      surl: SURL,
      furl: FURL,
      si: "1", //for rescurring
      vpa: "9999999999@payu.in",
      si_details: JSON.stringify({
        billingAmount: amount,
        billingCurrency: "INR",
        billingCycle: "ADHOC", //means on-demand billing
        billingInterval: 1, //ignored as using adhoc
        paymentStartDate: "2025-03-15",
        paymentEndDate: "2025-12-15",
      }),
      udf1: "AAAPL1234C||23/05/2002", // Hardcoded PAN and DOB
      udf3: "INV-12345||MyStore", // Hardcoded Invoice ID & Merchant Name
      hash,
    };
    // billingCycle = MONTHLY;
    // billingInterval = 1; means once in every month.
    //  ADHOC = Used in use cases such as post-paid bills where there is no definite billing cycle and billing amount.
    // * billingInterval = Billing Interval is closely coupled with the value of “billingCycle” and denotes at what frequency, the subscription plan needs to be executed.
    // const response = await axios.post(PAYU_URL, payload.toString(), {
    //   headers: {
    //     "Content-Type": "application/x-www-form-urlencoded",
    //   },
    // });

    // res.json({
    //   message: "UPI Autopay Registered Successfully",
    //   response: response.data,
    // });
    res.json({ url: PAYU_URL, formData });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Registration Failed", details: error.message });
  }
});

// 2. Pre-Debit Notification
const generateHashPreDebit = (command, var1) => {
  const hashString = `${PAYU_KEY}|${command}|${var1}|${PAYU_SALT}`;
  return crypto.createHash("sha512").update(hashString).digest("hex");
};

//this has to be called before 48/24 hours of debit date.
app.post("/predebit-notification", async (req, res) => {
  try {
    const var1 = JSON.stringify({
      authPayuId: "403993715533538034",
      requestId: "137878021",
      debitDate: "2025-03-21",
      amount: 10,
      invoiceDisplayNumber: "unique_id_101",
      action: "Retrieve",
    });

    const hash = generateHashPreDebit("check_action_status_txnid", var1);

    const payload = new URLSearchParams({
      key: PAYU_KEY,
      hash,
      command: "check_action_status_txnid",
      var1,
    });

    const response = await axios.post(PAYU_PREDEBIT_URL, payload.toString(), {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    res.json({
      message: "Pre-Debit Notification Sent",
      response: response.data,
    });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Pre-Debit Notification Failed", details: error.message });
  }
});

// invoiceDisplayNumber=mandatory only for cards =	A unique display number by merchant for every subsequent invoice/recurring charge. This can be displayed on the merchant’s panel to the customer. This same value needs to be sent in the recurring api also.

// authpayuid=The value of mihpayid returned in the payment response of Registration transaction when transaction is successfully completed.

// requestId=mandatory	Unique request value generated at merchant’s end to distinguish independent request call.

// 3. Process Recurring Transaction
const generateHashRecurr = (command, var1) => {
  const hashString = `${PAYU_KEY}|${command}|${var1}|${PAYU_SALT}`;
  return crypto.createHash("sha512").update(hashString).digest("hex");
};

app.post("/recurring-payment", async (req, res) => {
  try {
    const { authpayuid, invoiceDisplayNumber, amount, txnid, phone, email } =
      req.body;

    const var1 = JSON.stringify({
      authpayuid,
      invoiceDisplayNumber,
      amount,
      txnid,
      phone,
      email,
      udf2: "",
      udf3: "",
      udf4: "",
      udf5: "",
    });

    const hash = generateHashRecurr("si_transaction", var1);

    const payload = new URLSearchParams({
      key: PAYU_KEY,
      hash,
      command: "si_transaction",
      var1,
    });

    const response = await axios.post(PAYU_RECURRING_URL, payload.toString(), {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    res.json({
      message: "Recurring Payment Request Sent",
      response: response.data,
    });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Recurring Payment Failed", details: error.message });
  }
});
app.post("/payment-success", (req, res) => {
  const responseData = req.body;
  console.log(req.body);
  // Validate the hash
  const isValidHash = validateHash(responseData, responseData.hash);

  if (isValidHash) {
    console.log("Payment successful and hash validated:", responseData);
    return res.redirect("http://localhost:3000/success");
  } else {
    console.log("Invalid hash - possible tampering detected:", responseData);
    return res.redirect("http://localhost:3000/failure");
  }
});

app.post("/payment-failure", (req, res) => {
  console.log(req.body);
  return res.redirect("http://localhost:3000/failure");
});
const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
