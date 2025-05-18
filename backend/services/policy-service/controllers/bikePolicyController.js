const BikePolicy = require('../models/bikePolicy');
const BikePolicyData = require('../DataModels/BikePolicySchema');

// Create or update helper
const updatePolicy = async (bikeNumber, update) => {
  return await BikePolicy.findOneAndUpdate(
    { bikeNumber },
    { $set: update },
    { new: true, upsert: true }
  );
};

// Save individual fields
exports.saveBikeNumber = async (req, res) => {
  try {
    const { bikeNumber } = req.body;
    if (!bikeNumber) return res.status(400).json({ message: "Bike number is required" });

    const policy = await updatePolicy(bikeNumber, { bikeNumber });
    res.status(200).json({ message: "Bike number saved", policy });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error });
  }
};

exports.saveBikeBrand = async (req, res) => {
  try {
    const { bikeNumber, bikeBrand } = req.body;
    const policy = await updatePolicy(bikeNumber, { bikeBrand });
    res.status(200).json({ message: "Bike brand saved", policy });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error });
  }
};

exports.saveBikeModel = async (req, res) => {
  try {
    const { bikeNumber, bikeModel } = req.body;
    const policy = await updatePolicy(bikeNumber, { bikeModel });
    res.status(200).json({ message: "Bike model saved", policy });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error });
  }
};

exports.saveFuelType = async (req, res) => {
  try {
    const { bikeNumber, fuelType } = req.body;
    const policy = await updatePolicy(bikeNumber, { fuelType });
    res.status(200).json({ message: "Fuel type saved", policy });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error });
  }
};

exports.saveVariant = async (req, res) => {
  try {
    const { bikeNumber, variant } = req.body;
    const policy = await updatePolicy(bikeNumber, { variant });
    res.status(200).json({ message: "Variant saved", policy });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error });
  }
};

exports.saveRegistrationYear = async (req, res) => {
  try {
    const { bikeNumber, registrationYear } = req.body;
    const policy = await updatePolicy(bikeNumber, { registrationYear });
    res.status(200).json({ message: "Registration year saved", policy });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error });
  }
};

exports.saveRegistrationCity = async (req, res) => {
  try {
    const { bikeNumber, registrationCity } = req.body;
    const policy = await updatePolicy(bikeNumber, { registrationCity });
    res.status(200).json({ message: "Registration city saved", policy });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error });
  }
};

exports.saveUserInfo = async (req, res) => {
  try {
    const { bikeNumber, fullName, mobileNumber } = req.body;
    if (!fullName || !mobileNumber) {
      return res.status(400).json({ message: "Full name and mobile number are required" });
    }

    const policy = await updatePolicy(bikeNumber, {
      userInfo: { fullName, mobileNumber }
    });

    res.status(200).json({ message: "User info saved", policy });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error });
  }
};

exports.savePreviousPolicy = async (req, res) => {
  try {
    const { bikeNumber, policyStartDate, policyEndDate, isCommercial } = req.body;
    const policy = await updatePolicy(bikeNumber, {
      previousPolicy: { policyStartDate, policyEndDate, isCommercial }
    });

    res.status(200).json({ message: "Previous policy saved", policy });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error });
  }
};



exports.getBikePolicyDetailsByMobile = async (req, res) => {
  try {
    const { mobileNumber } = req.params;

    if (!mobileNumber) {
      return res.status(400).json({ message: "Mobile number is required." });
    }

    const policy = await BikePolicy.findOne({ "userInfo.mobileNumber": mobileNumber });

    if (!policy) {
      return res.status(404).json({ message: "Bike policy not found for this mobile number." });
    }

    res.status(200).json({ success: true, data: policy });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};




exports.getBikeInsurancePlans = async (req, res) => {
  try {
    const bikePoliciesData = await BikePolicyData.find();
    res.status(200).json({
      success: true,
      data: bikePoliciesData,
    });
  } catch (error) {
    console.error("Error fetching bike insurance plans:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get bike insurance plans",
      error: error.message,
    });
  }
};




exports.createBikePolicy = async (req, res, next) => {
  const policy = req.body;
  try {
    const policyCreated = await BikePolicyData.create(policy);
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
    const { bikeNumber, bikeBrand, bikeModel, registrationYear, registrationCity, userInfo, previousPolicy, planId } = req.body;

    if (!planId) {
      return res.status(400).json({ message: "Plan ID is required" });
    }

    // Fetch available bike policies (plans) from your database
    const plans = await BikePolicyData.find();

    const selectedPlan = plans.find(plan => plan.planId === parseInt(planId));
    if (!selectedPlan) {
      return res.status(404).json({ message: "Selected plan not found" });
    }

    let bikePolicy = await BikePolicy.findOne({ bikeNumber });

    if (!bikePolicy) {
      // Create a new policy if it doesn't exist
      bikePolicy = new BikePolicy({
        userInfo,
        previousPolicy,
        bikeNumber,
        bikeBrand,
        bikeModel,
        registrationYear,
        registrationCity,
        planDetails: {
          planId: selectedPlan.planId,
          planName: selectedPlan.planName,
          planType: selectedPlan.planType,
          coverage: selectedPlan.coverage,
          annualPremium: selectedPlan.annualPremium,
          provider: selectedPlan.provider,
          eligibility: selectedPlan.eligibility
        }
      });
    } else {
      // Update the existing policy with the selected plan details
      bikePolicy.planDetails = {
        planId: selectedPlan.planId,
        planName: selectedPlan.planName,
        planType: selectedPlan.planType,
        coverage: selectedPlan.coverage,
        annualPremium: selectedPlan.annualPremium,
        provider: selectedPlan.provider,
        eligibility: selectedPlan.eligibility
      };
    }

    await bikePolicy.save();

    res.status(200).json({
      success: true,
      message: "Plan selected and bike policy saved successfully",
      data: bikePolicy
    });

  } catch (error) {
    console.error("Error selecting plan:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message
    });
  }
};


exports.getBikePremiumByMobile = async (req, res) => {
  try {
    const { mobileNumber } = req.params;

    if (!mobileNumber) {
      return res.status(400).json({ message: "Mobile number is required." });
    }

    const policy = await BikePolicy.findOne(
      { "userInfo.mobileNumber": mobileNumber },
      { "planDetails.annualPremium": 1, _id: 0 }
    );

    if (!policy || !policy.planDetails) {
      return res.status(404).json({ message: "Premium not found for this mobile number." });
    }

    res.status(200).json({
      success: true,
      annualPremium: policy.planDetails.annualPremium
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.saveBikeDetails = async (req, res) => {
  try {
    const { bikeNumber, bikeBrand, bikeModel, registrationYear, registrationCity } = req.body;

    // Optional: Validate inputs here

    // Upsert or store in temporary collection
    let policy = await BikePolicy.findOneAndUpdate(
      { bikeNumber },
      {
        bikeNumber,
        bikeBrand,
        bikeModel,
        registrationYear,
        registrationCity,
      },
      { upsert: true, new: true }
    );

    res.status(200).json({ success: true, message: "Bike details saved", data: policy });
  } catch (error) {
    console.error("Error saving bike details:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
