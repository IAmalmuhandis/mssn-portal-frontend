import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Main from "./components/Main";
import Reciept from "./components/reciept/Reciept";
import VerifyPayment from "./components/VerifyPayment";

const App = () => {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
        
          <Route path="/" element={<Main />} />
          <Route path="/reciept" element={<Reciept />} />
          <Route path="/payment/:reference" element={<VerifyPayment />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};
export default App;
