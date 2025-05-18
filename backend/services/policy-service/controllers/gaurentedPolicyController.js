const GaurentedPolicy = require('../models/GaurantedPlanSchema');
const GaurenteedPolicyData = require('../DataModels/GaurenteedPolicySchema');

// Helper function to find existing policy by name and mobile
const findExistingPolicy = async (name, mobile) => {
  return await GaurentedPolicy.findOne({ name, mobile });
};

// ✅ Create user entry with name and mobile only
exports.createGaurentedPolicyDetails = async (req, res) => {
  try {
    const { name, mobile } = req.body;

    if (!name || !mobile) {
      return res.status(400).json({ message: 'Name and Mobile are required' });
    }

    // Check if policy exists
    const existingPolicy = await findExistingPolicy(name, mobile);

    if (existingPolicy) {
      // Update existing policy's name (if needed)
      existingPolicy.name = name; // This is optional since the name is used for lookup
      const updatedPolicy = await existingPolicy.save();

      return res.status(200).json({
        message: 'Policy already existed and has been updated',
        policy: updatedPolicy,
      });
    }

    // Create new policy
    const newPolicy = new GaurentedPolicy({ name, mobile });
    const savedPolicy = await newPolicy.save();

    res.status(201).json({
      message: 'Policy created successfully',
      policy: savedPolicy,
    });
  } catch (error) {
    console.error('Error creating or updating policy:', error);
    res.status(500).json({ message: 'Failed to create or update policy', error: error.message });
  }
};

// ✅ Get all guaranteed plans from MongoDB
exports.getGaurentedPlans = async (req, res) => {
  try {
    const plans = await GaurenteedPolicyData.find();
    res.status(200).json({ plans });
  } catch (error) {
    console.error('Error fetching plans:', error);
    res.status(500).json({ message: 'Failed to get plans', error: error.message });
  }
};

// ✅ Store a new plan into the plans collection
exports.createGaurentedPolicy = async (req, res) => {
  const policy = req.body;
  try {
    const policyCreated = await GaurenteedPolicyData.create(policy);
    res.status(201).json({
      success: true,
      data: policyCreated,
    });
  } catch (error) {
    console.error("Error creating guaranteed plan:", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to create guaranteed plan",
      error: error.message,
    });
  }
};

exports.selectPlan = async (req, res) => {
  try {
    const { name, mobile, planId } = req.body;

    if (!name || !mobile || !planId) {
      return res.status(400).json({ message: 'Name, Mobile, and Plan ID are required' });
    }

    const selectedPlan = await GaurenteedPolicyData.findOne({ planId: planId });

    if (!selectedPlan) {
      return res.status(404).json({ message: 'Invalid Plan ID selected' });
    }

    const existingPolicy = await findExistingPolicy(name, mobile);

    if (existingPolicy) {
      // Update existing policy with selected plan details
      Object.assign(existingPolicy, {
        Company: selectedPlan.Company,
        PlanName: selectedPlan.PlanName,
        PremiumPerYear: selectedPlan.PremiumPerYear,
        PolicyTerm: selectedPlan.PolicyTerm,
        PremiumPaymentTerm: selectedPlan.PremiumPaymentTerm,
        MaturityBenefit: selectedPlan.MaturityBenefit,
        LifeCover: selectedPlan.LifeCover,
        Features: selectedPlan.Features,
        logoUrl: selectedPlan.logoUrl,
      });

      const updatedPolicy = await existingPolicy.save();

      return res.status(200).json({
        message: 'Existing policy updated with selected plan',
        policy: updatedPolicy,
      });
    } else {
      // Create new policy with plan details
      const newPolicy = new GaurentedPolicy({
        name,
        mobile,
        Company: selectedPlan.Company,
        PlanName: selectedPlan.PlanName,
        PremiumPerYear: selectedPlan.PremiumPerYear,
        PolicyTerm: selectedPlan.PolicyTerm,
        PremiumPaymentTerm: selectedPlan.PremiumPaymentTerm,
        MaturityBenefit: selectedPlan.MaturityBenefit,
        LifeCover: selectedPlan.LifeCover,
        Features: selectedPlan.Features,
        logoUrl: selectedPlan.logoUrl,
      });

      const savedPolicy = await newPolicy.save();

      return res.status(201).json({
        message: 'New policy created successfully with selected plan',
        policy: savedPolicy,
      });
    }
  } catch (error) {
    console.error('Error selecting plan and creating/updating policy:', error);
    res.status(500).json({ message: 'Failed to select plan and create/update policy', error: error.message });
  }
};


// controllers/gaurentedPolicyController.js


exports.getGaurentedPolicyDetailsByMobile = async (req, res) => {
  try {
    const { mobile } = req.params;  // Extract mobile number from request parameters

    if (!mobile) {
      return res.status(400).json({ message: "Mobile number is required." });
    }

    const policy = await GaurentedPolicy.findOne({ mobile: mobile });  // Find policy by mobile

    console.log("Mobile:", req.params.mobile);  // Log the mobile number for debugging

    if (!policy) {
      return res.status(404).json({ message: "Guaranteed policy not found for this mobile number." });
    }

    res.status(200).json({ success: true, data: policy });  // Return the policy details if found
  } catch (error) {
    console.error('Error fetching guaranteed policy:', error);
    res.status(500).json({ success: false, message: error.message });  // Handle any errors
  }
};

exports.getGuaranteedPremiumByMobile = async (req, res) => {
  try {
    const { mobile } = req.params;

    if (!mobile) {
      return res.status(400).json({ message: "Mobile number is required." });
    }

    // Only fetch the PremiumPerYear field
    const policy = await GaurentedPolicy.findOne({ mobile }, 'PremiumPerYear');
    if (!policy) {
      return res.status(404).json({ message: "Policy not found for this mobile number." });
    }

    res.status(200).json({ success: true, premium: policy.PremiumPerYear });
  } catch (error) {
    console.error('Error fetching premium amount:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

