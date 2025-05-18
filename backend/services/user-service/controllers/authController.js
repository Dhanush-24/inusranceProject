require('dotenv').config();
const twilio = require('twilio');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const otpService = require('../services/authService');  // You must implement generateOTP()

const client = new twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

// ✅ Helper: Check if user exists
const checkIfUserExists = async (mobileNumber) => {
  try {
    const user = await User.findOne({ mobile: mobileNumber });
    return !!user;
  } catch (error) {
    console.error('Error checking if user exists:', error);
    return false;
  }
};

// ✅ Send OTP
const sendOTP = async (req, res) => {
  const { mobile } = req.body;
  // Format mobile number
  let formattedMobile = mobile;
  if (!mobile.startsWith('+')) {
    formattedMobile = `+91${mobile}`;  // Adjust for your country code
  }

  if (!mobile || mobile.trim() === '') {
    return res.status(400).json({ error: 'Mobile number is required' });
  }

  try {
    const otp = otpService.generateOTP(); // e.g., 6-digit random number
    let user = await User.findOne({ mobile });

    if (!user) {
      user = new User({ mobile, otp });
    } else {
      user.otp = otp;
    }

    await user.save();

    await client.messages.create({
      body: `Your OTP is: ${otp}`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: formattedMobile,
    });

    return res.status(200).json({ message: 'OTP sent successfully' });
  } catch (error) {
    console.error('OTP send failed:', error.message);
    return res.status(500).json({ error: 'Failed to send OTP' });
  }
};

// ✅ Verify OTP
const verifyOTP = async (req, res) => {
  const { mobile, otp } = req.body;

  if (!mobile || !otp) {
    return res.status(400).json({ error: 'Mobile and OTP are required' });
  }

  try {
    const user = await User.findOne({ mobile });

    if (!user || user.otp !== otp) {
      return res.status(400).json({ error: 'Invalid OTP or user not found' });
    }

    user.otp = null; // Clear OTP after successful verification
    await user.save();

    // Optionally, generate a JWT token for login sessions
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    return res.status(200).json({ message: 'OTP verified successfully', token });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'OTP verification failed' });
  }
};

// ✅ Add/Update User Details
const addUserDetails = async (req, res) => {
  const { mobile, name, gender, dob, email } = req.body;

  if (!mobile || !name || !gender || !dob) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const user = await User.findOne({ mobile });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    user.name = name;
    user.gender = gender;
    user.dob = dob;

    if (email) user.email = email;

    await user.save();
    return res.status(200).json({ message: 'User details updated successfully' });
  } catch (error) {
    console.error(error);
    if (error.code === 11000 && error.keyPattern?.email) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    return res.status(500).json({ error: 'Error updating user details' });
  }
};

// ✅ Get Dashboard
const getUserDashboard = async (req, res) => {
  const { mobile } = req.params;

  if (!mobile || mobile.trim() === '') {
    return res.status(400).json({ error: 'Mobile number is required' });
  }

  try {
    const user = await User.findOne({ mobile }).select('-otp');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const policies = user.policies || []; // Assuming policies are part of user doc

    return res.status(200).json({ user, policies });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to fetch dashboard' });
  }
};

// ✅ Check Mobile Exists
const checkMobile = async (req, res) => {
  const { mobileNumber } = req.body;

  if (!mobileNumber || mobileNumber.trim() === '') {
    return res.status(400).json({ error: 'Mobile number is required' });
  }

  try {
    const exists = await checkIfUserExists(mobileNumber);
    return res.json({ exists });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Error checking mobile number' });
  }
};

module.exports = {
  sendOTP,
  verifyOTP,
  addUserDetails,
  getUserDashboard,
  checkMobile,
};
