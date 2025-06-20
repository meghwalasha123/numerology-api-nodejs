const express = require('express');
const router = express.Router();
const verifyUser = require('../middleware/verifyUser');
const numerologyController = require('../controllers/numerologyController');

// Example GET API
router.get('/loshu-grid', verifyUser, numerologyController.loshuGrid);
router.get('/number-analysis', verifyUser, numerologyController.numberAnalysis);
// router.get('/intellectual-plane', verifyUser, numerologyController.intellectualPlane);
router.get('/:type-plane', verifyUser, numerologyController.planeDetails);
router.get('/missing-numbers', verifyUser, numerologyController.missingNumbers);
router.get('/available-numbers', verifyUser, numerologyController.availableNumbers);
router.get('/mobile-analysis', verifyUser, numerologyController.mobileAnalysis);
router.get('/name-analysis', verifyUser, numerologyController.nameAnalysis);
router.get('/vehicle-analysis', verifyUser, numerologyController.vehicleAnalysis);
router.get('/rudraksha-suggestion', verifyUser, numerologyController.rudrakshaSuggestion);
router.get('/cloth-colour', verifyUser, numerologyController.clothColour);
router.get('/watch-colour', verifyUser, numerologyController.watchColour);
router.get('/oil-suggestion', verifyUser, numerologyController.oilSuggestion);
router.get('/health-analysis', verifyUser, numerologyController.healthAnalysis);
router.get('/marriage-relationship', verifyUser, numerologyController.marriageRelationship);
router.get('/lucky-things', verifyUser, numerologyController.luckyThings);
router.get('/remedies', verifyUser, numerologyController.remedies);
router.get('/career-analysis', verifyUser, numerologyController.careerAnalysis);
router.get('/money-analysis', verifyUser, numerologyController.moneyAnalysis);
router.get('/job-analysis', verifyUser, numerologyController.jobAnalysis);
router.get('/personal-year', verifyUser, numerologyController.personalYear);
router.get('/karmic-number', verifyUser, numerologyController.karmicNumber);
router.get('/master-driver', verifyUser, numerologyController.masterDriver);
router.get('/master-conductor', verifyUser, numerologyController.masterConductor);

// Add remaining GET APIs similarly...

module.exports = router;


