const mongoose = require('mongoose');

const bikePolicySchemaData = new mongoose.Schema({
  planId: {
    type: Number,
    required: true,
    unique: true
  },
  planName: {
    type: String,
    required: true
  },
  planType: {
    type: String,
    required: true
  },
  coverage: {
    type: String,
    required: true
  },
  annualPremium: {
    type: Number,
    required: true
  },
  provider: {
    type: String,
    required: true
  },
  eligibility: {
    type: String,
    required: true
  },
  logoUrl: {
    type: String,
    required: false // Optional field for the insurer's logo
  }
});

module.exports = mongoose.model('BikePolicyData', bikePolicySchemaData);
