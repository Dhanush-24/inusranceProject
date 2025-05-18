const mongoose = require('mongoose');

const healthPolicySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  mobile: {
    type: String,
    required: true
  },
  insureFor: {
    type: String,
    required: true  
  },
  pincode: {
    type: String,
    required: true
  },
  district: {
    type: String,
    required: true
  },
  healthIssues: {
    type: [String],
    required: true
  },
  // Selected Plan Details:
  company: {
    type: String,
  },
  plan: {
    type: String,
  },
  sumInsured: {
    type: String,
  },
  premiumAmount: {
    type: String,
  },
  features: {
    type: [String],
  }
}, { timestamps: true });

const HealthPolicy = mongoose.model('HealthPolicy', healthPolicySchema);
module.exports = HealthPolicy;
