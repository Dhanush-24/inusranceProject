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
