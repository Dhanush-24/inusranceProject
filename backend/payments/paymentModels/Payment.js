// models/Payment.js
const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
  orderId: String,
  paymentId: String,
  amount: Number,
  currency: String,
  method: String,
  status: String,
  email: String,
  contact: String,
  mobile: String,
  policyType: String,
  created_at: Number,
},
  {
    timestamps: true, // Adds createdAt and updatedAt fields
  });

module.exports = mongoose.model("Payment", paymentSchema);
