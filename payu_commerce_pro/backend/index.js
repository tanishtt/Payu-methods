const express = require("express");
const crypto = require("crypto");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
// Configuration
const merchantKey = "CA6cjE";
const merchantSalt = "PZcsi0LUtvGm1pR775XzH2pug5QyLKW1";

// Endpoint to generate hash
app.post("/generate-hash", (req, res) => {
  const expressData = req.body; // Frontend sends the transaction data
  const stringifiedExpressData = JSON.stringify(expressData);

  // Get current date in GMT format
  const date = new Date().toGMTString();

  // Construct hash string
  const hashString = stringifiedExpressData + "|" + date + "|" + merchantSalt;

  // Generate SHA512 hash
  const hash = crypto.createHash("sha512").update(hashString).digest("hex");

  // Construct authHeader
  const authHeader = `hmac username="${merchantKey}", algorithm="sha512", headers="date", signature="${hash}"`;

  res.json({ authHeader, date });
});

// Success callback
app.post("/success", (req, res) => {
  console.log("Payment Successful:", req.body);
  res.status(200).send("Payment successful.");
});

// Failure callback
app.post("/failure", (req, res) => {
  console.log("Payment Failed:", req.body);
  res.status(200).send("Payment failed.");
});

// Start the server
const PORT = 5000;
app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
