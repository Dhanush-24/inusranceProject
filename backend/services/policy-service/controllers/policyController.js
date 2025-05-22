const Policy = require("../models/policySchema");
const CarPolicy = require("../../policy-service/DataModels/CarPolicy");

// Save Car Number
exports.saveCarNumber = async (req, res) => {
  try {
    const { carNumber } = req.body;
    if (!carNumber) {
      return res.status(400).json({ message: "Car number is required." });
    }

    const carNumberRegex = /^[A-Z]{2}-\d{2}-[A-Z]{2}-\d{4}$/;
    if (!carNumberRegex.test(carNumber)) {
      return res.status(400).json({
        message: 'Invalid car number format. Example: "MH-12-AB-1234"',
      });
    }

    const existingPolicy = await Policy.findOne({ carNumber });
    if (existingPolicy) {
      return res.status(200).json({ message: "Car number already exists.", data: existingPolicy });
    }

    const newPolicy = new Policy({ carNumber });
    await newPolicy.save();

    res.status(201).json({
      success: true,
      message: "Car number saved successfully.",
      data: newPolicy,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Save Car Details in Steps
exports.saveCarBrand = async (req, res) => updatePolicyField(req, res, "carBrand");
exports.saveCarModel = async (req, res) => updatePolicyField(req, res, "carModel");
exports.saveFuelType = async (req, res) => updatePolicyField(req, res, "fuelType");
exports.saveVariant = async (req, res) => updatePolicyField(req, res, "variant");
exports.saveRegistrationYear = async (req, res) => updatePolicyField(req, res, "registrationYear");
exports.saveRegistrationCity = async (req, res) => updatePolicyField(req, res, "registrationCity");

async function updatePolicyField(req, res, field) {
  try {
    const { carNumber } = req.body;
    const value = req.body[field];
    if (!carNumber || !value) {
      return res.status(400).json({ message: `Car number and ${field} are required.` });
    }

    const policy = await Policy.findOneAndUpdate({ carNumber }, { [field]: value }, { new: true });
    if (!policy) return res.status(404).json({ message: "Policy not found." });

    res.status(200).json({ success: true, message: `${field} updated.`, data: policy });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

// Save All Car Details at Once
exports.saveCarDetails = async (req, res) => {
  try {
    const {
      carNumber,
      carBrand,
      carModel,
      fuelType,
      variant,
      registrationYear,
      registrationCity
    } = req.body;

    const newPolicy = new Policy({
      carNumber,
      carBrand,
      carModel,
      fuelType,
      variant,
      registrationYear,
      registrationCity
    });

    await newPolicy.save();

    res.status(200).json({ message: "Car details saved successfully." });
  } catch (error) {
    res.status(500).json({ message: "Failed to save car details." });
  }
};

// Save User Info
exports.saveUserInfo = async (req, res) => {
  try {
    const { carNumber, fullName, mobileNumber } = req.body;

    if (!carNumber || !fullName || !mobileNumber) {
      return res.status(400).json({
        message: "Car number, full name, and mobile number are required.",
      });
    }

    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(mobileNumber)) {
      return res.status(400).json({ message: "Invalid mobile number format." });
    }

    const policy = await Policy.findOneAndUpdate(
      { carNumber },
      { userInfo: { fullName, mobileNumber } },
      { new: true }
    );

    if (!policy) {
      return res.status(404).json({ message: "Policy not found." });
    }

    res.status(200).json({
      success: true,
      message: "User information updated.",
      data: policy,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Save Previous Policy Details
exports.savePreviousPolicy = async (req, res) => {
  try {
    const { carNumber, policyStartDate, policyEndDate, isCommercial } = req.body;

    if (!carNumber || !policyStartDate || !policyEndDate || typeof isCommercial !== "boolean") {
      return res.status(400).json({ message: "All previous policy details are required." });
    }

    const policy = await Policy.findOneAndUpdate(
      { carNumber },
      { previousPolicy: { policyStartDate, policyEndDate, isCommercial } },
      { new: true }
    );

    if (!policy) {
      return res.status(404).json({ message: "Policy not found." });
    }

    res.status(200).json({
      success: true,
      message: "Previous policy details updated.",
      data: policy,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Check Car Number Exists
exports.checkCarNumberExists = async (req, res) => {
  try {
    const { carNumber } = req.query;
    if (!carNumber) return res.status(400).json({ message: "Car number is required." });

    const exists = await Policy.findOne({ carNumber });
    res.status(200).json({ exists: !!exists });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Policy by Mobile Number
exports.getPolicyDetailsByMobile = async (req, res) => {
  try {
    const { mobileNumber } = req.params;
    if (!mobileNumber) return res.status(400).json({ message: "Mobile number is required." });

    const policy = await Policy.findOne({ "userInfo.mobileNumber": mobileNumber });
    if (!policy) return res.status(404).json({ message: "Policy not found." });

    res.status(200).json({ success: true, data: policy });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get Premium by Mobile Number
exports.getPremiumByMobile = async (req, res) => {
  try {
    const { mobileNumber } = req.params;
    if (!mobileNumber) return res.status(400).json({ message: "Mobile number is required." });

    const policy = await Policy.findOne(
      { "userInfo.mobileNumber": mobileNumber },
      { premiumAmount: 1, _id: 0 }
    );

    if (!policy) return res.status(404).json({ message: "Policy not found." });

    res.status(200).json({ success: true, premiumAmount: policy.premiumAmount });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get All Car Insurance Plans
exports.getCarInsurancePlans = async (req, res) => {
  try {
    const plans = await CarPolicy.find();
    res.status(200).json({ success: true, data: plans });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to get car insurance plans",
      error: error.message,
    });
  }
};

// Create Car Insurance Plan (Admin)
exports.createCarPolicy = async (req, res) => {
  try {
    const newPlan = await CarPolicy.create(req.body);
    res.status(201).json({ success: true, data: newPlan });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create car policy",
      error: error.message,
    });
  }
};

// Select Insurance Plan
exports.selectPlan = async (req, res) => {
  try {
    const { carNumber, planId } = req.body;
    if (!carNumber || !planId) {
      return res.status(400).json({ message: "Car number and plan ID are required." });
    }

    const selectedPlan = await CarPolicy.findOne({ planId });
    if (!selectedPlan) return res.status(404).json({ message: "Plan not found." });

    const policy = await Policy.findOne({ carNumber });
    if (!policy) {
      return res.status(400).json({ message: "Policy not found for this car number." });
    }

    Object.assign(policy, {
      insurerName: selectedPlan.insurerName,
      policyName: selectedPlan.planName,
      idvValue: selectedPlan.idvValue,
      premiumAmount: selectedPlan.premiumAmount,
      claimSettlementRatio: selectedPlan.claimSettlementRatio,
      cashlessGarages: selectedPlan.cashlessGarages,
      specialBenefits: selectedPlan.specialBenefits,
    });

    const updatedPolicy = await policy.save();
    res.status(200).json({ message: "Policy updated with selected plan", policy: updatedPolicy });
  } catch (error) {
    res.status(500).json({
      message: "Failed to select plan and update policy",
      error: error.message,
    });
  }
};


// Helper functions
const priceList = {
  Toyota: { Corolla: 1200000, Camry: 2200000, Prius: 2500000, RAV4: 2800000, Fortuner: 3200000 },
  Honda: { Civic: 1500000, Accord: 2400000, "CR-V": 2600000, City: 1300000, Jazz: 1100000 },
  Ford: { Figo: 700000, EcoSport: 900000, Mustang: 6000000, Endeavour: 3500000, Aspire: 800000 },
  Hyundai: { i10: 600000, i20: 950000, Creta: 1500000, Verna: 1200000, Elantra: 1800000 },
  Chevrolet: { Spark: 500000, Beat: 550000, Cruze: 1100000, Captiva: 2000000, Trailblazer: 2700000 },
  Nissan: { Micra: 550000, Altima: 1700000, Sentra: 1400000, Juke: 1300000, Rogue: 2500000 },
  Volkswagen: { Polo: 850000, Vento: 1100000, Passat: 2100000, Tiguan: 2200000, Golf: 2300000 },
  BMW: { "3 Series": 4000000, "5 Series": 6000000, X1: 4200000, X3: 4800000, X5: 7500000 },
  "Mercedes-Benz": { "A-Class": 3500000, "C-Class": 5000000, "E-Class": 7000000, GLA: 3800000, GLE: 8000000 },
  Audi: { A3: 3000000, A4: 4500000, Q3: 4000000, Q5: 5500000, Q7: 7500000 },
  Kia: { Seltos: 1400000, Sonet: 900000, Carnival: 2200000, Sportage: 2100000, Rio: 1000000 },
  Mazda: { Mazda3: 1300000, "CX-3": 1500000, "CX-5": 2000000, Mazda6: 2300000, "MX-5": 2500000 },
};

const getManufacturerPrice = (brand, model) => {
  const brandData = priceList[brand];
  if (!brandData) return 600000; // fallback
  const price = brandData[model];
  return price || 600000; // fallback
};

const getDepreciationRate = (age) => {
  if (age < 1) return 0.15;
  if (age < 2) return 0.20;
  if (age < 3) return 0.30;
  if (age < 4) return 0.40;
  return 0.50;
};


exports.getPlansNearIDV = async (req, res) => {
  try {
    const { carBrand, carModel, registrationYear } = req.query;

    if (!carBrand || !carModel || !registrationYear) {
      return res.status(400).json({
        success: false,
        message: "Missing carBrand, carModel, or registrationYear.",
      });
    }

    const currentYear = new Date().getFullYear();
    const carAge = currentYear - parseInt(registrationYear, 10);
    const depreciation = getDepreciationRate(carAge);
    const basePrice = getManufacturerPrice(carBrand, carModel);
    const calculatedIDV = Math.round(basePrice * (1 - depreciation));

    // Define a range ±100000 around calculatedIDV
    const lowerBound = calculatedIDV - 100000;
    const upperBound = calculatedIDV + 100000;

    // Query plans with idvValue within this range
    const plans = await CarPolicy.find({
      idvValue: { $gt: lowerBound, $lt: upperBound },
    });

    res.status(200).json({
      success: true,
      calculatedIDV,
      plans,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch plans near IDV value",
      error: error.message,
    });
  }
};
