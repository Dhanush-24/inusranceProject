// models/policySchema.js
const mongoose = require('mongoose');

const carPolicySchema = new mongoose.Schema({
  planId: {
    type: Number,
    required: true,
    unique: true
  },
  insurerName: {
    type: String,
    required: true
  },
  policyName: {
    type: String,
    required: true
  },
  idvValue: {
    type: Number,
    required: true
  },
  premiumAmount: {
    type: Number,
    required: true
  },
  claimSettlementRatio: {
    type: String,
    required: true
  },
  cashlessGarages: {
    type: Number,
    required: true
  },
  specialBenefits: {
    type: [String],
    default: []
  },
  logoUrl: {
    type: String, // URL to the company's logo
    required: false
  }
});

module.exports = mongoose.model('CarPolicy', carPolicySchema);
