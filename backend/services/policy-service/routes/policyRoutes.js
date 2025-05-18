const express = require('express');
const router = express.Router();
const policyController = require('../controllers/policyController');

// Car Details (Step-by-step)
router.post('/car-number', policyController.saveCarNumber);
router.post('/car-brand', policyController.saveCarBrand);
router.post('/car-model', policyController.saveCarModel);
router.post('/fuel-type', policyController.saveFuelType);
router.post('/variant', policyController.saveVariant);
router.post('/registration-year', policyController.saveRegistrationYear);
router.post('/registration-city', policyController.saveRegistrationCity);

// Optional: Save all details at once
router.post('/details', policyController.saveCarDetails);

// User Info & Previous Policy
router.post('/user-info', policyController.saveUserInfo);
router.post('/previous-policy', policyController.savePreviousPolicy);

// Plan Selection & Fetching
router.post('/selectplan', policyController.selectPlan);
router.post('/createPolicy', policyController.createCarPolicy);
router.get('/plans', policyController.getCarInsurancePlans);

// Policy Lookup
router.get('/policy-details/:mobileNumber', policyController.getPolicyDetailsByMobile);
router.get('/premium/:mobileNumber', policyController.getPremiumByMobile);
router.get('/check-existing', policyController.checkCarNumberExists);

module.exports = router;
