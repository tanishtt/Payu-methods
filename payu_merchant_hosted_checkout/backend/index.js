const express = require("express");
const crypto = require("crypto");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Configuration
const merchantKey = "CA6cjE";
const merchantSalt = "PZcsi0LUtvGm1pR775XzH2pug5QyLKW1";

// Route to generate hash for payment request
app.post("/generate-hash", (req, res) => {
  const {
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
  } = req.body;

  // Construct the hash string
  const hashString = `${merchantKey}|${txnid}|${amount}|${productinfo}|${firstname}|${email}|${udf1}|${udf2}|${udf3}|${udf4}|${udf5}||||||${merchantSalt}`;

  // Generate SHA512 hash
  const hash = crypto.createHash("sha512").update(hashString).digest("hex");

  res.json({ hash });
});

// Route to handle PayU success callback
app.post("/success", (req, res) => {
  console.log("Success Response:", req.body);

  // Verify the response hash
  const { status, txnid, amount, productinfo, firstname, email, hash } =
    req.body;
  const reverseHashString = `${merchantSalt}|${status}||||||${req.body.udf5}|${req.body.udf4}|${req.body.udf3}|${req.body.udf2}|${req.body.udf1}|${email}|${firstname}|${productinfo}|${amount}|${txnid}|${merchantKey}`;
  const calculatedHash = crypto
    .createHash("sha512")
    .update(reverseHashString)
    .digest("hex");

  if (calculatedHash === hash) {
    res.status(200).send("Payment success and hash verified.");
  } else {
    res.status(400).send("Payment success but hash mismatch.");
  }
});

// Route to handle PayU failure callback
app.post("/failure", (req, res) => {
  console.log("Failure Response:", req.body);
  res.status(200).send("Payment failed.");
});

// Start the server
const PORT = 5000;
app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
