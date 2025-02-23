import React from "react";
import "../Assets/Css/HomeCss/PaymentPage.css";
import { Footer, Header, Section } from "../Components"; // Make sure these components are correctly defined
import FooterTopBar from "../Components/FooterTopBar";

const PaymentPage = () => {
  const handlePayment = () => {
    // Logic for handling payment submission goes here
    alert("Payment processed!");
  };

  return (
    <div>
      <Header />
      <div className="payment-container">
        <header className="payment-header">
          <h1>Payment Information</h1>
        </header>
        <div className="payment-details">
          <h2>Your Appointment</h2>
          <div className="appointment-card">
            <h3>Dr. Munazza Zahoor</h3>
            <p>Appointment Date: September 25, 2024</p>
            <p>Appointment Time: 10:00 AM</p>
            <p>Appointment Type: Online Video Consultation</p>
            <p className="fee">Fee: Rs. 1,500</p>
            <p className="discount">Pay Online & Get 10% OFF!</p>
          </div>
        </div>
        <div className="payment-method">
          <h2>Select Payment Method</h2>
          <div className="payment-options">
            <div className="payment-option">
              <input
                type="radio"
                id="credit-card"
                name="payment"
                value="credit-card"
                defaultChecked
              />
              <label htmlFor="credit-card">Credit/Debit Card</label>
            </div>
            <div className="payment-option">
              <input type="radio" id="paypal" name="payment" value="paypal" />
              <label htmlFor="paypal">PayPal</label>
            </div>
            {/* <div className="payment-option">
              <input type="radio" id="cash" name="payment" value="cash" />
              <label htmlFor="cash">Cash on Delivery</label>
            </div> */}
          </div>
        </div>
        <button className="pay-button" onClick={handlePayment}>
          Confirm Payment
        </button>
      </div>
      <FooterTopBar />
      <Footer />
    </div>
  );
};

export default PaymentPage;
