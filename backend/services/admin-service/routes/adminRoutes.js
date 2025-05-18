const express = require("express");
const { adminLogin, registerAdmin, getAdminDetails } = require("../controllers/adminController");
const adminAuth = require("../middleware/adminAuth");

const router = express.Router();

router.post("/register", registerAdmin);
router.post("/login", adminLogin);

// Example of a protected route
router.get("/dashboard", adminAuth, getAdminDetails)
  
module.exports = router;
