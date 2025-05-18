const mongoose = require('mongoose');

const GaurentedPlanSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  mobile: {
    type: String,
    required: true,
  },
  Company: {
    type: String,
    required: false,   
  },
  PlanName: {
    type: String,
    required: false,   
  },
  PremiumPerYear: {
    type: String,
    required: false,  
  },
  PolicyTerm: {
    type: String,
    required: false,   
  },
  PremiumPaymentTerm: {
    type: String,
    required: false,   
  },
  MaturityBenefit: {
    type: String,
    required: false,   
  },
  LifeCover: {
    type: String,
    required: false,   
  },
  Features: {
    type: [String],
    required: false, 
  },
}, { timestamps: true });

module.exports = mongoose.model('GaurentedPolicy', GaurentedPlanSchema);
