import { useState, useEffect } from "react";
import Check from "@mui/icons-material/Check";
import styled from "styled-components";
import axios from "axios";
import Modal from "@mui/material/Modal";
import Button from "@mui/material/Button";

const CheckoutButton = styled(Button)`
  && {
    background-color: green;
    color: white;
  }
`;

const PaymentComponent = () => {
  const [self, setSelf] = useState();
  const [oncheckOpen, setOnCheckOpen] = useState(false);
  let amount = 250; //update amount
  let contact = 1234567890; //update contact no.
  let url = process.env.REACT_APP_API_URL;

  const data = {
    txnid: "<id_of_item_purchased>", //String
    amount: amount.toFixed(2), //Float
    productinfo: "<desc_of_item>", //String
    firstname: "<buyer_first_name>", //String
    email: "<buyer_email>", //String
  };

  useEffect(() => {
    makePayment();
  }, [open]);
  let reshash; //hashvalue generated will be stored in this variable

  const makePayment = async () => {
    await paymentReq();
    await responseReq();
  };

  //This method will generate the hashvalue
  const paymentReq = async () => {
    try {
      reshash = await axios.post(`${url}/api/payment`, JSON.stringify(data), {
        headers: {
          "Content-Type": "application/json",
        },
      });
    } catch {
      console.log("Payment Error");
    }
  };

  //We are using a modal, to open the payment transaction gateway after a click
  const handleCheckClose = () => setOnCheckOpen(false); //close the modal
  const handleCheckOpen = () => setOnCheckOpen(true); //open the modal

  //This method will use that hash value to make the transaction complete
  const responseReq = async () => {
    const pd = {
      key: "<your_test_key", //once testing is done, change it to live key
      txnid: "<id_of_item_purchased>", //String,
      amount: amount.toFixed(2), //Float
      firstname: "<buyer_first_name>",
      email: "<buyer_email>",
      phone: contact,
      productinfo: "<desc_of_item>",
      surl: `${url}/api/response/test`, //url called if payment is successful, we have written the code in server.js below in the medium article
      furl: "<your_app_url>", //url called when payment fails
      hash: reshash?.data?.hash, //hashvalue
      service_provider: "payu_paisa",
    };
    let res;
    try {
      res = await axios.post(`${url}/api/response`, JSON.stringify(pd), {
        headers: {
          "Content-Type": "application/json",
        },
      });
      await setSelf(res.data);
      await handleCheckOpen();
      return res;
    } catch (err) {
      console.log("response error");
    }
  };
  return (
    <Modal
      open={oncheckOpen}
      onClose={handleCheckClose}
      closeAfterTransition
      style={{
        background: "white",
        width: "50%",
        margin: "auto",
        height: "20vh",
      }}
    >
      <div
        style={{
          backgroundColor: "white",
          height: "20vh",
          padding: "8%",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
        }}
      >
        <a href={self} target="_blank" rel="noreferrer noopener">
          <CheckoutButton style={{ margin: "auto", alignItems: "center" }}>
            You'll be redirected to PayU payment Gateway | <Check />
          </CheckoutButton>
        </a>
      </div>
    </Modal>
  );
};

export default PaymentComponent;
