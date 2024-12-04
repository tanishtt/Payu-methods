const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const crypto = require("crypto");

const app = express();

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

const PAYU_KEY = "CA6cjE";
const PAYU_SALT = "PZcsi0LUtvGm1pR775XzH2pug5QyLKW1";

app.post("/initiate-payment", async (req, res) => {
  const { amount, firstname, email, phone, productinfo } = req.body;

  // Generate a unique transaction ID
  const txnid = `txn_671205`;

  // Hash generation for PayU
  const hashString = `${PAYU_KEY}|${txnid}|${amount}|${productinfo}|${firstname}|${email}|||||||||||${PAYU_SALT}`;
  const hash = crypto.createHash("sha512").update(hashString).digest("hex");

  // Return transaction details to the frontend
  res.json({
    key: PAYU_KEY,
    txnid,
    hash,
    surl: "http://localhost:5000/success", // Success callback URL
    furl: "http://localhost:5000/failure", // Failure callback URL
  });
});

app.post("/success", async (req, res) => {
  console.log("success : ", req.body);

  //   res.redirect("http://localhost:3000/success");
  res.status(200).send("success.");
});

app.post("/failure", async (req, res) => {
  console.log("failure : ", req.body);
  //   res.redirect("http://localhost:3000/failure");
  res.status(200).send("failed.");
});

app.get("/test", async (req, res) => {
  res.send("test3");
});
app.listen(5000, () => {
  console.log("Server is running on port 5000");
});
