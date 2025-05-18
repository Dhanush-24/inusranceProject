const express = require("express");
const router = express.Router();
const auth = require("../middleware/adminAuth");

const {
  getAll,
  addPolicy,
  updatePolicy,
  deletePolicy,
  getAllUsersInPolicies,
} = require("../controllers/adminPolicyController");

router.get("/:type", auth, getAll);
router.post("/:type", auth, addPolicy);
router.put("/:type/:planId", auth, updatePolicy);
router.delete("/:type/:planId", auth, deletePolicy);
router.get("/policy-users", auth, getAllUsersInPolicies);

module.exports = router;
