// const express = require("express");
// const axios = require("axios");
// const crypto = require("crypto");
// const bodyParser = require("body-parser");

// const app = express();
// const port = 5000;

// // Middleware to parse POST data
// app.use(express.json());
// app.use(bodyParser.urlencoded({ extended: false }));

// // Your PayU credentials
// const merchantKey = "CA6cjE";
// const salt = "PZcsi0LUtvGm1pR775XzH2pug5QyLKW1";
// const successUrl = "http://localhost:5000/success";
// const failureUrl = "http://localhost:5000/failure";

// // Step 1: Generate Hash for Payment Request
// function generateHash(data) {
//   const hashData = [
//     data.key,
//     data.txnid,
//     data.amount,
//     data.productinfo,
//     data.firstname,
//     data.email,
//     data.udf1 || "",
//     data.udf2 || "",
//     data.udf3 || "",
//     data.udf4 || "",
//     data.udf5 || "",
//     "", // empty string for pg (payment gateway)
//     "", // empty string for bankref
//     "", // empty string for additional info
//     salt,
//   ].join("|");

//   return crypto.createHash("sha512").update(hashData).digest("hex");
// }

// // Step 2: Route for initiating payment (S2S POST request)
// app.post("/initiate-payment", async(req, res) => {
//     console.log(req.body)
//   const { amount, productinfo, firstname, email, phone } = req.body;

//   // Generate a unique transaction ID (txnid)
//   const txnid = `TXN${Date.now()}`;

//   // Prepare request data
// //   const requestData = {
// //     key: merchantKey,
// //     txnid: txnid,
// //     amount: amount,
// //     productinfo: productinfo,
// //     firstname: firstname,
// //     email: email,
// //     phone: phone,
// //     pg: "CC", // Card Payment Gateway
// //     ccnum: req.body.cardNumber, // Card Number
// //     ccvv: req.body.cardCVV, // Card CVV
// //     ccexpmon: req.body.cardExpMonth, // Card Expiry Month
// //     ccexpyr: req.body.cardExpYear, // Card Expiry Year
// //     furl: failureUrl, // Failure URL
// //     surl: successUrl, // Success URL
// //     hash: generateHash({
// //       key: merchantKey,
// //       txnid: txnid,
// //       amount: amount,
// //       productinfo: productinfo,
// //       firstname: firstname,
// //       email: email,
// //       udf1: "", // Empty UDF fields
// //       udf2: "",
// //       udf3: "",
// //       udf4: "",
// //       udf5: "",
// //     }),
// //   };

//   const requestData = {
//     key: merchantKey,
//     txnid: "payuTestTransaction8169502",
//     amount: "10.00",
//     productinfo: "Product Info",
//     firstname: "Postman",
//     email: "test@payu.in",
//     phone: "9988776655",
//     pg: "CC",
//     bankcode: "AMEX",
//     ccnum: "378282246310005",
//     ccname: "ASHISH KUMAR",
//     ccvv: "1234",
//     ccexpmon: "05",
//     ccexpyr: "2025",
//     furl: failureUrl,
//     surl: successUrl,
//     hash: "5e0f040fb08759d621caf04baab4bd893e1d9f5d3edfc2aa42bea00c2ac7140b14b7883028a3b7fc5df6fb728f7542d85c2930c3f3dc4bab6a8b3da1ff33d9fe",
//     txn_s2s_flow: "4",
//     auth_only: "1",
//     termUrl: "https://admin.payu.in/test_response",
//     authentication_flow: "REDIRECT",
//     s2s_client_ip: "192.168.0.101",
//     s2s_device_info:
//       "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36",
//     notifyurl: "https://admin.payu.in/test_response",
//     address1: "123, Main Street",
//     address2: "Suite 456",
//     city: "Gurgaon",
//     state: "Haryana",
//     country: "India",
//     zipcode: "122018",
//     udf1: "Custom data 1",
//     udf2: "Custom data 2",
//     udf3: "Custom data 3",
//     udf4: "Custom data 4",
//     udf5: "Custom data 5",
//   };

// console.log(requestData)
//   // Send request to PayU
//   axios
//     .post("https://test.payu.in/_payment", requestData)
//     .then((response) => {
//       if (response.data.status === "success") {
//         res.send({
//           success: true,
//           message: "Payment initiated successfully",
//           txnid,
//         });
//       } else {
//         res.send({
//           success: false,
//           message: "Payment initiation failed",
//           error: response.data,
//         });
//       }
//     })
//     .catch((error) => {
//       console.error(error);
//       res
//         .status(500)
//         .send({ success: false, message: "Internal server error" });
//     });
// });

// // Step 3: Route for PayU success response (handle post-payment)
// app.post("/success", (req, res) => {
//   // Extract PayU response data
//   const response = req.body;

//   // Verify the hash from PayU response
//   const receivedHash = response.hash;
//   const calculatedHash = generateHash({
//     key: merchantKey,
//     txnid: response.txnid,
//     amount: response.amount,
//     productinfo: response.productinfo,
//     firstname: response.firstname,
//     email: response.email,
//     udf1: response.udf1,
//     udf2: response.udf2,
//     udf3: response.udf3,
//     udf4: response.udf4,
//     udf5: response.udf5,
//   });

//   if (receivedHash === calculatedHash) {
//     res.send({
//       success: true,
//       message: "Payment successful",
//       transactionId: response.txnid,
//     });
//   } else {
//     res.send({ success: false, message: "Hash verification failed" });
//   }
// });

// // Step 4: Route for PayU failure response (handle post-payment failure)
// app.post("/failure", (req, res) => {
//   // Handle failure response
//   const response = req.body;

//   res.send({
//     success: false,
//     message: "Payment failed",
//     error: response,
//   });
// });

// // Step 5: Start the server
// app.listen(port, () => {
//   console.log(`Server running at http://localhost:${port}`);
// });
const express = require("express");
const bodyParser = require("body-parser");
const crypto = require("crypto");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
// Replace with your PayU details
const PAYU_KEY = "CA6cjE";
const PAYU_SALT = "PZcsi0LUtvGm1pR775XzH2pug5QyLKW1";
const PAYU_BASE_URL = "https://test.payu.in/_payment"; // Change to sandbox URL for testing

// Utility function to generate hash
function generateHash(data) {
  const hashString = `${PAYU_KEY}|${data.txnid}|${data.amount}|${data.productinfo}|${data.firstname}|${data.email}|||||||||||${PAYU_SALT}`;
  return crypto.createHash("sha512").update(hashString).digest("hex");
}

// API Endpoint to initiate payment
app.post("/initiate-payment", async (req, res) => {
  try {
    const {
      txnid,
      amount,
      productinfo,
      firstname,
      email,
      phone,
      ccnum,
      ccexpmon,
      ccexpyr,
      ccvv,
    } = req.body;

    if (
      !txnid ||
      !amount ||
      !productinfo ||
      !firstname ||
      !email ||
      !phone ||
      !ccnum ||
      !ccexpmon ||
      !ccexpyr ||
      !ccvv
    ) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Prepare data for PayU
    const hash = generateHash({ txnid, amount, productinfo, firstname, email });
    const requestData = {
      key: PAYU_KEY,
      txnid,
      amount,
      productinfo,
      firstname,
      email,
      phone,
      pg: "CC",
      ccnum,
      ccexpmon,
      ccexpyr,
      ccvv,
      furl: "http://localhost:5000/failure", // Failure URL
      surl: "http://localhost:5000/success", // Success URL
      hash,
      txn_s2s_flow: "4",
      auth_only: "1",
      termUrl: "http://localhost:5000/auth-response",
      authentication_flow: "REDIRECT",
    };

    // Send payment request to PayU
    const response = await axios.post(
      PAYU_BASE_URL,
      new URLSearchParams(requestData).toString(),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    res.status(200).json({ success: true, data: response.data });
  } catch (error) {
    console.error("Error initiating payment:", error);
    res.status(500).json({
      success: false,
      message: "Payment initiation failed",
      error: error.message,
    });
  }
});

app.post("/handle-enrollment", (req, res) => {
  const { data } = req.body;

  if (data && data.result && data.result.acsTemplate) {
    const acsTemplate = Buffer.from(data.result.acsTemplate, "base64").toString(
      "utf8"
    );

    // Serve the decoded ACS template
    res.send(`
      <html>
        <body>
          <h2>Redirecting to Bank's Secure Page...</h2>
          ${acsTemplate}
        </body>
      </html>
    `);
  } else {
    res.status(400).send("Invalid response or missing ACS template.");
  }
});

// Success & Failure handlers
app.post("/success", (req, res) => {
  console.log("Payment Success:", req.body);
  res.json({ success: true, message: "Payment successful", data: req.body });
});

app.post("/failure", (req, res) => {
  console.log("Payment Failed:", req.body);
  res.json({ success: false, message: "Payment failed", data: req.body });
});

//At the termUrl, capture the response from PayU, verify the payment status, and update the order.
//Term URL to handle 3D Secure callback from bank
app.post("/auth-response", (req, res) => {
  try {
    const { bankData, referenceId } = req.body; // Extract raw data from the request

    if (!bankData) {
      return res.status(400).send("bankData missing in the callback.");
    }

    // Parse `bankData` JSON to extract the `cres` field
    const parsedBankData = JSON.parse(bankData);
    const cres = parsedBankData.cres; // Likely equivalent to PaRes

    if (!cres || !referenceId) {
      return res
        .status(400)
        .send("PaRes (cres) or referenceId missing in the callback.");
    }
    console.log("Body Data : ", req.body);
    console.log("Parsed Bank Data:", parsedBankData);

    // Perform server-to-server (S2S) validation with PayU
    axios
      .post("https://test.payu.in/payment/validate", {
        PaRes: cres,
        MD: referenceId,
      })
      .then((response) => {
        console.log("Validation Response:", response.data);

        // Handle successful or failed validation
        if (response.data.success) {
          res.send("Payment successfully authenticated.");
        } else {
          res.send("Authentication failed.");
        }
      })
      .catch((error) => {
        console.error("Error validating authentication:", error.message);
        res.status(500).send("Error validating authentication.");
      });
  } catch (error) {
    console.error("Error handling auth-response:", error.message);
    res.status(500).send("Internal server error.");
  }
});

// Start the server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
