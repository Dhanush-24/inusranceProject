const TermPolicy = require("../models/TermPolicySchema");
const TermPolicyData=require("../DataModels/TermPolicySchema")
// Create a new term policy
// Create a new term policy
exports.createTermPolicy = async (req, res) => {
  try {
    const { name, mobile, pincode, district } = req.body;

    const newPolicy = new TermPolicy({
      name,
      mobile,
      pincode,
      district,
    });

    const savedPolicy = await newPolicy.save();

    res.status(201).json({
      message: 'Policy created successfully',
      policy: savedPolicy,
    });
  } catch (error) {
    console.error('Error creating policy:', error);
    res.status(500).json({ message: 'Failed to create policy', error: error.message });
  }
};


// Get all available term plans
exports.getTermInsurancePlans = async (req, res) => {
  try {
    const TermPoliciesData = await TermPolicyData.find();
    res.status(200).json({
      success: true,
      data: TermPoliciesData,
    });
  } catch (error) {
    console.error("Error fetching plans:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get car insurance plans",
      error: error.message,
    });
  }
};

exports.createTermPolicySchema = async (req, res, next) => {
  const policy = req.body;
  try {
    const policyCreated = await TermPolicyData.create(policy);
    res.status(201).json({
      success: true,
      data: policyCreated,
    });
  } catch (error) {
    console.error("Error creating car policy:", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to create car policy",
      error: error.message,
    });
  }
};

// Select a plan and associate it with a user
exports.selectPlan = async (req, res) => {
  try {
    const { name, mobile, planId } = req.body;

    if (!name || !mobile || !planId) {
      return res.status(400).json({ message: 'Name, mobile, and Plan ID are required' });
    }

    const plans = await TermPolicyData.find();
    const selectedPlan = plans.find(plan => plan.PlanId === Number(planId));

    if (!selectedPlan) {
      return res.status(404).json({ message: 'Invalid Plan ID selected' });
    }

    const existingPolicy = await TermPolicy.findOne({ name, mobile });

    if (existingPolicy) {
      existingPolicy.planName = selectedPlan.planName;
      existingPolicy.insurer = selectedPlan.insurer;
      existingPolicy.claimSettlementRatio = selectedPlan.claimSettlementRatio;
      existingPolicy.lifeCover = selectedPlan.lifeCover;
      existingPolicy.insuranceTerm = selectedPlan.insuranceTerm;
      existingPolicy.premiumAmount = selectedPlan.premiumAmount;
      existingPolicy.keyFeatures = selectedPlan.keyFeatures;

      const updatedPolicy = await existingPolicy.save();

      return res.status(200).json({
        message: 'Existing policy updated with selected plan',
        policy: updatedPolicy,
      });
    } else {
      const newPolicy = new TermPolicy({
        name,
        mobile,
        planName: selectedPlan.planName,
        insurer: selectedPlan.insurer,
        claimSettlementRatio: selectedPlan.claimSettlementRatio,
        lifeCover: selectedPlan.lifeCover,
        insuranceTerm: selectedPlan.insuranceTerm,
        premiumAmount: selectedPlan.premiumAmount,
        keyFeatures: selectedPlan.keyFeatures,
      });

      const savedPolicy = await newPolicy.save();

      return res.status(201).json({
        message: 'New policy created successfully with selected plan',
        policy: savedPolicy,
      });
    }
  } catch (error) {
    console.error('Error selecting plan:', error);
    res.status(500).json({ message: 'Failed to select plan', error: error.message });
  }
};


// Get term insurance policy details by mobile
exports.getTermPolicyDetailsByMobile = async (req, res) => {
  try {
    const { mobile } = req.params;  // Extract the mobile number from URL params

    if (!mobile) {
      return res.status(400).json({ message: "Mobile number is required." });
    }

    // Log the mobile number to verify it's being received
    console.log("Requested Mobile Number:", mobile);

    // Fetch the term policy using the mobile number
    const policy = await TermPolicy.findOne({ mobile });

    if (!policy) {
      return res.status(404).json({ message: "Term policy not found for this mobile number." });
    }

    res.status(200).json({ success: true, data: policy });

  } catch (error) {
    console.error('Error fetching term policy:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};


exports.getTermPremiumByMobile = async (req, res) => {
  try {
    const { mobile } = req.params;

    if (!mobile) {
      return res.status(400).json({ message: "Mobile number is required." });
    }

    // Fetch only the premiumAmount field from the policy
    const policy = await TermPolicy.findOne({ mobile }, 'premiumAmount');

    if (!policy) {
      return res.status(404).json({ message: "Term policy not found for this mobile number." });
    }

    res.status(200).json({ success: true, premium: policy.premiumAmount });
  } catch (error) {
    console.error('Error fetching premium amount:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};
