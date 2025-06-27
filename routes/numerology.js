const express = require('express');
const router = express.Router();
const verifyUser = require('../middleware/verifyUser');
const { loshuGrid, numberAnalysis, planeDetails, missingNumbers, availableNumbers, mobileAnalysis, nameAnalysis, vehicleAnalysis, rudrakshaSuggestion, clothColour, watchColour, oilSuggestion, healthAnalysis, marriageRelationship, luckyThings, remedies, careerAnalysis, moneyAnalysis, jobAnalysis, personalYear, karmicNumber, masterDriver, masterConductor} = require('../controllers/numerologyController');

// Example GET API
router.get('/loshu-grid', verifyUser, loshuGrid);
router.get('/number-analysis', verifyUser, numberAnalysis);
// router.get('/intellectual-plane', verifyUser, intellectualPlane);
router.get('/:type-plane', verifyUser, planeDetails);
router.get('/missing-numbers', verifyUser, missingNumbers);
router.get('/available-numbers', verifyUser, availableNumbers);
router.get('/mobile-analysis', verifyUser, mobileAnalysis);
router.get('/name-analysis', verifyUser, nameAnalysis);
router.get('/vehicle-analysis', verifyUser, vehicleAnalysis);
router.get('/rudraksha-suggestion', verifyUser, rudrakshaSuggestion);
router.get('/cloth-colour', verifyUser, clothColour);
router.get('/watch-colour', verifyUser, watchColour);
router.get('/oil-suggestion', verifyUser, oilSuggestion);
router.get('/health-analysis', verifyUser, healthAnalysis);
router.get('/marriage-relationship', verifyUser, marriageRelationship);
router.get('/lucky-things', verifyUser, luckyThings);
router.get('/remedies', verifyUser, remedies);
router.get('/career-analysis', verifyUser, careerAnalysis);
router.get('/money-analysis', verifyUser, moneyAnalysis);
router.get('/job-analysis', verifyUser, jobAnalysis);
router.get('/personal-year', verifyUser, personalYear);
router.get('/karmic-number', verifyUser, karmicNumber);
router.get('/master-driver', verifyUser, masterDriver);
router.get('/master-conductor', verifyUser, masterConductor);

module.exports = router;


