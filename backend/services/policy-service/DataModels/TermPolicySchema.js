const mongoose = require('mongoose');

const lifeInsurancePlanSchema = new mongoose.Schema({
  PlanId: {
    type: Number, // Using Number for the id field
    required: true,
    unique: true
  },
  planName: {
    type: String,
    required: true
  },
  insurer: {
    type: String,
    required: true
  },
  claimSettlementRatio: {
    type: String, // Claim Settlement Ratio as a string to include percentage format
    required: true
  },
  lifeCover: {
    type: String, // Life cover can be stored as a string (e.g., "1 Crore")
    required: true
  },
  insuranceTerm: {
    type: String, // Insurance term stored as string (e.g., "30 years")
    required: true
  },
  premiumAmount: {
    type: String, // Premium amount stored as string (e.g., "₹600/month")
    required: true
  },
  keyFeatures: {
    type: [String], // Array of strings for key features
    required: true
  },
  logoUrl: {
    type: String, // URL to the insurance company logo image
    required: false // Optional, unless you want to make it mandatory
  }
});

const LifeInsurancePlan = mongoose.model('LifeInsurancePlan', lifeInsurancePlanSchema);

module.exports = LifeInsurancePlan;
