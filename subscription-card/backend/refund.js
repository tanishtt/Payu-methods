const express = require("express");
const crypto = require("crypto");

const refundRouter = express.Router();

//PayU offers refunds for payments made using PayU India products: PayU Offers, PayU Partners, Split Settlements, etc. Generally, you need to initiate a refund request using any of the following methods:
// The Refund Transaction API (cancel_refund_transaction) can be used for the following purposes:

// Cancel a transaction that is in ‘auth’ state at the moment.
// Refund a transaction that is in a ‘captured’ state at the moment.
const generateHash = (data) => {
    return crypto.createHash("sha512").update(data).digest("hex");
};
const PAYU_KEY = "CA6cjE";
const PAYU_SALT = "PZcsi0LUtvGm1pR775XzH2pug5QyLKW1";

//initiate refund
refundRouter.post("/initiate-refund", async (req, res) => {
    const refund_id = `refund_${Date.now()}`;
  const data = {
    command: "cancel_refund_transaction",
    var1: "403993715533557427", //mihpayid,
    var2: refund_id,
    var3: "23",
    var5: "https://2chltcnb-5000.euw.devtunnels.ms/refund/status",
  };
    
    const hashString = `${PAYU_KEY}|${data.command}|${data.var1}|${PAYU_SALT}`;
    const hash = generateHash(hashString);

    const formData = {
      key: PAYU_KEY,
      command: data.command,
      var1: data.var1,
      var2: data.var2,
      var3: data.var3,
      var5: data.var5,
      hash,
    };

    res.json({
      url: process.env.REFUND_URL,
      formData,
    });
});

//check refund status with PayU ID
refundRouter.post('/check-refund-status', async (req, res) => {
    const data = {
      command: "check_action_status",
      var1: "403993715533557427", //mihpayid,
      var2: 'payuid',
    };

    const hashString = `${PAYU_KEY}|${data.command}|${data.var1}|${PAYU_SALT}`;
    const hash = generateHash(hashString);

    const formData = {
      key: PAYU_KEY,
      command: data.command,
      var1: data.var1,
      var2: data.var2,
      hash,
    };

    res.json({
      url: process.env.CHECK_REFUND_URL,
      formData,
    });
})

refundRouter.post('/status', async (req, res) => {
    console.log(req.body);
    console.log(req);
    console.log('refund initiated successfully');

})

module.exports = refundRouter;
//{"status":1,"msg":"Refund Request Queued","request_id":"137891165","bank_ref_num":null,"mihpayid":403993715533536034,"error_code":102}
//{"status":0,"msg":"Refund FAILURE - Transaction Not Found","error_code":116,"mihpayid":403993715533538050}
//note:The error_code ​value 102​ should be treated as success;


//{"status":1,"msg":"1 out of 1 Transactions Fetched Successfully","transaction_details":{"403993715533557427":{"137891551":{"mihpayid":"403993715533557427","bank_ref_num":"107592904897282480","request_id":"137891551","amt":"23.00","mode":"CC","action":"capture","token":"","status":"SUCCESS","bank_arn":null,"settlement_id":null,"amount_settled":null,"UTR_no":null,"value_date":null,"refund_mode":"-","successAmount":null},"137892082":{"mihpayid":"403993715533557427","bank_ref_num":null,"request_id":"137892082","amt":"23.00","mode":"CC","action":"refund","token":"refund_1742301516124","status":"queued","bank_arn":null,"settlement_id":null,"amount_settled":null,"UTR_no":null,"value_date":null,"refund_mode":"Back to Source","successAmount":null}}}}