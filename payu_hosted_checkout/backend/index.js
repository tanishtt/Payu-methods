const express = require("express");
const crypto = require("crypto");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Replace these values with your PayU credentials
// const PAYU_KEY = "CxA6cjE";
const PAYU_KEY = "01P17E";
// const PAYU_SALT = "PZcsi0LUtvGm1pR775XzH2pug5QyLKW1";
const PAYU_SALT = "bv0vKzm8vwDy6dPOnmmh1jwgU64Pm36q";
const PAYU_TEST_URL = "https://test.payu.in/_payment";

// Success and failure URLs
const SURL = "http://localhost:3001/payment-success";
const FURL = "http://localhost:3001/payment-failure/";

// correct formula for calculating the value of hash:
// sha512(key|txnid|amount|productinfo|firstname|email|udf1|udf2|udf3|udf4|udf5||||||SALT)

// Generate hash for security
function generateHash(data) {
  // Ensure proper formatting of the input string
  const hashString = `${PAYU_KEY}|${data.txnid}|${data.amount}|${data.productinfo}|${data.firstname}|${data.email}|${data.udf1}|${data.udf2}|${data.udf3}|${data.udf4}|${data.udf5}||||||${PAYU_SALT}`;

  return crypto.createHash("sha512").update(hashString).digest("hex");
}

// Endpoint to create a payment request
app.post("/create-payment", (req, res) => {
  console.log("hello");
  const { amount, productinfo, firstname, email, phone } = req.body;

  const udf1 = "planCode",
    udf2 = "userIdXXX",
    udf3 = "voucherId",
    udf4 = "2,43,4",
    udf5 = "planId";

  const txnid = `txn_4568i312`; // Generate a unique transaction ID
  const hash = generateHash({
    txnid,
    amount,
    productinfo,
    firstname,
    email,
    udf1,
    udf2,
    udf3,
    udf4,
    udf5,
  });

  // Redirect to PayU payment page with required fields
  const paymentData = {
    key: PAYU_KEY,
    txnid,
    amount,
    productinfo,
    firstname,
    email,
    phone,
    surl: SURL,
    furl: FURL,
    hash,
    udf1,
    udf2,
    udf3,
    udf4,
    udf5,
  };
  console.log(paymentData);

  res.json({ url: PAYU_TEST_URL, paymentData });
});

const validateHash = (responseData, receivedHash) => {
  const hashString = `${PAYU_SALT}|${responseData.status}||||||${
    responseData.udf5 || ""
  }|${responseData.udf4 || ""}|${responseData.udf3 || ""}|${
    responseData.udf2 || ""
  }|${responseData.udf1 || ""}|${responseData.email}|${
    responseData.firstname
  }|${responseData.productinfo}|${responseData.amount}|${
    responseData.txnid
  }|${PAYU_KEY}`;

  const generatedHash = crypto
    .createHash("sha512")
    .update(hashString)
    .digest("hex");

  return generatedHash === receivedHash;
};

app.post("/payment-success", (req, res) => {
  console.log("hi...in success");
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

app.listen(3001, () => console.log("Server running on http://localhost:3001"));
