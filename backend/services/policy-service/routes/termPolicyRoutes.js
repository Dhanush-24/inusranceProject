const express = require('express');
const router = express.Router();
const termPolicyController = require('../controllers/termPolicyControllers');

// Create policy (without plan)
router.post('/create', termPolicyController.createTermPolicy);

// Get available term plans
router.get('/plans', termPolicyController.getTermInsurancePlans);

// Select a plan for the policy
router.post('/select', termPolicyController.selectPlan);
router.post('/createTermInsuranceData',termPolicyController.createTermPolicySchema)
router.get('/:mobile', termPolicyController.getTermPolicyDetailsByMobile);
router.get('/premium/:mobile', termPolicyController.getTermPremiumByMobile);

module.exports = router;
