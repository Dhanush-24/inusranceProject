const mongoose = require('mongoose');

const termPolicySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  mobile: {
    type: String,
    required: true,
  },
  insureFor: {
    type: String,
    required: false,
  },
  pincode: {
    type: String,
    required: false,
  },
  district: {
    type: String,
    required: false,
  },
  healthIssues: {
    type: [String],
    default: [],
  },
  planName: {
    type: String,
  },
  insurer: {
    type: String,
  },
  claimSettlementRatio: {
    type: String,
  },
  keyFeatures: {
    type: [String],
    default: [],
  },
  lifeCover: {
    type: String,    
  },
  insuranceTerm: {
    type: String,    
  },
  premiumAmount: {
    type: String,    
  },
}, { timestamps: true });

const TermPolicy = mongoose.model('TermPolicy', termPolicySchema);

module.exports = TermPolicy;
