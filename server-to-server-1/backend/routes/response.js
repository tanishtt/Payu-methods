const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const { default: axios } = require("axios");
const urlencodedParser = bodyParser.urlencoded({ extended: false });

router.post("/", urlencodedParser, async (req, res) => {
  const pd = req.body;
  const formData = new URLSearchParams();

  formData.append("key", pd.key);
  formData.append("txnid", pd.txnid);
  formData.append("amount", pd.amount);
  formData.append("productinfo", pd.productinfo);
  formData.append("firstname", pd.firstname);
  formData.append("email", pd.email);
  formData.append("phone", pd.phone);
  formData.append("surl", pd.surl);
  formData.append("furl", pd.furl);
  formData.append("hash", pd.hash);
  formData.append("service_provider", pd.service_provider);

  try {
    const result = await axios.post(
      "https://test.payu.in/_payment",
      formData,
      {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      }
    );
    res.send(result.request.res.responseUrl);
  } catch (err) {
    console.log("Response Error:", err);
  }
});

// Mock console log for order confirmation instead of saving to DB
router.post("/test", async (req, res) => {
  if (req.body.status === "success") {
    console.log("Order confirmed:", req.body);
    res.send({
      status: req.body.status,
      transaction_id: `Transaction ID: ${req.body.mihpayid}.`,
      message: "Order confirmed. You'll receive an email shortly.",
    });
  } else {
    res.send({ status: "Payment is not Successful" });
  }
});

module.exports = router;
