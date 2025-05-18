const BikePolicy = require("../../policy-service/models/bikePolicy");
const CarPolicy = require("../../policy-service/models/policySchema");
const TermPolicy = require("../../policy-service/models/TermPolicySchema");
const HealthPolicy = require("../../policy-service/models/HealthPolicy");
const InvestmentPolicy = require("../../policy-service/models/investmentPolicySchema");
const GaurentedPolicy = require("../../policy-service/models/GaurantedPlanSchema");


exports.getAllUsersWithPolicies = async (req, res) => {
  try {
    const [bikePolicies, carPolicies, termPolicies, healthPolicies, investmentPolicies, gaurentedPolicies] =
      await Promise.all([
        BikePolicy.find({}),
        CarPolicy.find({}),
        TermPolicy.find({}),
        HealthPolicy.find({}),
        InvestmentPolicy.find({}),
        GaurentedPolicy.find({})
      ]);

    res.status(200).json({
      bikePolicies,
      carPolicies,
      termPolicies,
      healthPolicies,
      investmentPolicies,
      gaurentedPolicies
    });
  } catch (error) {
    console.error("Admin policy fetch error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
