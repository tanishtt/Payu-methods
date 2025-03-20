// const express = require("express");
// const axios = require("axios");
// const crypto = require("crypto");
// const multer = require("multer");
// const path = require("path");
// const cors = require("cors");
// const FormData = require("form-data");
// const fs = require("fs");

// const app = express();
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// app.use(cors());

// const PAYU_KEY = "CA6cjE";
// const PAYU_SALT = "PZcsi0LUtvGm1pR775XzH2pug5QyLKW1";
// const PAYU_TEST_URL = "https://test.payu.in/_payment";
// const PAYU_SERVICE_URL = "https://test.payu.in/merchant/postservice?form=2";

// // Success and failure URLs
// const SURL = "http://localhost:5000/payment-success";
// const FURL = "http://localhost:5000/payment-failure/";

// // Function to generate hash
// const generateHash = (data) => {
//   return crypto.createHash("sha512").update(data).digest("hex");
// };
// const txnid = `txn_${Date.now()}`; // Generate a unique transaction ID
// // Initiate Payment
// app.post("/create-payment", async (req, res) => {
//   const { amount, productinfo, firstname, lastname, email, phone } = req.body;
//   console.log(req.body);

//   const hardcodedData = {
//     pg: "CC",
//     bankcode: "CC",
//     ccnum: "5506900480000008",
//     ccexpyr: "2025",
//     ccexpmon: "09",
//     ccvv: "123",
//     ccname: "test",
//     address1: "308,third floor",
//     address2: "testing",
//     city: "ggn",
//     state: "UP",
//     country: "IND",
//     zipcode: "122018",
//     udf1: "GPHPM7928P",
//     udf3: "23-05-2002",
//     udf4: "Ciklum Pvt Ltd.",
//     udf5: "098450845",
//     txn_s2s_flow: 4,
//   };
//   const hashString = `${PAYU_KEY}|${txnid}|${amount}|${productinfo}|${firstname}|${email}|${hardcodedData.udf1}||${hardcodedData.udf3}|${hardcodedData.udf4}|${hardcodedData.udf5}||||||${PAYU_SALT}`;
//   const hash = generateHash(hashString);

//   const formData = {
//     key: PAYU_KEY,
//     txnid,
//     amount,
//     productinfo,
//     firstname,
//     lastname,
//     email,
//     phone,
//     address1: hardcodedData.address1,
//     address2: hardcodedData.address2,
//     city: hardcodedData.city,
//     state: hardcodedData.state,
//     country: hardcodedData.country,
//     zipcode: hardcodedData.zipcode,
//     pg: hardcodedData.pg,
//     bankcode: hardcodedData.bankcode,
//     ccnum: hardcodedData.ccnum,
//     ccname: hardcodedData.ccname,
//     ccexpmon: hardcodedData.ccexpmon,
//     ccexpyr: hardcodedData.ccexpyr,
//     ccvv: hardcodedData.ccvv,
//     SURL,
//     FURL,
//     udf1: hardcodedData.udf1,
//     udf3: hardcodedData.udf3,
//     udf4: hardcodedData.udf4,
//     udf5: hardcodedData.udf5,
//     hash,
//   };

//   res.json({ url: PAYU_TEST_URL, formData });
// });

// // Update Invoice ID (UDF5 Update) : if not included in udf5 while transaction.
// app.post("/update-invoice", async (req, res) => {
//   const { txnid, invoiceId } = req.body;
//   const hashString = `${PAYU_KEY}|udf_update|${txnid}|${PAYU_SALT}`;
//   const hash = generateHash(hashString);

//   try {
//     const response = await axios.post(PAYU_SERVICE_URL, {
//       key: PAYU_KEY,
//       command: "udf_update",
//       var1: txnid,
//       var5: invoiceId,
//       hash,
//     });
//     res.json(response.data);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// // Upload Invoice API : this may be hit multiple times according to number of venders.
// const storage = multer.diskStorage({
//   destination: "./uploads/",
//   filename: (req, file, cb) => {
//     cb(null, `${Date.now()}${path.extname(file.originalname)}`);
//   },
// });
// const upload = multer({ storage });

// app.post("/upload-invoice", upload.single("invoice"), async (req, res) => {
//   if (!req.file) {
//     return res.status(400).json({ error: "No file uploaded" });
//   }
//   const hardcodedData = {
//     mihpayid: "403993715533526302",
//     invoiceId: "098450845",
//   };
//   const filePath = req.file.path;
//   const hashString = `${PAYU_KEY}|opgsp_upload_invoice_awb|${hardcodedData.mihpayid}|${PAYU_SALT}`;
//   const hash = generateHash(hashString);
//   try {
//     const formData = new FormData();
//     formData.append("key", PAYU_KEY);
//     formData.append("command", "opgsp_upload_invoice_awb");
//     formData.append("var1", hardcodedData.mihpayid);
//     formData.append("var2", hardcodedData.invoiceId);
//     formData.append("var3", "Invoice");
//     formData.append("file", fs.createReadStream(filePath));
//     formData.append("hash", hash);
// console.log(formData);

//     const response = await axios.post(PAYU_SERVICE_URL, formData, {
//       headers: { "Content-Type": "multipart/form-data" },
//     });
//     res.json(response.data);
//   } catch (error) {
//     res.status(500).json({
//       responseCode: "103",
//       responseMsg: "Failed to Upload",
//       error: error.message,
//     });
//   }
// });

// const validateHash = (responseData, receivedHash) => {
//   // Ensure all udf fields are included, even if empty
//   const hashString = `${PAYU_SALT}|${responseData.status}|${
//     responseData.udf10 || ""
//   }|${responseData.udf9 || ""}|${responseData.udf8 || ""}|${
//     responseData.udf7 || ""
//   }|${responseData.udf6 || ""}|${responseData.udf5 || ""}|${
//     responseData.udf4 || ""
//   }|${responseData.udf3 || ""}|${responseData.udf2 || ""}|${
//     responseData.udf1 || ""
//   }|${responseData.email}|${responseData.firstname}|${
//     responseData.productinfo
//   }|${responseData.amount}|${responseData.txnid}|${PAYU_KEY}`;

//   console.log("Generated hash string:", hashString);

//   const generatedHash = crypto
//     .createHash("sha512")
//     .update(hashString)
//     .digest("hex");

//   console.log("Generated Hash:", generatedHash);
//   console.log("Received Hash:", receivedHash);

//   return generatedHash === receivedHash;
// };

// app.post("/payment-success", (req, res) => {
//   const responseData = req.body;
//   console.log(req.body);
//   // Validate the hash
//   const isValidHash = validateHash(responseData, responseData.hash);

//   if (isValidHash) {
//     console.log("Payment successful and hash validated:", responseData);
//     return res.redirect("http://localhost:3000/success");
//   } else {
//     console.log("Invalid hash - possible tampering detected:", responseData);
//     return res.redirect("http://localhost:3000/failure");
//   }
// });

// app.post("/payment-failure", (req, res) => {
//   console.log(req.body);
//   return res.redirect("http://localhost:3000/failure");
// });

// app.listen(5000, () => {
//   console.log("Server running on port 5000");
// });
// //sample success response:
// // Payment successful and hash validated: {
// //   mihpayid: '403993715533526302',
// //   mode: 'CC',
// //   status: 'success',
// //   unmappedstatus: 'captured',
// //   key: 'CA6cjE',
// //   txnid: 'txn_1741773571233',
// //   amount: '10.00',
// //   cardCategory: 'domestic',
// //   discount: '0.00',
// //   net_amount_debit: '10',
// //   addedon: '2025-03-12 15:29:43',
// //   productinfo: 'iPhone',
// //   firstname: 'Ashish',
// //   lastname: 'moh',
// //   address1: '308 third floor',
// //   address2: 'testing',
// //   city: 'ggn',
// //   state: 'UP',
// //   country: 'IND',
// //   zipcode: '122018',
// //   email: 'test@gmail.com',
// //   phone: '9876543210',
// //   udf1: 'GPHPM7928P',
// //   udf2: '',
// //   udf3: '23-05-2002',
// //   udf4: 'Ciklum Pvt Ltd.',
// //   udf5: '098450845',
// //   udf6: '',
// //   udf7: '',
// //   udf8: '',
// //   udf9: '',
// //   udf10: '',
// //   hash: '6ff7b6213f2582dc2913b9787e9f733302ac595696afead07d6f63f67383bae3e1960b7a815ed8d3b6fb332b4f67aa73db1fd82298642be0b62cf8b6ee8757af',
// //   field1: '988135348212510500',
// //   field2: '360454',
// //   field3: '10.00',
// //   field4: '',
// //   field5: '00',
// //   field6: '02',
// //   field7: 'AUTHPOSITIVE',
// //   field8: 'AUTHORIZED',
// //   field9: 'Transaction is Successful',
// //   payment_source: 'payu',
// //   pa_name: 'PayU',
// //   PG_TYPE: 'CC-PG',
// //   bank_ref_num: '988135348212510500',
// //   bankcode: 'CC',
// //   error: 'E000',
// //   error_Message: 'No Error',
// //   cardnum: 'XXXXXXXXXXXX0008'
// // }
const express = require("express");
const axios = require("axios");
const crypto = require("crypto");
const multer = require("multer");
const path = require("path");
const cors = require("cors");
const FormData = require("form-data");
const fs = require("fs");
const refundRouter = require("./refund");
require('dotenv').config();
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

const SURL = "http://localhost:5000/payment-success";
const FURL = "http://localhost:5000/payment-failure/";
const SURL_REGISTER_SUCCESS = "http://localhost:5000/payment-register-success";
const FURL_REGISTER_FAILURE = "http://localhost:5000/payment-register-failure";
const PREDEBIT_URL = "https://test.payu.in/merchant/postservice.php?form=2";
const REFUND_URL = "https://test.payu.in/merchant/postservice.php?form=2";

const PAYU_KEY = "CA6cjE";
const PAYU_SALT = "PZcsi0LUtvGm1pR775XzH2pug5QyLKW1";
const PAYU_TEST_URL = "https://test.payu.in/_payment";
const PAYU_MANDATE_NETB_URL =
  "https://test.payu.in/merchant/postservice.php?form=2";

//1.register transaction : payment consent.
const generateHash = (data) => {
  return crypto.createHash("sha512").update(data).digest("hex");
};
const validateHash = (responseData, receivedHash) => {
  // Ensure all udf fields are included, even if empty
  const hashString = `${PAYU_SALT}|${responseData.status}|${
    responseData.udf10 || ""
  }|${responseData.udf9 || ""}|${responseData.udf8 || ""}|${
    responseData.udf7 || ""
  }|${responseData.udf6 || ""}|${responseData.udf5 || ""}|${
    responseData.udf4 || ""
  }|${responseData.udf3 || ""}|${responseData.udf2 || ""}|${
    responseData.udf1 || ""
  }|${responseData.email}|${responseData.firstname}|${
    responseData.productinfo
  }|${responseData.amount}|${responseData.txnid}|${PAYU_KEY}`;

  console.log("Generated hash string:", hashString);

  const generatedHash = crypto
    .createHash("sha512")
    .update(hashString)
    .digest("hex");

  console.log("Generated Hash:", generatedHash);
  console.log("Received Hash:", receivedHash);

  return generatedHash === receivedHash;
};
app.post("/net-banking-register-transation", async (req, res) => {
  const { productinfo, firstname, email, phone } = req.body;
  console.log(req.body);

  const hardcodedData = {
    pg: "ENACH",
    bankcode: "ICICENCC",
    ccnum: "5506900480000008",
    ccexpyr: "2025",
    ccexpmon: "09",
    ccvv: "123",
    ccname: "test",
    address1: "308,third floor",
    address2: "testing",
    city: "ggn",
    state: "UP",
    country: "IND",
    zipcode: "122018",
    udf1: "",
    udf2: "",
    udf3: "",
    udf4: "",
    udf5: "",
    txn_s2s_flow: 4,
    si_details: {
      billingAmount: 10,
      billingCurrency: "INR",
      billingCycle: "MONTHLY", //post-paid bills where there is no definite billing cycle and billing amount.
      billingInterval: 1,
      paymentStartDate: "2025-03-19", //for upi, current date.
      paymentEndDate: "2025-12-01",
    },
    beneficiarydetail: {
      beneficiaryName: "Sachin Tendulkar",
      beneficiaryAccountNumber: "1211450021",
      beneficiaryAccountType: "SAVINGS",
      beneficiaryIfscCode: "ICIC0000046",
      verificationMode: "DEBIT_CARD",
    },
  };

  const txnid = `txn_${Date.now()}`;
  const amount = 89; //for net banking, mandatory 0 (other banks), if upfront payment then only with icici & hdfc.

  const hashString = `${
    PAYU_KEY
  }|${txnid}|${amount}|${productinfo}|${firstname}|${email}|${
    hardcodedData.udf1
  }|${hardcodedData.udf2}|${hardcodedData.udf3}|${hardcodedData.udf4}|${
    hardcodedData.udf5
  }||||||${JSON.stringify(hardcodedData.si_details)}|${PAYU_SALT}`;

  const hash = generateHash(hashString);

  const formData = {
    key: PAYU_KEY,
    txnid,
    amount,
    productinfo,
    firstname,
    email,
    phone,
    surl: SURL_REGISTER_SUCCESS,
    furl: FURL_REGISTER_FAILURE,
    // pg: hardcodedData.pg,
    // bankcode: hardcodedData.bankcode,
    api_version: 7,
    si: "1", //This parameter signifies a successful consent taken from the user by the merchant. This parameter must contain 1 for a successful consent.
    si_details: JSON.stringify(hardcodedData.si_details),
    // beneficiarydetail:JSON.stringify(hardcodedData.beneficiarydetail),
    hash,
  };

  res.json({ url: PAYU_TEST_URL, formData });
});

app.post("/net-banking-check-mandate", async (req, res) => {
  const hashString = `${
    PAYU_KEY
  }|"NB_mandate_status"|${JSON.stringify({
    authpayuid: "403993715533535033",
    requestId: "txn_1741865817839",
  })}|${PAYU_SALT}`;

  const hash = generateHash(hashString);
  const formData = {
    key: PAYU_KEY,
    command: "NB_mandate_status",
    var1: JSON.stringify({
      authpayuid: "403993715533535033",
      requestId: "txn_1741865817839",
    }),
    hash,
  };
  console.log();

  res.json({ url: PAYU_MANDATE_NETB_URL, formData });
});

app.post("/payment-register-success", (req, res) => {
  const responseData = req.body;
  console.log(req.body);
  // Validate the hash
  const isValidHash = validateHash(responseData, responseData.hash);

  if (isValidHash) {
    console.log(
      "Payment register successful and hash validated:",
      responseData
    );
    return res.redirect("http://localhost:3000/register-success");
  } else {
    console.log(
      "Invalid hash - possible tampering detected while registering:",
      responseData
    );
    return res.redirect("http://localhost:3000/register-failure");
  }
});

app.post("/payment-register-failure", (req, res) => {
  console.log(req.body);
  return res.redirect("http://localhost:3000/register-failure");
});



app.use("/refund", refundRouter);
app.use('/invoice');

//cards consent tarnsaction
// const generateHash = (data) => {
//   return crypto.createHash("sha512").update(data).digest("hex");
// };
// const validateHash = (responseData, receivedHash) => {
//   // Ensure all udf fields are included, even if empty
//   const hashString = `${PAYU_SALT}|${responseData.status}|${
//     responseData.udf10 || ""
//   }|${responseData.udf9 || ""}|${responseData.udf8 || ""}|${
//     responseData.udf7 || ""
//   }|${responseData.udf6 || ""}|${responseData.udf5 || ""}|${
//     responseData.udf4 || ""
//   }|${responseData.udf3 || ""}|${responseData.udf2 || ""}|${
//     responseData.udf1 || ""
//   }|${responseData.email}|${responseData.firstname}|${
//     responseData.productinfo
//   }|${responseData.amount}|${responseData.txnid}|${PAYU_KEY}`;

//   console.log("Generated hash string:", hashString);

//   const generatedHash = crypto
//     .createHash("sha512")
//     .update(hashString)
//     .digest("hex");

//   console.log("Generated Hash:", generatedHash);
//   console.log("Received Hash:", receivedHash);

//   return generatedHash === receivedHash;
// };
app.post("/card-register-transation", async (req, res) => {
  const { productinfo, firstname, lastname, email, phone } = req.body;
  console.log(req.body);

  const hardcodedData = {
    pg: "CC",
    bankcode: "MAST",
    ccnum: "5123456789012346",
    ccexpyr: "2025",
    ccexpmon: "05",
    ccvv: "123",
    ccname: "test",
    address1: "308,third floor",
    address2: "testing",
    city: "ggn",
    state: "UP",
    country: "IND",
    zipcode: "122018",
    udf1: "",
    udf2: "",
    udf3: "",
    udf4: "",
    udf5: "",
    txn_s2s_flow: 4,
    si_details: {
      billingAmount: 10,
      billingCurrency: "INR",
      billingCycle: "MONTHLY", //post-paid bills where there is no definite billing cycle and billing amount.
      billingInterval: 1,
      paymentStartDate: "2025-03-19", //for upi, current date.
      paymentEndDate: "2025-12-01",
    },
    beneficiarydetail: {
      beneficiaryName: "Sachin Tendulkar",
      beneficiaryAccountNumber: "1211450021",
      beneficiaryAccountType: "SAVINGS",
      beneficiaryIfscCode: "ICIC0000046",
      verificationMode: "DEBIT_CARD",
    },
  };

  const txnid = `txn_${Date.now()}`;
  const amount = 23;

  const hashString = `${
    PAYU_KEY
  }|${txnid}|${amount}|${productinfo}|${firstname}|${email}|${
    hardcodedData.udf1
  }|${hardcodedData.udf2}|${hardcodedData.udf3}|${hardcodedData.udf4}|${
    hardcodedData.udf5
  }||||||${JSON.stringify(hardcodedData.si_details)}|${PAYU_SALT}`;

  const hash = generateHash(hashString);

  const formData = {
    key: PAYU_KEY,
    txnid,
    amount,
    productinfo,
    firstname,
    lastname,
    email,
    phone,
    pg: hardcodedData.pg,
    bankcode: hardcodedData.bankcode,
    ccnum: hardcodedData.ccnum,
    ccvv: hardcodedData.ccvv,
    ccexpmon: hardcodedData.ccexpmon,
    ccexpyr: hardcodedData.ccexpyr,
    surl: SURL_REGISTER_SUCCESS,
    furl: FURL_REGISTER_FAILURE,
    // pg: hardcodedData.pg,
    // bankcode: hardcodedData.bankcode,
    api_version: 7,
    si: "1", //This parameter signifies a successful consent taken from the user by the merchant. This parameter must contain 1 for a successful consent.
    si_details: JSON.stringify(hardcodedData.si_details),
    // beneficiarydetail:JSON.stringify(hardcodedData.beneficiarydetail),
    hash,
  };

  res.json({ url: PAYU_TEST_URL, formData });
});

app.post("/card-check-mandate", async (req, res) => {
  const hashString = `${
    PAYU_KEY
  }|"NB_mandate_status"|${JSON.stringify({
    authpayuid: "403993715533535033",
    requestId: "txn_1741865817839",
  })}|${PAYU_SALT}`;

  const hash = generateHash(hashString);
  const formData = {
    key: PAYU_KEY,
    command: "NB_mandate_status",
    var1: JSON.stringify({
      authpayuid: "403993715533535033",
      requestId: "txn_1741865817839",
    }),
    hash,
  };
  console.log();

  res.json({ url: PAYU_MANDATE_NETB_URL, formData });
});
app.post("/card-predebit-notify", async (req, res) => {
  const var1 = {
    authPayuId: "403993715533535033",
    requestId: "137875580",
    debitDate: "2025-03-21",
    amount: 10,
    invoiceDisplayNumber: "0001",
    action: "Retrieve",
  };
  const hashString = `${PAYU_KEY}|pre_debit_SI|${JSON.stringify(
    var1
  )}|${PAYU_SALT}`;
  const hash = generateHash(hashString);

  const formData = {
    key: PAYU_KEY,
    var1: JSON.stringify(var1),
    hash,
    command: "pre_debit_SI",
  };
  res.json({ url: PREDEBIT_URL, formData });
});
//{"status":0,"message":"Mandate entry not found","action":"MANDATE_PRE_DEBIT"}
const generateHashPreDebit = (command, var1) => {
  const hashString = `${PAYU_KEY}|${command}|${var1}|${PAYU_SALT}`;
  return crypto.createHash("sha512").update(hashString).digest("hex");
};

app.post("/card-test-predebit-notify", async (req, res) => {
  try {
    const var1 = JSON.stringify({
      authPayuId: "403993715533538034",
      requestId: "137878021",
      debitDate: "2025-03-21",
      amount: 10,
      invoiceDisplayNumber: "unique_id_101",
      action: "Retrieve",
    });

    const hash = generateHashPreDebit("check_action_status_txnid", var1);

    const payload = new URLSearchParams({
      key: PAYU_KEY,
      hash,
      command: "check_action_status_txnid",
      var1,
    });

    const response = await axios.post(
      PREDEBIT_URL,
      payload.toString(),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    res.json({
      message: "Pre-Debit Notification Sent",
      response: response.data,
    });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Pre-Debit Notification Failed", details: error.message });
  }
});
app.get('/test', (req, res) => {
  res.json({ status: 'all good.' });
})
app.listen(5000, () => {
  console.log("server running on port 5000.");
});
//not working for 0 rupees in case of netbanking.

// Payment register successful and hash validated: {
//   mihpayid: '403993715533538034',
//   mode: 'CC',
//   status: 'success',
//   unmappedstatus: 'captured',
//   key: 'CA6cjE',
//   txnid: 'txn_1741933165435',
//   amount: '23.00',
//   cardCategory: 'domestic',
//   discount: '0.00',
//   net_amount_debit: '23',
//   addedon: '2025-03-14 11:49:26',
//   productinfo: 'disneyhotstar',
//   firstname: 'Tanish',
//   lastname: 'Mohanta',
//   address1: '',
//   address2: '',
//   city: '',
//   state: '',
//   country: '',
//   zipcode: '',
//   email: 'test@gmail.com',
//   phone: '9876543210',
//   udf1: '',
//   udf2: '',
//   udf3: '',
//   udf4: '',
//   udf5: '',
//   udf6: '',
//   udf7: '',
//   udf8: '',
//   udf9: '',
//   udf10: '',
//   hash: '2d902bedcebe3edf9772bb627d885232c6dd174598a9e2e2aaa44fdbe191775abfef964c341b4b45e2d87eedc15b11451e391cb3c34fa5a55fd42eddcf8b878f',
//   field1: '833831507791233500',
//   field2: '529286',
//   field3: '23.00',
//   field4: '',
//   field5: '00',
//   field6: '02',
//   field7: 'AUTHPOSITIVE',
//   field8: 'AUTHORIZED',
//   field9: 'Transaction is Successful',
//   payment_source: 'payu',
//   pa_name: 'PayU',
//   PG_TYPE: 'CC-PG',
//   bank_ref_num: '833831507791233500',
//   bankcode: 'CC',
//   error: 'E000',
//   error_Message: 'No Error',
//   cardnum: 'XXXXXXXXXXXX2346'
// }
