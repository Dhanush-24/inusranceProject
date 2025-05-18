const express = require("express");
const router = express.Router();
const { getAllUsersWithPolicies } = require("../controllers/adminUserPolicyController");

router.get("/users", getAllUsersWithPolicies);

module.exports = router;
