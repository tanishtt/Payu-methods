import React from "react";
import PaymentForm from "./components/PaymentForm";
import { PayUIntegration } from "./components/PayUIntegration";

function App() {
  return (
    <div className="App">
      <h1>PayU Register Payment</h1>
      <PayUIntegration />
    </div>
  );
}

export default App;
