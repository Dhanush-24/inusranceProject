const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    mobile: { type: String, required: true, 
         match: [/^\d{10}$/, 'Please provide a valid 10-digit mobile number'], unique: true },
    otp: { type: String },
    name: { type: String },
    gender: { type: String },
    dob: { type: Date },
    email: {
        type: String,
        unique: true,
        sparse: true, // <-- This is important!
      }
});



module.exports = mongoose.model('User', UserSchema);
