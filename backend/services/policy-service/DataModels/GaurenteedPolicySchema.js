const mongoose = require('mongoose');

const guaranteedPolicySchema = new mongoose.Schema({
  planId: {
    type: Number,
    required: true,
    unique: true
  },
  Company: {
    type: String,
    required: true
  },
  PlanName: {
    type: String,
    required: true
  },
  PremiumPerYear: {
    type: Number,
    required: true
  },
  PolicyTerm: {
    type: String,
    required: true
  },
  PremiumPaymentTerm: {
    type: String,
    required: true
  },
  MonthlyIncomeAfterPremiumTerm: {
    type: Number,
    default: null
  },
  MonthlyIncomeDuration: {
    type: String,
    default: null
  },
  MaturityBenefit: {
    type: Number,
    required: true
  },
  LifeCover: {
    type: Number,
    required: true
  },
  Features: {
    type: [String],
    default: []
  },
  logoUrl: {
    type: String,
    required: false // Optional, make true if every entry must have a logo
  }
});

module.exports = mongoose.model('GuaranteedPolicy', guaranteedPolicySchema);
