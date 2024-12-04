const express = require("express");
const router = express.Router();
const jsSHA = require("jssha");
const bodyParser = require("body-parser");
const urlencodedParser = bodyParser.urlencoded({ extended: false });

router.post("/", urlencodedParser, async (req, res) => {
  try {
    const { txnid, amount, productinfo, firstname, email } = req.body;
    if (!txnid || !amount || !productinfo || !firstname || !email) {
      res.send("Mandatory fields missing");
    } else {
      const hashString = `${process.env.KEY}|${txnid}|${amount}|${productinfo}|${firstname}|${email}||||||||||${process.env.SALT}`;
      const sha = new jsSHA("SHA-512", "TEXT");
      sha.update(hashString);
      const hash = sha.getHash("HEX");
      res.send({ hash: hash }); // hash value is sent as response
    }
  } catch {
    console.log("Payment Error");
  }
});

module.exports = router;
