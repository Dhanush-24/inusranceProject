const mongoose = require("mongoose");

// Load your models
const BikePolicySchema = require("../../policy-service/DataModels/BikePolicySchema");
const CarPolicy = require("../../policy-service/DataModels/CarPolicy");
const TermPolicySchema = require("../../policy-service/DataModels/TermPolicySchema");
const GuaranteedPolicySchema = require("../../policy-service/DataModels/GaurenteedPolicySchema");
const InvestmentPolicySchema = require("../../policy-service/DataModels/InvestmentPolicySchema");
const HealthPolicySchema = require("../../policy-service/DataModels/HealthPolicySchema");

const modelMap = {
  bike: BikePolicySchema,
  car: CarPolicy,
  term: TermPolicySchema,
  gaurented: GuaranteedPolicySchema,
  investment: InvestmentPolicySchema,
  health: HealthPolicySchema,
};

const getModel = (type) => {
  const model = modelMap[type];
  if (!model) throw new Error("Invalid policy type");
  return model;
};

exports.getAll = async (req, res) => {
  try {
    const Policy = getModel(req.params.type);
    const data = await Policy.find();
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.addPolicy = async (req, res) => {
  try {
    const Policy = getModel(req.params.type);
    const newPolicy = await Policy.create(req.body);
    res.status(201).json(newPolicy);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updatePolicy = async (req, res) => {
  try {
    const Policy = getModel(req.params.type);
    const updatedPolicy = await Policy.findOneAndUpdate(
      { planId: req.params.planId },
      req.body,
      { new: true }
    );
    if (!updatedPolicy) {
      return res.status(404).json({ message: "Policy not found" });
    }
    res.json(updatedPolicy);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deletePolicy = async (req, res) => {
  try {
    const Policy = getModel(req.params.type);
    const result = await Policy.findOneAndDelete({ planId: req.params.planId });
    if (!result) {
      return res.status(404).json({ message: "Policy not found" });
    }
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getAllUsersInPolicies = async (req, res) => {
  try {
    const allUserData = {};

    for (const [type, Model] of Object.entries(modelMap)) {
      try {
        const data = await Model.find();
        const users = [];

        data.forEach((policy) => {
          if (Array.isArray(policy.users)) {
            users.push(
              ...policy.users.map((user) => ({
                ...user,
                policyType: type,
                planId: policy.planId,
                planName: policy.planName || policy.policyName,
              }))
            );
          }
        });

        allUserData[type] = users;
      } catch (err) {
        console.warn(`Skipping ${type}: ${err.message}`);
      }
    }

    res.json(allUserData);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
