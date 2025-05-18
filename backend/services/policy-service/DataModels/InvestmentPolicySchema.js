const mongoose = require('mongoose');

const investmentPlanSchema = new mongoose.Schema({
  planId: {
    type: Number,
    required: true,
    unique: true,
  },
  company: {
    type: String,
    required: true,
  },
  planName: {
    type: String,
    required: true,
  },
  premium: {
    type: String,
    required: true,
  },
  returnAmount: {
    type: String,
    required: true,
  },
  returnPercentage: {
    type: String,
    required: true,
  },
  otherBenefits: {
    lifeCover: {
      type: String,
      required: true,
    },
    taxSaving: {
      type: String,
      required: true,
    },
  },
  logoUrl: {
    type: String, // Optional logo URL
  }
});

const InvestmentPlan = mongoose.model('InvestmentPlan', investmentPlanSchema);

module.exports = InvestmentPlan;
