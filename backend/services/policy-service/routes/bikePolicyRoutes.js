const express = require('express');
const router = express.Router();

const bikePolicyController = require('../controllers/bikePolicyController');

// POST routes for saving bike information
router.post('/bikeNumber', bikePolicyController.saveBikeNumber);
router.post('/bikeBrand', bikePolicyController.saveBikeBrand);
router.post('/bikeModel', bikePolicyController.saveBikeModel);
router.post('/fuelType', bikePolicyController.saveFuelType);
router.post('/variant', bikePolicyController.saveVariant);
router.post('/registrationYear', bikePolicyController.saveRegistrationYear);
router.post('/registrationCity', bikePolicyController.saveRegistrationCity);
router.post('/userInfo', bikePolicyController.saveUserInfo);
router.post('/previousPolicy', bikePolicyController.savePreviousPolicy);
router.post('/createBikePolicy',bikePolicyController.createBikePolicy)
router.get('/policy-details/:mobileNumber', bikePolicyController.getBikePolicyDetailsByMobile);
router.get('/premium/:mobileNumber', bikePolicyController.getBikePremiumByMobile);


// GET route for fetching bike insurance plans
router.get('/plans', bikePolicyController.getBikeInsurancePlans);

// POST route for selecting a plan
router.post('/selectPlan', bikePolicyController.selectPlan);
router.post("/details", bikePolicyController.saveBikeDetails);

module.exports = router;
