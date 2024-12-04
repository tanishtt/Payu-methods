const express = require("express");
const bodyParser = require("body-parser");
const crypto = require("crypto");
const axios = require("axios");
const cors = require("cors");
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
// Replace these with your actual credentials
const MERCHANT_KEY = "CA6cjE";
const MERCHANT_SALT = "PZcsi0LUtvGm1pR775XzH2pug5QyLKW1";
const PAYU_BASE_URL = "https://test.payu.in/_payment"; // Use "https://secure.payu.in/_payment" for production

// Utility to generate SHA512 hash
function generateHash(data) {
  return crypto.createHash("sha512").update(data).digest("hex");
}

// Step 1: Handle payment initiation request
app.post("/initiate-payment", async (req, res) => {
  const {
    txnid,
    amount,
    productinfo,
    firstname,
    email,
    phone,
    cardDetails,
    successUrl,
    failureUrl,
    termUrl,
  } = req.body;

  // Mandatory parameters
  const hashString = `${MERCHANT_KEY}|${txnid}|${amount}|${productinfo}|${firstname}|${email}|||||||||||${MERCHANT_SALT}`;
  const hash = generateHash(hashString);

  const payload = {
    key: MERCHANT_KEY,
    txnid,
    amount,
    productinfo,
    firstname,
    email,
    phone,
    hash,
    furl: failureUrl,
    surl: successUrl,
    pg: "CC",
    bankcode: "CC",
    ccnum: cardDetails.ccnum,
    ccname: cardDetails.ccname,
    ccexpmon: cardDetails.ccexpmon,
    ccexpyr: cardDetails.ccexpyr,
    ccvv: cardDetails.ccvv,
    txn_s2s_flow: 4,
    auth_only: 1,
    termUrl,
    authentication_flow: "REDIRECT",
  };
  console.log(payload);
  try {
    const response = await axios.post(
      PAYU_BASE_URL,
      payload,

      {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      }
    );
    console.log(response.data);

    res.status(200).json({ acsTemplate: response.data.result.acsTemplate });
  } catch (error) {
    res.status(500).json({
      error1: "Failed to initiate payment",
      details: error.message,
      error2: error,
    });
  }
});

// Step 2: Handle callback after bank redirects the customer
// app.post("/callback", (req, res) => {
//   console.log(req.body);

//   const bankData2 = JSON.parse(req.body.bankData);
//   console.log(bankData2);
//   const cres2 = JSON.parse(Buffer.from(bankData2.cres, "base64").toString());
//   console.log(cres2);

//   const { rawBankData, referenceId, bankData, authenticationStatus, hash } =
//     req.body;

//   // Verify hash
//   const hashString = `${referenceId}|${rawBankData}|${MERCHANT_SALT}`;
//   const calculatedHash = generateHash(hashString);
//   if (hash !== calculatedHash) {
//     return res.status(400).send("Invalid hash, possible tampering detected.");
//   }

//   // Continue to charge the payment using the bankData
//   res.status(200).send({
//     message: "Payment authentication successful",
//     data: { referenceId, authenticationStatus, bankData },
//   });
// });

// Step 2: Handle callback after bank redirects the customer
app.post("/callback", (req, res) => {
  console.log("Request Body:", req.body);

  let bankData2, cres2,cres3;

  try {
    // Parse bankData and decode cres
    bankData2 = JSON.parse(req.body.bankData);
    console.log("Parsed bankData:", bankData2);

    cres2 = JSON.parse(Buffer.from(bankData2.cres, "base64").toString());
    console.log("Decoded cres2:", cres2);
    cres3 = JSON.parse(Buffer.from(cres2.cres, "base64").toString());
    console.log("Decoded cres3:", cres3);
  } catch (error) {
    console.error("Error parsing bankData or cres:", error);
    return res.status(400).send("Invalid data format.");
  }

  const { rawBankData, referenceId, bankData, authenticationStatus, hash } =
    req.body;

  // Verify hash
  const hashString = `${referenceId.trim()}|${rawBankData.trim()}|${MERCHANT_SALT.trim()}`;
  const calculatedHash = generateHash(hashString);

  if (hash !== calculatedHash) {
    console.error("Hash mismatch:", {
      expected: hash,
      calculated: calculatedHash,
    });
    return res.status(400).send("Invalid hash, possible tampering detected.");
  }

  // Verify 3DS transaction status
  if (cres3.transStatus !== "Y") {
    console.error("3DS Authentication failed:", cres2);
    return res.status(400).send("Transaction authentication failed.");
  }

  // Log success and continue processing
  console.log("3DS Authentication successful:", cres2);
  res.status(200).send({
    message: "Payment authentication successful",
    data: { referenceId, authenticationStatus, bankData },
  });
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
