const express = require("express");
const crypto = require("crypto");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Replace these values with your PayU credentials
const PAYU_KEY = "CA6cjE";
const PAYU_SALT = "PZcsi0LUtvGm1pR775XzH2pug5QyLKW1";
const PAYU_TEST_URL = "https://test.payu.in/_payment";

// Success and failure URLs
const SURL = "http://localhost:5000/payment-success";
const FURL = "http://localhost:5000/payment-failure/";

// Generate hash for security
function generateHash(data) {
  const hashString = `${PAYU_KEY}|${data.txnid}|${data.amount}|${data.productinfo}|${data.firstname}|${data.email}|||||||||||${PAYU_SALT}`;
  return crypto.createHash("sha512").update(hashString).digest("hex");
}

// Endpoint to create a payment request
app.post("/create-payment", (req, res) => {
  const { amount, productinfo, firstname, email, phone } = req.body;

  const txnid = `txn_453311`; // Generate a unique transaction ID
  const hash = generateHash({ txnid, amount, productinfo, firstname, email });

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
    cart_details: {
      amount: 55000,
      items: 2,
      surcharges: 10,
      pre_discount: 5,
      sku_details: [
        {
          sku_id: "smartphone234",
          sku_name: "Smartphone",
          amount_per_sku: "45000",
          quantity: 1,
          offer_key: null,
          offer_auto_apply: true,
        },
        {
          sku_id: "smartwatch132",
          sku_name: "Smartwatch",
          amount_per_sku: "10000",
          quantity: 1,
          offer_key: ["flat500@2022"],
          offer_auto_apply: false,
        },
      ],
    },
  };

  res.json({ url: PAYU_TEST_URL, paymentData });
});

const validateHash = (responseData, receivedHash) => {
  const hashString = `${PAYU_SALT}|${responseData.status}|||||||||||${responseData.email}|${responseData.firstname}|${responseData.productinfo}|${responseData.amount}|${responseData.txnid}|${PAYU_KEY}`;
  const generatedHash = crypto
    .createHash("sha512")
    .update(hashString)
    .digest("hex");
  return generatedHash === receivedHash;
};

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

app.listen(5000, () => console.log("Server running on http://localhost:5000"));
