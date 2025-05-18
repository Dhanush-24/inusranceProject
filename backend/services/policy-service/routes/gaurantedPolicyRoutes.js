const express = require('express');
const router = express.Router();
const gaurentedPolicyController = require('../controllers/gaurentedPolicyController');

// Route to create a new guaranteed policy
router.post('/create', gaurentedPolicyController.createGaurentedPolicyDetails);

// Route to fetch all guaranteed plans
router.get('/plans', gaurentedPolicyController.getGaurentedPlans);

// Route to select a plan and create or update the policy
router.post('/select', gaurentedPolicyController.selectPlan);
router.post('/createGaurentedPolicy',gaurentedPolicyController.createGaurentedPolicy)
router.get('/policy-details/:mobile', gaurentedPolicyController.getGaurentedPolicyDetailsByMobile);
router.get('/premium/:mobile', gaurentedPolicyController.getGuaranteedPremiumByMobile);



module.exports = router;
