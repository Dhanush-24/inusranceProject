const Razorpay = require('razorpay');
const axios = require('axios');
require('dotenv').config();

const crypto = require("crypto");
const Payment = require("../paymentModels/Payment"); 

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Mapping of policy types to API endpoints
const premiumEndpoints = {
  car: `/api/car/premium/`,
  bike: `/api/bike/premium/`,
  health: `/api/health/premium/`,
  term: `/api/term/premium/`,
  investment: `/api/investmentPolicy/premium/`,
  guaranteed: `/api/guarented-policy/premium/`,
};

exports.createOrder = async (req, res) => {
  const { mobile, type } = req.body;

  if (!mobile || !type) {
    return res.status(400).json({ success: false, message: "Mobile and type are required." });
  }

  try {
    console.log("Fetching premium for mobile:", mobile, "type:", type);
    
    // Step 1: Fetch premium from the correct API based on the policy type
    const premiumApiUrl = `http://localhost:5001${premiumEndpoints[type]}${mobile}`;
    
    if (!premiumEndpoints[type]) {
      return res.status(400).json({ success: false, message: "Invalid policy type." });
    }

    const response = await axios.get(premiumApiUrl);
   const premium = response.data.premiumAmount||response.data.annualPremium||response.data.premium;
console.log("Premium Amount:", premium);  // Debug log

let numericAmount;

if (typeof premium === 'string') {
  // If it's a string like "₹1,500/month"
  numericAmount = parseInt(premium.replace(/[^\d]/g, ''));
} else if (typeof premium === 'number') {
  // If it's already a number like 1500
  numericAmount = premium;
} else {
  return res.status(400).json({ success: false, message: "Invalid premium format." });
}

if (isNaN(numericAmount)) {
  return res.status(400).json({ success: false, message: "Invalid premium amount." });
}


    console.log("Creating Razorpay order for amount:", numericAmount);

    // Step 2: Create Razorpay order
    const order = await razorpay.orders.create({
      amount: numericAmount * 100, // Razorpay takes amount in paise
      currency: "INR",
      receipt: `receipt_${type}_${Date.now()}`
    });

    console.log("Razorpay order created:", order);

    res.status(200).json({ success: true, order });

  } catch (error) {
    console.error("Error creating Razorpay order:", error);

    if (error.response) {
      // This will capture the response error from Axios if any
      console.error("Error Response:", error.response.data);
    }
    
    res.status(500).json({ success: false, message: error.message });
  }
};




exports.verifyAndStorePayment = async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, policyType, mobile } = req.body;

  const generated_signature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest("hex");

  if (generated_signature !== razorpay_signature) {
    return res.status(400).json({ success: false, message: "Invalid signature" });
  }

  try {
    const paymentDetails = await razorpay.payments.fetch(razorpay_payment_id);

    const savedPayment = await Payment.create({
      orderId: razorpay_order_id,
      paymentId: razorpay_payment_id,
      amount: paymentDetails.amount,
      currency: paymentDetails.currency,
      method: paymentDetails.method,
      status: paymentDetails.status,
      email: paymentDetails.email,
      contact: paymentDetails.contact,
      mobile,
      policyType,
      created_at: paymentDetails.created_at,
    });

    res.status(200).json({ success: true, payment: savedPayment });
  } catch (err) {
    console.error("Error verifying and storing payment:", err);
    res.status(500).json({ success: false, message: "Failed to verify and store payment" });
  }
};


exports.getPaymentDetailsByMobile = async (req, res) => {
  try {
    const mobile = req.params.mobile;
    const payments = await Payment.find({ mobile }).sort({ created_at: -1 });
    res.status(200).json({ success: true, data: payments });
  } catch (err) {
    console.error("Error fetching payments:", err);
    res.status(500).json({ success: false, message: "Failed to fetch payment details" });
  }
};