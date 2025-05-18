const investmentPolicy = require('../models/investmentPolicySchema');
const InvestmentPolicyData = require('../DataModels/InvestmentPolicySchema');

// Helper to check for existing policy
const findExistingPolicy = async (name, mobile, pincode, district) => {
  return await investmentPolicy.findOne({ name, mobile, pincode, district });
};

// 1. Create user-submitted investment policy
// 1. Create or update user-submitted investment policy
exports.createInvestmentPolicyData = async (req, res) => {
  try {
    const { name, mobile, pincode, district } = req.body;

    if (!name || !mobile || !pincode || !district) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const existingPolicy = await findExistingPolicy(name, mobile, pincode, district);

    if (existingPolicy) {
      // Update existing policy
      existingPolicy.name = name;
      existingPolicy.mobile = mobile;
      existingPolicy.pincode = pincode;
      existingPolicy.district = district;

      const updatedPolicy = await existingPolicy.save();
      return res.status(200).json({
        message: 'Policy updated successfully',
        policy: updatedPolicy,
      });
    } else {
      // Create new policy
      const newPolicy = new investmentPolicy({ name, mobile, pincode, district });
      const savedPolicy = await newPolicy.save();

      return res.status(201).json({
        message: 'Policy created successfully',
        policy: savedPolicy,
      });
    }
  } catch (error) {
    console.error('Error creating or updating policy:', error);
    res.status(400).json({ message: 'Failed to create or update policy', error: error.message });
  }
};


// 2. Get available investment plans (templates)
exports.getInvestmentPlans = async (req, res) => {
  try {
    const plans = await InvestmentPolicyData.find();
    res.status(200).json({
      success: true,
      data: plans,
    });
  } catch (error) {
    console.error("Error fetching plans:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch investment plans",
      error: error.message,
    });
  }
};

// 3. Add a new investment plan (admin use only)
exports.createInvestmentPlanTemplate = async (req, res) => {
  try {
    const policy = req.body;
    const policyCreated = await InvestmentPolicyData.create(policy);
    res.status(201).json({
      success: true,
      data: policyCreated,
    });
  } catch (error) {
    console.error("Error creating investment plan:", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to create investment plan",
      error: error.message,
    });
  }
};

// 4. Select a plan for the user
exports.selectPlan = async (req, res) => {
  try {
    const { name, mobile, pincode, district, planId } = req.body;

    if (!planId) {
      return res.status(400).json({ message: 'Plan ID is required' });
    }

    const selectedPlan = await InvestmentPolicyData.findById(planId);
    if (!selectedPlan) {
      return res.status(404).json({ message: 'Invalid Plan ID selected' });
    }

    const existingPolicy = await findExistingPolicy(name, mobile, pincode, district);

    if (existingPolicy) {
      // Update existing
      Object.assign(existingPolicy, {
        company: selectedPlan.company,
        planName: selectedPlan.planName,
        premium: selectedPlan.premium,
        returnAmount: selectedPlan.returnAmount,
        returnPercentage: selectedPlan.returnPercentage,
        otherBenefits: selectedPlan.otherBenefits,
      });

      const updatedPolicy = await existingPolicy.save();
      return res.status(200).json({
        message: 'Existing policy updated with selected plan',
        policy: updatedPolicy,
      });
    } else {
      // Create new
      const newPolicy = new investmentPolicy({
        name,
        mobile,
        pincode,
        district,
        company: selectedPlan.company,
        planName: selectedPlan.planName,
        premium: selectedPlan.premium,
        returnAmount: selectedPlan.returnAmount,
        returnPercentage: selectedPlan.returnPercentage,
        otherBenefits: selectedPlan.otherBenefits,
      });

      const savedPolicy = await newPolicy.save();
      return res.status(201).json({
        message: 'New policy created successfully with selected plan',
        policy: savedPolicy,
      });
    }
  } catch (error) {
    console.error('Error selecting plan:', error);
    res.status(500).json({
      message: 'Failed to select plan',
      error: error.message,
    });
  }
};

// 5. Get policy details by mobile number
exports.getInvestmentPolicyDetailsByMobile = async (req, res) => {
  try {
    const { mobile } = req.params;
    if (!mobile) {
      return res.status(400).json({ message: "Mobile number is required." });
    }

    const policy = await investmentPolicy.findOne({ mobile });
    if (!policy) {
      return res.status(404).json({ message: "Policy not found for this mobile number." });
    }

    res.status(200).json({ success: true, data: policy });
  } catch (error) {
    console.error('Error fetching policy:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};


exports.getInvestmentPremiumByMobile = async (req, res) => {
  try {
    const { mobile } = req.params;
    if (!mobile) {
      return res.status(400).json({ message: "Mobile number is required." });
    }

    const policy = await investmentPolicy.findOne({ mobile }, 'premium');
    if (!policy) {
      return res.status(404).json({ message: "Policy not found for this mobile number." });
    }

    res.status(200).json({ success: true, premium: policy.premium });
  } catch (error) {
    console.error('Error fetching premium:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};
