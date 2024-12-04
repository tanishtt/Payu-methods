const axios = require("axios");
const crypto = require("crypto");

// Configurations
const merchantKey = "yourMerchantKey";
const salt = "yourSalt";
const payuURL = "https://secure.payu.in/_payment";

async function initiatePayment() {
  const txnId = `payuTestTransaction${Date.now()}`;
  const amount = "1.1";
  const productInfo = "Product Info";
  const firstname = "Postman";
  const email = "test@payu.in";
  const phone = "9988776655";
  const surl = "https://yourserver.com/success";
  const furl = "https://yourserver.com/failure";
  const notifyUrl = "https://yourserver.com/notify";

  // Generate Hash
  const hashString = `${merchantKey}|${txnId}|${amount}|${productInfo}|${firstname}|${email}|||||||||||${salt}`;
  const hash = crypto.createHash("sha512").update(hashString).digest("hex");

  // Payment Request Payload
  const paymentData = {
    key: merchantKey,
    txnid: txnId,
    amount,
    firstname,
    email,
    phone,
    productinfo: productInfo,
    surl,
    furl,
    notifyurl: notifyUrl,
    hash,
    pg: "CC", // Payment mode (Credit Card)
    authentication_flow: "REDIRECT",
  };

  try {
    const response = await axios.post(
      payuURL,
      new URLSearchParams(paymentData),
      {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      }
    );
    console.log("Initiation Response:", response.data);
    return response.data; // Process further based on the response
  } catch (error) {
    console.error(
      "Error initiating payment:",
      error.response?.data || error.message
    );
  }
}
function handleBankRedirect(responseData) {
  const { acsTemplate } = responseData.result;
  return `
        <!DOCTYPE html>
        <html>
            <body>
                ${acsTemplate}
            </body>
        </html>
    `;
}
const authorizeURL = "https://secure.payu.in/AuthorizeTransaction.php";

async function authorizePayment(bankResponse) {
  const { referenceId, bankData } = bankResponse;
  const { messageDigest, pares } = bankData;

  // Create the hash for authorization
  const txnId = "yourTxnId"; // Retrieved from Step 1
  const amount = "1.1";
  const authenticationInfo = JSON.stringify(bankData);
  const hashString = `${merchantKey}|${txnId}|${amount}|${authenticationInfo}|${salt}`;
  const hash = crypto.createHash("sha512").update(hashString).digest("hex");

  const authPayload = {
    key: merchantKey,
    txnid: txnId,
    amount,
    hash,
    authentication_info: authenticationInfo,
  };

  try {
    const response = await axios.post(authorizeURL, authPayload);
    console.log("Authorization Response:", response.data);
    return response.data;
  } catch (error) {
    console.error(
      "Error authorizing payment:",
      error.response?.data || error.message
    );
  }
}
function verifyPayUResponse(payuResponse) {
  const {
    key,
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
    status,
  } = payuResponse;
  const responseHashString = `${salt}|${status}||||||${udf5}|${udf4}|${udf3}|${udf2}|${udf1}|${email}|${firstname}|${productinfo}|${amount}|${txnid}|${key}`;
  const generatedHash = crypto
    .createHash("sha512")
    .update(responseHashString)
    .digest("hex");

  if (generatedHash === payuResponse.hash) {
    console.log("Hash Matched: Transaction Verified");
  } else {
    console.error("Hash Mismatch: Potential Fraud Detected");
  }
}
// Express Setup
const express = require('express');
const app = express();

app.post('/initiate-payment', async (req, res) => {
    const response = await initiatePayment();
    res.send(response);
});

app.post('/redirect-handler', (req, res) => {
    const bankResponse = req.body; // Ensure the body is parsed
    res.send(handleBankRedirect(bankResponse));
});

app.post('/authorize-payment', async (req, res) => {
    const authResponse = await authorizePayment(req.body);
    res.send(authResponse);
});

app.post('/verify-response', (req, res) => {
    verifyPayUResponse(req.body);
    res.send('Response Verified');
});

app.listen(3000, () => console.log('Server running on port 3000'));
