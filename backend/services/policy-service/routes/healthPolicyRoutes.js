// healthPolicyRoutes.js
const express = require('express');
const router = express.Router();
const { createHealthPolicy, getHealthInsurancePlans, getHealthPolicyDetailsByMobile,selectPlan, createHealthPolicySchema, getHealthPremiumByMobile } = require('../controllers/healthPolicyController');

router.post('/create', createHealthPolicy);

router.get('/plans', getHealthInsurancePlans);

router.post('/select', selectPlan);  
router.post('/createHealthPolicyData',createHealthPolicySchema) 
router.get('/policy-details/:mobile', getHealthPolicyDetailsByMobile);
router.get('/premium/:mobile', getHealthPremiumByMobile);


module.exports = router;
