// pay.js
import express from 'express';
import cors from 'cors';
import Razorpay from 'razorpay';
import dotenv from 'dotenv';
import crypto from 'crypto';

dotenv.config();

const app = express();
const port = 5002;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Initialize Razorpay instance
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

app.listen(port, () => {
  console.log(`🚀 Server is running on port ${port}`);
});

// Route to create a new order
app.post("/order", async (req, res) => {
  try {
    const { amount, currency, receipt } = req.body;

    console.log("Creating order with:", req.body);

    const order = await razorpay.orders.create({
      amount,      // amount in the smallest currency unit (paise)
      currency,
      receipt
    });

    if (!order) {
      return res.status(500).json({ message: "Failed to create order" });
    }

    res.json(order);
  } catch (err) {
    console.error("Order creation error:", err);
    res.status(500).json({ message: "Failed to create order", error: err.message });
  }
});

// Route to validate payment
app.post("/order/validate", (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

  const sha = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET);
  sha.update(`${razorpay_order_id}|${razorpay_payment_id}`);
  const digest = sha.digest("hex");

  if (digest !== razorpay_signature) {
    return res.status(400).json({ msg: "Transaction not legitimate!" });
  }

  res.json({
    msg: "Payment Successful",
    orderId: razorpay_order_id,
    paymentId: razorpay_payment_id,
  });
});
