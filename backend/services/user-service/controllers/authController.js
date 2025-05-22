require('dotenv').config();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Register a new user
const registerUser = async (req, res) => {
  const { name, gender, dob, email, mobile, password } = req.body;

  if (!name || !gender || !dob || !email || !mobile || !password) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  if (password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters long' });
  }

  try {
    const emailExists = await User.findOne({ email });
    if (emailExists) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    const mobileExists = await User.findOne({ mobile });
    if (mobileExists) {
      return res.status(400).json({ error: 'Mobile number already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      gender,
      dob,
      email,
      mobile,
      password: hashedPassword,
    });

    await newUser.save();

    // Generate token and return user info
    const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        name: newUser.name,
        email: newUser.email,
        mobile: newUser.mobile,
      },
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Server error during registration' });
  }
};

// Login with email and password
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
    const user = await User.findOne({ email });

    if (!user || !user.password) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        name: user.name,
        email: user.email,
        mobile: user.mobile,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error during login' });
  }
};



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
  registerUser,
  loginUser,
  getUserDashboard,
};
