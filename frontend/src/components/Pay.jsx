// Pay.jsx
import React, { useState } from 'react';

function Pay() {
  const [amount, setAmount] = useState(500); // ₹5
  const [currency] = useState("INR");
  const [receiptId] = useState("order_rcptid_11");
  const [userDetails] = useState({
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "9999999999"
  });

  const handlePayment = async (e) => {
    e.preventDefault();

    try {
      // Step 1: Create order on the server
      const response = await fetch("http://localhost:5002/order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          amount: amount * 100, // Convert ₹ to paise
          currency,
          receipt: receiptId
        })
      });

      const order = await response.json();

      // Step 2: Initialize Razorpay checkout
      const options = {
        key: "rzp_test_WwmlF1M46ivOUV", // Replace with your Razorpay Key ID
        amount: order.amount,
        currency: order.currency,
        name: "Acme Corp",
        description: "Test Transaction",
        image: "https://example.com/your_logo",
        order_id: order.id,
        handler: async function (response) {
          const validateRes = await fetch("http://localhost:5002/order/validate", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature
            })
          });

          const validate = await validateRes.json();

          if (validate.msg === "Payment Successful") {
            alert("✅ Payment successful!");
          } else {
            alert("❌ Payment verification failed.");
          }
        },
        prefill: {
          name: userDetails.name,
          email: userDetails.email,
          contact: userDetails.phone
        },
        notes: {
          address: "Corporate HQ"
        },
        theme: {
          color: "#3399cc"
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", function (response) {
        console.error("Payment failed:", response.error);
        alert("Payment failed. Please try again.");
      });
      rzp.open();
    } catch (error) {
      console.error("Error initiating payment:", error);
      alert("Something went wrong while processing payment.");
    }
  };

  return (
    <div className="container mt-5">
      <h2>Pay Now</h2>
      <button className="btn btn-primary" onClick={handlePayment}>
        Pay ₹{amount}
      </button>
    </div>
  );
}

export default Pay;
