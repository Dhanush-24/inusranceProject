const BikePolicy = require('../models/bikePolicy');
const BikePolicyData = require('../DataModels/BikePolicySchema');

// Helper: Normalize bike number
const normalizeBikeNumber = (number) => number?.toUpperCase().trim();

// Helper: Create or update policy
const updatePolicy = async (bikeNumber, update) => {
  return await BikePolicy.findOneAndUpdate(
    { bikeNumber },
    { $set: update },
    { new: true, upsert: true }
  );
};

// Save bike number
exports.saveBikeNumber = async (req, res) => {
  try {
    const bikeNumber = normalizeBikeNumber(req.body.bikeNumber);
    if (!bikeNumber) return res.status(400).json({ message: "Bike number is required" });

    const policy = await updatePolicy(bikeNumber, { bikeNumber });
    res.status(200).json({ message: "Bike number saved", policy });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: "Bike number already exists" });
    }
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};

exports.saveBikeBrand = async (req, res) => {
  try {
    const bikeNumber = normalizeBikeNumber(req.body.bikeNumber);
    const { bikeBrand } = req.body;
    const policy = await updatePolicy(bikeNumber, { bikeBrand });
    res.status(200).json({ message: "Bike brand saved", policy });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};

exports.saveBikeModel = async (req, res) => {
  try {
    const bikeNumber = normalizeBikeNumber(req.body.bikeNumber);
    const { bikeModel } = req.body;
    const policy = await updatePolicy(bikeNumber, { bikeModel });
    res.status(200).json({ message: "Bike model saved", policy });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};

exports.saveFuelType = async (req, res) => {
  try {
    const bikeNumber = normalizeBikeNumber(req.body.bikeNumber);
    const { fuelType } = req.body;
    const policy = await updatePolicy(bikeNumber, { fuelType });
    res.status(200).json({ message: "Fuel type saved", policy });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};

exports.saveVariant = async (req, res) => {
  try {
    const bikeNumber = normalizeBikeNumber(req.body.bikeNumber);
    const { variant } = req.body;
    const policy = await updatePolicy(bikeNumber, { variant });
    res.status(200).json({ message: "Variant saved", policy });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};

exports.saveRegistrationYear = async (req, res) => {
  try {
    const bikeNumber = normalizeBikeNumber(req.body.bikeNumber);
    const { registrationYear } = req.body;
    const policy = await updatePolicy(bikeNumber, { registrationYear });
    res.status(200).json({ message: "Registration year saved", policy });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};

exports.saveRegistrationCity = async (req, res) => {
  try {
    const bikeNumber = normalizeBikeNumber(req.body.bikeNumber);
    const { registrationCity } = req.body;
    const policy = await updatePolicy(bikeNumber, { registrationCity });
    res.status(200).json({ message: "Registration city saved", policy });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};

exports.saveUserInfo = async (req, res) => {
  try {
    const bikeNumber = normalizeBikeNumber(req.body.bikeNumber);
    const { fullName, mobileNumber } = req.body;
    if (!fullName || !mobileNumber) {
      return res.status(400).json({ message: "Full name and mobile number are required" });
    }

    const policy = await updatePolicy(bikeNumber, {
      userInfo: { fullName, mobileNumber }
    });

    res.status(200).json({ message: "User info saved", policy });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};

exports.savePreviousPolicy = async (req, res) => {
  try {
    const bikeNumber = normalizeBikeNumber(req.body.bikeNumber);
    const { policyStartDate, policyEndDate, isCommercial } = req.body;
    const policy = await updatePolicy(bikeNumber, {
      previousPolicy: { policyStartDate, policyEndDate, isCommercial }
    });

    res.status(200).json({ message: "Previous policy saved", policy });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};

exports.getBikePolicyDetailsByMobile = async (req, res) => {
  try {
    const { mobileNumber } = req.params;
    if (!mobileNumber) {
      return res.status(400).json({ message: "Mobile number is required." });
    }

    const policies = await BikePolicy.find({ "userInfo.mobileNumber": mobileNumber });

    if (!policies || policies.length === 0) {
      return res.status(404).json({ message: "Bike policies not found for this mobile number." });
    }

    res.status(200).json({ success: true, data: policies });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


exports.getBikeInsurancePlans = async (req, res) => {
  try {
    const plans = await BikePolicyData.find();
    res.status(200).json({ success: true, data: plans });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createBikePolicy = async (req, res) => {
  try {
    const policyCreated = await BikePolicyData.create(req.body);
    res.status(201).json({ success: true, data: policyCreated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.selectPlan = async (req, res) => {
  try {
    const bikeNumber = normalizeBikeNumber(req.body.bikeNumber);
    const { planId } = req.body;

    if (!planId || !bikeNumber) {
      return res.status(400).json({ message: "Both bikeNumber and planId are required" });
    }

    const selectedPlan = await BikePolicyData.findOne({ planId: parseInt(planId) });
    if (!selectedPlan) {
      return res.status(404).json({ message: "Selected plan not found" });
    }

    let bikePolicy = await BikePolicy.findOne({ bikeNumber });

    const planDetails = {
      planId: selectedPlan.planId,
      planName: selectedPlan.planName,
      planType: selectedPlan.planType,
      coverage: selectedPlan.coverage,
      annualPremium: selectedPlan.annualPremium,
      provider: selectedPlan.provider,
      eligibility: selectedPlan.eligibility
    };

    if (!bikePolicy) {
      bikePolicy = new BikePolicy({ bikeNumber, planDetails });
    } else {
      bikePolicy.planDetails = planDetails;
    }

    await bikePolicy.save();
    res.status(200).json({ success: true, message: "Plan selected", data: bikePolicy });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getBikePremiumByMobile = async (req, res) => {
  try {
    const { mobileNumber } = req.params;
    const policy = await BikePolicy.findOne(
      { "userInfo.mobileNumber": mobileNumber },
      { "planDetails.annualPremium": 1, _id: 0 }
    );

    if (!policy || !policy.planDetails) {
      return res.status(404).json({ message: "Premium not found for this mobile number." });
    }

    res.status(200).json({ success: true, annualPremium: policy.planDetails.annualPremium });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.saveBikeDetails = async (req, res) => {
  try {
    const bikeNumber = normalizeBikeNumber(req.body.bikeNumber);
    const { bikeBrand, bikeModel, registrationYear, registrationCity } = req.body;

    const policy = await updatePolicy(bikeNumber, {
      bikeNumber,
      bikeBrand,
      bikeModel,
      registrationYear,
      registrationCity
    });

    res.status(200).json({ success: true, message: "Bike details saved", data: policy });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Pricing logic
const bikePriceList = {
  Hero: { Splendor: 70000, Passion: 75000, Glamour: 80000, HFDeluxe: 65000 },
  Honda: { Activa: 80000, Shine: 85000, Unicorn: 95000, Dio: 75000 },
  Bajaj: { Pulsar: 100000, Platina: 60000, Avenger: 110000, CT100: 55000 },
  TVS: { Apache: 105000, Jupiter: 85000, Radeon: 70000, Sport: 60000 },
  Yamaha: { FZ: 110000, R15: 150000, Fascino: 90000, RayZR: 88000 },
  Suzuki: { Access: 85000, Gixxer: 115000, Burgman: 95000, Hayate: 70000 },
  RoyalEnfield: { Classic350: 180000, Bullet350: 170000, Meteor350: 190000 },
  KTM: { Duke200: 210000, Duke250: 230000, RC390: 310000 },
};

const getBikePrice = (brand, model) => {
  const brandData = bikePriceList[brand];
  return brandData ? brandData[model] || 50000 : 50000;
};

const getDepreciationRate = (age) => {
  if (age < 1) return 0.15;
  if (age < 2) return 0.20;
  if (age < 3) return 0.30;
  if (age < 4) return 0.40;
  return 0.50;
};

const estimatePremiumFromIDV = (idv) => Math.round(idv * 0.03);

exports.getBikePlansByPremium = async (req, res) => {
  try {
    const { bikeBrand, bikeModel, registrationYear } = req.query;

    if (!bikeBrand || !bikeModel || !registrationYear) {
      return res.status(400).json({ message: "All query params are required" });
    }

    const price = getBikePrice(bikeBrand, bikeModel);
    const bikeAge = new Date().getFullYear() - parseInt(registrationYear);
    const depreciation = getDepreciationRate(bikeAge);
    const idv = Math.round(price * (1 - depreciation));
    const estimatedPremium = estimatePremiumFromIDV(idv);

    const plans = await BikePolicyData.find({
      annualPremium: { $lte: estimatedPremium + 5000 },
    });

    res.status(200).json({
      success: true,
      estimatedIDV: idv,
      estimatedPremium,
      plans,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
