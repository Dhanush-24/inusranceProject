const mongoose = require('mongoose');

const investmentPolicySchema = new mongoose.Schema({
  name: { type: String, required: true },
  mobile: { type: String, required: true },
  pincode: { type: String, required: false },
  district: { type: String, required: false },
  company: { type: String },
  planName: { type: String },
  premium: {
    type: String,
    required: false,
  },
  returnAmount: {
    type: String,
    required: false,
  },
  returnPercentage: {
    type: String,
    required: false,
  },
  otherBenefits: {
    type: Object,
    required: false,
  },
}, { timestamps: true });

module.exports = mongoose.model('investmentPolicy', investmentPolicySchema);
