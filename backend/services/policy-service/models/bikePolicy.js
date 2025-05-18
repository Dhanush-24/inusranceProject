const mongoose = require('mongoose');

const BikePolicySchema = new mongoose.Schema({
  bikeNumber: {
    type: String,
    required: true,
    trim: true,
    validate: {
      validator: function(value) {
        return /^[A-Z]{2}-\d{2}-\d{4}$/.test(value);;
      },
      message: 'Invalid car number format. Example format: "XX 1234"',
    },
  },
  bikeBrand: String,
  bikeModel: String,
  fuelType: String,
  variant: String,
  registrationYear: String,
  registrationCity: String,
  userInfo: {
    fullName: { type: String, required: false },
    mobileNumber: { type: String, required: false }
  },
  previousPolicy: {
    policyStartDate: String,
    policyEndDate: String,
    isCommercial: Boolean
  },
  planDetails: {
    planId: { type: String, required: false },
    planName: String,
    planType: String,
    coverage: String,
    annualPremium: String,
    provider: String,
    eligibility: String
  }
});

module.exports = mongoose.model('BikePolicy', BikePolicySchema);
