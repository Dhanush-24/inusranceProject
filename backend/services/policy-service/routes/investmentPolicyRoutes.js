const express = require('express');
const router = express.Router();
const investmentPolicyController = require('../controllers/investmentController');

router.post('/create', investmentPolicyController.createInvestmentPolicyData);
router.get('/plans', investmentPolicyController.getInvestmentPlans);
router.post('/selectPlan', investmentPolicyController.selectPlan);
router.post('/createInvestmentPolicy',investmentPolicyController.createInvestmentPlanTemplate)
router.get('/:mobile',investmentPolicyController.getInvestmentPolicyDetailsByMobile)
router.get('/premium/:mobile', investmentPolicyController.getInvestmentPremiumByMobile);

module.exports = router;
