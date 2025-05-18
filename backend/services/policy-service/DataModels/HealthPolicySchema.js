const mongoose = require('mongoose');

const healthInsurancePlanSchema = new mongoose.Schema({
  planId: {
    type: Number,
    required: true,
    unique: true,
  },
  company: {
    type: String,
    required: true,
  },
  plan: {
    type: String,
    required: true,
  },
  sumInsured: {
    type: String,
    required: true,
  },
  premiumAmount: {
    type: String,
    required: true,
  },
  features: {
    type: [String],
    required: true,
  },
  logoUrl: {
    type: String, // URL to logo image
    required: false,
  }
});

const HealthInsurancePlan = mongoose.model('HealthInsurancePlan', healthInsurancePlanSchema);

module.exports = HealthInsurancePlan;
