const HealthPolicy = require('../models/HealthPolicy');
const HealthPolicyData=require('../DataModels/HealthPolicySchema')

// Create Health Policy
exports.createHealthPolicy = async (req, res) => {
  try {
    const { name, mobile, insureFor, pincode, district, healthIssues } = req.body;

    // Check if a policy with same user details already exists
    const existingPolicy = await HealthPolicy.findOne({
      name,
      mobile,
      insureFor,
      pincode,
      district,
      healthIssues: { $all: healthIssues } // Match all health issues
    });

    if (existingPolicy) {
      return res.status(400).json({
        message: 'Policy with given details already exists',
        policy: existingPolicy, // Optional: you can show existing policy data
      });
    }

    // No existing policy ➔ Create new
    const newPolicy = new HealthPolicy({
      name,
      mobile,
      insureFor,
      pincode,
      district,
      healthIssues,
    });

    const savedPolicy = await newPolicy.save();

    res.status(201).json({
      message: 'Policy created successfully',
      policy: savedPolicy,
    });
  } catch (error) {
    console.error('Error creating policy:', error);
    res.status(400).json({ message: 'Failed to create policy', error: error.message });
  }
};


// Get all Health Plans
// Get all Health Plans
exports.getHealthInsurancePlans = async (req, res) => {
  try {
    const healthPoliciesData = await HealthPolicyData.find(); // ✅ corrected name
    res.status(200).json({
      success: true,
      data: healthPoliciesData, // ✅ corrected reference
    });
  } catch (error) {
    console.error("Error fetching plans:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get health insurance plans", // ✅ also corrected the message
      error: error.message,
    });
  }
};


exports.createHealthPolicySchema = async (req, res, next) => {
  const policy = req.body;
  try {
    const policyCreated = await HealthPolicyData.create(policy);
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




exports.selectPlan = async (req, res) => {
  try {
    const { name, mobile, insureFor, pincode, district, healthIssues, planId } = req.body;

    if (!planId) {
      return res.status(400).json({ message: 'Plan ID is required' });
    }

    // Fetch plans from DB
    const allPlans = await HealthPolicyData.find();
    const selectedPlan = allPlans.find(plan => plan.planId === planId);

    if (!selectedPlan) {
      return res.status(404).json({ message: 'Invalid Plan ID selected' });
    }

    const existingPolicy = await HealthPolicy.findOne({
      name,
      mobile,
      insureFor,
      pincode,
      district,
      healthIssues: { $all: healthIssues }
    });

    if (existingPolicy) {
      existingPolicy.company = selectedPlan.company;
      existingPolicy.plan = selectedPlan.plan;
      existingPolicy.sumInsured = selectedPlan.sumInsured;
      existingPolicy.premiumAmount = selectedPlan.premiumAmount;
      existingPolicy.features = selectedPlan.features;

      const updatedPolicy = await existingPolicy.save();

      return res.status(200).json({
        message: 'Existing policy updated with selected plan',
        policy: updatedPolicy,
      });
    } else {
      const newPolicy = new HealthPolicy({
        name,
        mobile,
        insureFor,
        pincode,
        district,
        healthIssues,
        company: selectedPlan.company,
        plan: selectedPlan.plan,
        sumInsured: selectedPlan.sumInsured,
        premiumAmount: selectedPlan.premiumAmount,
        features: selectedPlan.features,
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


exports.getHealthPolicyDetailsByMobile = async (req, res) => {
  try {
    const { mobile } = req.params;  // Ensure this is correct

    if (!mobile) {
      return res.status(400).json({ message: "Mobile number is required." });
    }

    const policy = await HealthPolicy.findOne({ mobile: mobile });
    console.log("Mobile:", req.params.mobile);


    if (!policy) {
      return res.status(404).json({ message: "Health policy not found for this mobile number." });
    }

    res.status(200).json({ success: true, data: policy });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


exports.getHealthPremiumByMobile = async (req, res) => {
  try {
    const { mobile } = req.params;

    if (!mobile) {
      return res.status(400).json({ message: "Mobile number is required." });
    }

    const policy = await HealthPolicy.findOne(
      { mobile: mobile },
      { premiumAmount: 1, _id: 0 }
    );

    if (!policy || !policy.premiumAmount) {
      return res.status(404).json({ message: "Premium not found for this mobile number." });
    }

    res.status(200).json({
      success: true,
      premiumAmount: policy.premiumAmount
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
