const express = require("express");
const crypto = require("crypto");

const invoiceRouter = express.Router();

const generateHash = (data) => {
    return crypto.createHash("sha512").update(data).digest("hex");
};
const PAYU_KEY = "CA6cjE";
const PAYU_SALT = "PZcsi0LUtvGm1pR775XzH2pug5QyLKW1";

//initiate refund
invoiceRouter.post("/send-invoice", async (req, res) => {
    const formData = {
      key: PAYU_KEY,
        command: "send_sdk_message",
        hash,
        var1: '',//payuid
      var2:'7903109365'
    };
});


module.exports = invoiceRouter;
