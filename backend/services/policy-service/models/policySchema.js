const mongoose = require('mongoose');

// Define the schema for the Policy
const policySchema = new mongoose.Schema(
  {
    carNumber: {
      type: String,
      required: true,
      trim: true,
      validate: {
        validator: function(value) {
          // Regex pattern for a valid car number (e.g., "AB 1234" or "XX 1234")
          return /^[A-Z]{2}-\d{2}-[A-Z]{2}-\d{4}$/.test(value);;
        },
        message: 'Invalid car number format. Example format: "XX 1234"',
      },
    },
    carBrand: {
      type: String, 
    },
    carModel: {
      type: String, 
    },
    fuelType: {
      type: String,
      enum: ['Petrol', 'Diesel', 'Electric', 'CNG'], // all lowercase
    },
    variant: {
      type: String, 
    },
    registrationYear: {
      type: Date
    },
    registrationCity: {
      type: String, 
    },
    userInfo: {
      fullName: {
        type: String,
      },
      mobileNumber: {
        type: String,
        validate: {
          validator: function(value) {
            // Mobile number should have exactly 10 digits
            return /^\d{10}$/.test(value);
          },
          message: 'Mobile number must have exactly 10 digits.',
        },
      },
    },
    previousPolicy: {
      policyStartDate: {
        type: Date, 
      },
      policyEndDate: {
        type: Date, 
      },
      isCommercial: {
        type: Boolean, 
      },
    },
    // New fields for insurance plan details
    insurerName: {
      type: String,  // Name of the insurance company
    },
    policyName: {
      type: String,  // Name of the insurance policy
    },
    idvValue: {
      type: Number,  // Insured Declared Value
    },
    premiumAmount: {
      type: Number,  // Premium amount for the policy
    },
    claimSettlementRatio: {
      type: String,  // Claim settlement ratio (in percentage)
    },
    cashlessGarages: {
      type: [String],  // List of cashless garages
    },
    specialBenefits: {
      type: [String],  // List of special benefits included in the policy
    },
  },
  { 
    timestamps: true,
    collection: 'carPolicies',  // Specify the collection name
  }
);

// Create a Model for the Policy schema
const Policy = mongoose.model('Policy', policySchema);

module.exports = Policy;
