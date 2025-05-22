const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  mobile: {
    type: String,
    required: true,
    match: [/^\d{10}$/, 'Please provide a valid 10-digit mobile number'],
    unique: true
  },
  name: { type: String },
  gender: { type: String },
  dob: { type: Date },
  email: {
    type: String,
    unique: true,
    sparse: true
  },
  password: {
    type: String,
    required: false,
    minlength: [6, 'Password must be at least 6 characters long']
  }
});

module.exports = mongoose.model('User', UserSchema);
