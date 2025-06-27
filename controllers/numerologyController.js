const {
    calculateRadicalNumber,
    calculateDestinyNumber,
    calculateKuaNumber,
    extractDigits,
    calculateCompoundNumber,
    numenumberget,
    getMonthSumFromDate,
    getYearSumFromDate,
    calculateMobileNumber,
    calculateVehicleNumber,
    getWesternZodiacSign,
    getPlaneDetails,
    getRealDigits,
    analyzeEachNumber,
    negativeNumbers,
    findTriplets,
    findPrediction,
    getChart,
    findCommonFriendNumbers,
    addDriverFriendNeutralConductor,
    addConductorFriendNeutralDriver,
    removeNonFriendNumbers,
    getUnluckyNumbers,
    findCommonNeutralNumbers,
    excludeFromNeutral,
    suggestNameSpellingTotal,
    getCompatibilityMessage,
    getOverallCompatibility,
    getSuggestedNameSpellings,
    getZodiacByDate,
    getRudrakshaSuggestion,
    calculateLuckyDates,
    getRemedyDescriptions,
    calculatePersonalYear,
    calculateMasterNumberByRadical,
    calculateMasterDestinyNumber
} = require('../utils');

// Main loshuGrid controller
exports.loshuGrid = (req, res) => {
    const { date, gender, lang = 'en' } = req.query;

    if (!date || !gender) {
        return res.status(400).json({ 
            success: false,
            message: req.t('validation_error'),
            errors: [req.t('date_and_gender_required')]
        });
    }

    const radicalNumber = calculateRadicalNumber(date);
    const destinyNumber = calculateDestinyNumber(date);
    const kuaNumber = calculateKuaNumber(date, gender);

    const digits = extractDigits(date);
    const realDigits = [...digits, radicalNumber, destinyNumber, kuaNumber];

    const allDigits = Array.from({ length: 9 }, (_, i) => i + 1);
    const missingNumbers = allDigits.filter(d => !realDigits.includes(d)).join(',');
    const availableNumbers = allDigits.filter(d => realDigits.includes(d)).join(',');
    const luckFactor = realDigits.includes(5) ? 100.00 : 0.00;

    let loShuGrid = {};
    for (let i = 1; i <= 9; i++) loShuGrid[i] = '';

    for (let digit of realDigits) {
        if (digit >= 1 && digit <= 9) {
            loShuGrid[digit] += digit.toString();
        }
    }

    Object.keys(loShuGrid).forEach(key => {
        if (loShuGrid[key] === '') loShuGrid[key] = null;
    });

    const planes = {
        intellectual: [4, 9, 2],
        spiritual: [3, 5, 7],
        material: [8, 1, 6],
        thought: [4, 3, 8],
        will: [9, 5, 1],
        outlook: [2, 7, 6],
        property: [2, 5, 8],
        luck: [4, 5, 6],
    };

    const planeNumbers = {};
    const planePercentages = {};

    for (let [name, digits] of Object.entries(planes)) {
        const values = digits.map(d => loShuGrid[d] || '').join(', ');
        planeNumbers[name] = values;

        const filled = digits.filter(d => loShuGrid[d] !== null).length;
        planePercentages[name] = Math.floor((filled / digits.length) * 100);
    }

    return res.json({
        success: true,
        message: req.t('success'),
        data: {
            radicalNumber,
            destinyNumber,
            kuaNumber,
            planeNumbers,
            planePercentages,
            missingNumbers,
            availableNumbers,
            luckFactor,
            // realDigits,
            // loShuGrid
        }
    });
};

// Number Analysis Controller
exports.numberAnalysis = (req, res) => {
    const { name, date, phone, lang = 'en' } = req.query;

    // Validation
    if (!name || !date || !phone || phone.length !== 10) {
        return res.status(400).json({
            success: false,
            message: req.t('validation_error'),
            errors: [req.t('name_date_phone_required')]
        });
    }

    const birthDate = new Date(date);
    const birthDay = birthDate.getDate().toString().padStart(2, '0');
    const birthMonth = (birthDate.getMonth() + 1).toString().padStart(2, '0');

    const radicalNumber = calculateRadicalNumber(date);
    const destinyNumber = calculateDestinyNumber(date);
    const nameNumber = numenumberget(name);
    const nameCompoundNumber = calculateCompoundNumber(name);
    const monthNumber = getMonthSumFromDate(date);
    const yearNumber = getYearSumFromDate(date);
    const mobileNumber = calculateMobileNumber(phone);
    const westernZodiacSign = getWesternZodiacSign(parseInt(birthMonth), parseInt(birthDay));

    return res.json({
        success: true,
        message: req.t('success'),
        data: {
            radicalNumber,
            destinyNumber,
            nameNumber,
            nameCompoundNumber,
            monthNumber,
            yearNumber,
            westernZodiacSign: req.t(westernZodiacSign),
            mobileNumber
        }
    });
};

// exports.intellectualPlane = (req, res) => {
//     const { date, gender } = req.query;

//     if (!date || !gender) {
//         return res.status(400).json({ 
//             success: false,
//             message: req.t('validation_error'),
//             errors: [req.t('date_and_gender_required')]
//         });
//     }

//     const planeDigits = [4, 9, 2];
//     const plane = 'intellectual';
//     const weight = 'inte_weight'; // used as a key in translation

//     const data = getPlaneDetails({ date, gender, planeDigits, plane, weight }, res);

//     if (data.percentage === 100) {
//         data.percentageDescription = res.__('Intellectual plane weightage 100%');
//     }

//     return res.json({ 
//         success: true, 
//         message: req.t('success'),
//         data
//     });
// };

exports.planeDetails = (req, res) => {
    const type = req.params.type.replace('-plane', '');
    const { date, gender } = req.query;

    if (!date || !gender) {
        return res.status(400).json({
            success: false,
            message: req.t('validation_error'),
            errors: [req.t('date_and_gender_required')]
        });
    }

    const planeConfig = {
        intellectual: { digits: [4, 9, 2], weight: 'inte_weight' },
        spiritual: { digits: [3, 5, 7], weight: 'spi_weight' },
        material: { digits: [8, 1, 6], weight: 'mat_weight' },
        thought: { digits: [4, 3, 8], weight: 'thought_weight' },
        will: { digits: [9, 5, 1], weight: 'will_weight' },
        action: { digits: [2, 7, 6], weight: 'action_weight' },
        luck: { digits: [4, 5, 6], weight: 'luck_weight' },
        property: { digits: [2, 5, 8], weight: 'prop_weight' },
    };

    if (!planeConfig[type]) {
        return res.status(400).json({ message: req.t('invalid_plane_type') });
    }

    const config = planeConfig[type];
    const data = getPlaneDetails({
        date,
        gender,
        planeDigits: config.digits,
        plane: type,
        weight: config.weight
    }, req);

    if (type === 'intellectual' && data.percentage === 100) {
        data.percentageDescription = req.t(`${type}_plane_weightage_100`);
    } else if (type === 'thought' && data.percentage === 66) {
        data.percentageDescription = req.t(`${type}_plane_weightage_66`);
    } else if (['spiritual', 'action', 'property', 'luck'].includes(type) && data.percentage === 0) {
        data.percentageDescription = req.t(`${type}_plane_weightage_0`);
    }

    return res.json({ 
        success: true, 
        message: req.t('success'),
        data
    });
};

exports.missingNumbers = (req, res) => {
    const { date, gender } = req.query;

    if (!date || !gender) {
        return res.status(400).json({
            success: false,
            message: req.t('validation_error'),
            errors: [req.t('date_and_gender_required')]
        });
    }

    const realDigits = getRealDigits(date, gender);
    const allDigits = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    const missingNumbers = allDigits.filter(d => !realDigits.includes(d));

    const descriptionMap = {
        '1': [
            req.t('Difficulty in expressing their inner views.'),
            req.t('Always needs support from others.'),
            req.t('Egoless'),
            req.t('May stammer at the early age.'),
            req.t('Note : Gel fast, Slow decision making, should respect father & do Surya Dardhan.')
        ],
        '2': [
            req.t('Lack of sensitivity and intuition.'),
            req.t('May not care other’s feelings.'),
            req.t('Do not admit their mistake and try to justify their actions.'),
            req.t('Late Marriage.'),
            req.t('Note : Should not waste water & respect mother.')
        ],
        '3': [
            req.t('Lack of creativity and good imaginative power.'),
            req.t('May surrender to the difficult situation.'),
            req.t('Support Issue / or ask for support.')
        ],
        '4': [
            req.t('Lack of discipline and organisation.'),
            req.t('Clumsy hands.')
        ],
        '5': [
            req.t('Lack of balance in every sphere of life.'),
            req.t('Lack the drive and versatility to get their goals.'),
            req.t('Confidence'),
            req.t('Travelling ?')
        ],
        '6': [
            req.t('Poor bonding with home and family.'),
            req.t('Weak relationship sector.'),
            req.t('May face marriage problem.'),
            req.t('Do not get the support from the society at the time of crunch.')
        ],
        '7': [
            req.t('Lack of spiritualism.'),
            req.t('Religion, occult, education.'),
            req.t('May not care for the feelings of others.'),
            req.t('No Dokha to 7,'),
            req.t('No Setback')
        ],
        '8': [
            req.t('Poor in financial management, spendthrift.')
        ],
        '9': [
            req.t('Overlook the feelings of others.'),
            req.t('Lack of intelligence and energy n may not care for other’s feelings.')
        ]
    };

    const details = missingNumbers.map(num => {
        return {
            [req.t('missing_number_label', { number: num })]: descriptionMap[num.toString()] || [req.t('no_description_available')]
        };
    });

    return res.json({
        success: true,
        message: req.t('success'),
        data: {
            missingNumbers: missingNumbers.join(','),
            missingNumberDetails: details
        }
    });
};

exports.availableNumbers = (req, res) => {
    const { date, gender } = req.query;

    if (!date || !gender) {
        return res.status(400).json({
            success: false,
            message: req.t('validation_error'),
            errors: [req.t('date_and_gender_required')]
        });
    }

    const realDigits = getRealDigits(date, gender);
    const allDigits = [1, 2, 3, 4, 5, 6, 7, 8, 9];

    const availableArray = allDigits.filter(d => realDigits.includes(d));
    const descriptions = {
        '1': req.t('available_number_1_description'),
        '2': req.t('available_number_2_description'),
        '3': req.t('available_number_3_description'),
        '4': req.t('available_number_4_description'),
        '5': req.t('available_number_5_description'),
        '6': req.t('available_number_6_description'),
        '7': req.t('available_number_7_description'),
        '8': req.t('available_number_8_description'),
        '9': req.t('available_number_9_description'),
    };

    const response = availableArray.map(number => ({
        number: `${req.t('number')} ${number}`,
        description: descriptions[number.toString()] || req.t('no_description_found')
    }));

    return res.json({
        success: true,
        message: req.t('success'),
        data: {
            availableNumbers: availableArray.join(','),
            availableNumberDitails: response
        }
    });
};

exports.mobileAnalysis = (req, res) => {
    const { phone } = req.query;

    if (!phone || !/^\d{10}$/.test(phone)) {
        return res.status(400).json({
            success: false,
            message: req.t('validation_error'),
            errors: [req.t('phone_must_be_10_digit')]
        });
    }

    const mobileNumber = calculateMobileNumber(phone);
    const digitAnalysis = analyzeEachNumber(phone);
    const individualDigitAnalysis = digitAnalysis.map(item => ({
        digit: `${req.t('number')} ${item.digit}`,
        meaning: req.t(item.meaning)
    }));

    const descriptions = {
        '1': req.t('mobile_number_1'),
        '2': req.t('mobile_number_2'),
        '3': req.t('mobile_number_3'),
        '4': req.t('mobile_number_4'),
        '5': req.t('mobile_number_5'),
        '6': req.t('mobile_number_6'),
        '7': req.t('mobile_number_7'),
        '8': req.t('mobile_number_8'),
        '9': req.t('mobile_number_9')
    };

    let mobileNumberSumResult = [];
    if (mobileNumber == 5) {
        mobileNumberSumResult.push(req.t('sum_result_best'));
    } else if (mobileNumber == 6 || mobileNumber == 1) {
        mobileNumberSumResult.push(req.t('sum_result_good'));
    } else if (mobileNumber == 3) {
        mobileNumberSumResult.push(
            req.t('sum_result_good'),
            req.t('suggest_change_to_5_6_1')
        );
    } else {
        mobileNumberSumResult.push(
            req.t('sum_result_not_good'),
            req.t('try_change_to_5_6_1')
        );
    }

    const negativeNums = negativeNumbers(digitAnalysis);
    const negativeNumbersText = negativeNums.length
        ? `${req.t('negative_number_in_mobile')}: ${negativeNums.join(', ')}`
        : req.t('no_negative_number');

    const triplets = findTriplets(phone);
    const tripletsText = triplets.length
        ? `${req.t('triplets_found')}: ${triplets.join(', ')}`
        : req.t('no_triplets_found');

    return res.json({
        success: true,
        message: req.t('success'),
        data: {
            mobileNumber: `${req.t('your_mobile_number_is')}: ${phone}`,
            mobileNumberSum: `${req.t('your_mobile_number_sum_is')}: ${mobileNumber}`,
            mobileNumberDescriptions: descriptions[mobileNumber.toString()] || req.t('no_description_found'),
            individualDigitAnalysis,
            mobileNumberSumResult,
            negativeNumbers: negativeNumbersText,
            pairsOfThree: tripletsText
        }
    });
};

exports.nameAnalysis = (req, res) => {
    const { name, date, gender, lang = 'en' } = req.query;

    if (!name || !date || !gender) {
        return res.status(400).json({
            success: false,
            message: req.t('validation_error'),
            errors: [req.t('name_date_gender_required')]
        });
    }

    const radicalNumber = calculateRadicalNumber(date);
    const destinyNumber = calculateDestinyNumber(date);
    const nameNumber = numenumberget(name);
    const firstName = name.split(' ')[0];
    const firstNameNumber = numenumberget(firstName);

    const radicalPrediction = findPrediction(radicalNumber, lang);
    const destinyPrediction = findPrediction(destinyNumber, lang);

    const driver = getChart(radicalPrediction);
    const conductor = getChart(destinyPrediction);

    let lucky = findCommonFriendNumbers(driver, conductor);
    addDriverFriendNeutralConductor(driver, conductor, lucky);
    addConductorFriendNeutralDriver(driver, conductor, lucky);
    lucky = [...new Set(removeNonFriendNumbers(driver, conductor, lucky))];

    const unlucky = getUnluckyNumbers(driver, conductor);
    let neutral = excludeFromNeutral(findCommonNeutralNumbers(driver, conductor), lucky, unlucky);

    const suggestedTotal = suggestNameSpellingTotal(lucky, neutral, radicalNumber, destinyNumber);

    const label = lang === 'hi' ? 'नाम' : lang === 'ka' ? 'ಹೆಸರು' : 'Name';
    const firstLabel = lang === 'hi' ? 'प्रथम नाम' : lang === 'ka' ? 'ಮೊದಲ ಹೆಸರು' : 'First Name';
    const moolank = lang === 'hi' ? 'मूलांक' : lang === 'ka' ? 'ಮೂಲಾಂಕ' : 'Moolank';
    const bhagyank = lang === 'hi' ? 'भाग्यांक' : lang === 'ka' ? 'ಭಾಗ್ಯಾಂಕ' : 'Bhagyank';

    return res.json({
        success: true,
        message: req.t('success'),
        data: {
            description: req.t('name_number_description'),
            nameNumber: `${req.t('your_name_number')} : ${nameNumber}`,
            nameCompatibilityAsPerMoolank: getCompatibilityMessage(nameNumber, driver, moolank, label, req.t),
            nameCompatibilityAsPerBhagyank: getCompatibilityMessage(nameNumber, conductor, bhagyank, label, req.t),
            overallNameCompatibilityAsPerMoolankBhagyank: getOverallCompatibility(nameNumber, lucky, neutral, unlucky, label, req.t),

            firstNameNumber: `${req.t('your_first_name_number')} : ${firstNameNumber}`,
            firstNameCompatibilityAsPerMoolank: getCompatibilityMessage(firstNameNumber, driver, moolank, firstLabel, req.t),
            firstNameCompatibilityAsPerBhagyank: getCompatibilityMessage(firstNameNumber, conductor, bhagyank, firstLabel, req.t),
            overallFirstNameCompatibilityAsPerMoolankBhagyank: getOverallCompatibility(firstNameNumber, lucky, neutral, unlucky, firstLabel, req.t),

            suggestedNameNumber: req.t('suggested_name_number_title'),
            luckyNumbers: `${req.t('favourable_numbers')} : ${lucky.join(', ')}`,
            neutralNumbers: `${req.t('neutral_numbers')} : ${neutral.join(', ')}`,
            unluckyNumbers: `${req.t('unlucky_numbers')} : ${unlucky.join(', ')}`,
            suggestedTotal: suggestedTotal.length > 0
                ? `${req.t('suggested_name_total')} : ${suggestedTotal.join(', ')}`
                : req.t('no_suggested_name_total'),
            suggestedNameSpellings: getSuggestedNameSpellings(suggestedTotal, req.t)
        },
    });
};

exports.vehicleAnalysis = (req, res) => {
    const { vehicle } = req.query;
    const lang = req.language || 'en';

    if (!vehicle || !/^\d{4}$/.test(vehicle)) {
        return res.status(400).json({
            success: false,
            message: req.t('validation_error'),
            errors: [req.t('vehicle_must_be_4_digit')]
        });
    }

    const vehicleNumber = calculateVehicleNumber(vehicle);
    const digitAnalysis = analyzeEachNumber(vehicle);
    const individualDigitAnalysis = digitAnalysis.map(item => ({
        digit: `${req.t('number')} ${item.digit}`,
        meaning: req.t(item.meaning)
    }));

    const descriptions = {
        '1': req.t('vehicle_number_1'),
        '2': req.t('vehicle_number_2'),
        '3': req.t('vehicle_number_3'),
        '4': req.t('vehicle_number_4'),
        '5': req.t('vehicle_number_5'),
        '6': req.t('vehicle_number_6'),
        '7': req.t('vehicle_number_7'),
        '8': req.t('vehicle_number_8'),
        '9': req.t('vehicle_number_9')
    };

    let vehicleNumberSumResult = [];
    if (vehicleNumber == 5) {
        vehicleNumberSumResult.push(req.t('sum_result_best'));
    } else if (vehicleNumber == 6 || vehicleNumber == 1) {
        vehicleNumberSumResult.push(req.t('sum_result_good'));
    } else if (vehicleNumber == 3) {
        vehicleNumberSumResult.push(
            req.t('sum_result_good'),
            req.t('suggest_change_to_5_6_1')
        );
    } else {
        vehicleNumberSumResult.push(
            req.t('sum_result_not_good'),
            req.t('try_change_to_5_6_1')
        );
    }

    const negativeNums = negativeNumbers(digitAnalysis);
    const negativeNumbersText = negativeNums.length
        ? `${req.t('negative_number_in_vehicle')}: ${negativeNums.join(', ')}`
        : req.t('no_negative_number_vehicle');

    const triplets = findTriplets(vehicle);
    const tripletsText = triplets.length
        ? `${req.t('triplets_found_vehicle')}: ${triplets.join(', ')}`
        : req.t('no_triplets_found_vehicle');

    return res.json({
        success: true,
        message: req.t('success'),
        data: {
            vehicleNumber: `${req.t('your_vehicle_number_is')}: ${vehicle}`,
            vehicleNumberSum: `${req.t('your_vehicle_number_sum_is')}: ${vehicleNumber}`,
            vehicleNumberDescriptions: descriptions[vehicleNumber.toString()] || req.t('no_description_found'),
            individualDigitAnalysis,
            vehicleNumberSumResult,
            negativeNumbers: negativeNumbersText,
            pairsOfThree: tripletsText
        }
    });
};

exports.rudrakshaSuggestion = (req, res) => {
    const date = req.query.date; // for GET; use req.body.date for POST

    if (!date || isNaN(Date.parse(date))) {
        return res.status(400).json({
            success: false,
            message: req.t('validation_error'),
            errors: [req.t('date_required_valid')]
        });
    }

    const zodiac = getZodiacByDate(date);
    const rudraksha = getRudrakshaSuggestion(zodiac);

    const description = [
        req.t('rudraksha.description1'),
        req.t('rudraksha.description2')
    ];

    const data = {
        description: description,
        zodiac: req.t('rudraksha.your_zodiac', { zodiac: req.t(zodiac) }), // "आपकी राशि : {{zodiac}}"
        rudraksha: req.t('rudraksha.suggestion', { rudraksha })
    };

    return res.status(200).json({
        success: true,
        message: req.t('success'),
        data
    });
};

const predictions = require('../data/predictions.json');

exports.clothColour = (req, res) => {
    const date = req.query.date; // use req.body.date for POST method
    const locale = req.query.lang || 'en'; // default to English

    if (!date || isNaN(Date.parse(date))) {
        return res.status(400).json({
            success: false,
            message: req.t('validation_error'),
            errors: [req.t('date_required_valid')]
        });
    }

    const radicalNumber = calculateRadicalNumber(date);

    const prediction = predictions.find(
        (item) => item.language === locale && item.no === radicalNumber
    );

    if (!prediction) {
        return res.status(404).json({
            success: false,
            message: req.t('prediction_not_found')
        });
    }

    const data = {
        description: req.t('cloth_colour_description'),
        clothColour: `${req.t('cloth_colour_suggestion')}: ${prediction.cloth_colour}`
    };

    return res.status(200).json({
        success: true,
        message: req.t('success'),
        data
    });
};

exports.watchColour = (req, res) => {
    const date = req.query.date;
    const locale = req.query.lang || 'en';

    if (!date || isNaN(Date.parse(date))) {
        return res.status(400).json({
            success: false,
            message: req.t('validation_error'),
            errors: [req.t('date_required_valid')]
        });
    }

    const radicalNumber = calculateRadicalNumber(date);

    const prediction = predictions.find(
        (item) => item.language === locale && item.no === radicalNumber
    );

    if (!prediction) {
        return res.status(404).json({
            success: false,
            message: req.t('prediction_not_found')
        });
    }

    const data = {
        watchColour: `${req.t('watch_colour_suggestion')}: ${prediction.watch_colour}`,
        wristWatch: req.t(`wrist_watch_${radicalNumber}`)
    };

    return res.status(200).json({
        success: true,
        message: req.t('success'),
        data
    });
};

exports.oilSuggestion = (req, res) => {
    const date = req.query.date;
    const locale = req.query.lang || 'en';

    if (!date || isNaN(Date.parse(date))) {
        return res.status(400).json({
            success: false,
            message: req.t('validation_error'),
            errors: [req.t('date_required_valid')]
        });
    }

    const radicalNumber = calculateRadicalNumber(date);

    const prediction = predictions.find(
        (item) => item.language === locale && item.no === radicalNumber
    );

    if (!prediction) {
        return res.status(404).json({
            success: false,
            message: req.t('prediction_not_found')
        });
    }

    const images = {
        1: 'mars.png',
        2: 'sun.png',
        3: 'sun.png',
        4: 'ketu.png',
        5: 'venus.png',
        6: 'saturn.png',
        7: 'rahu.png',
        8: 'mercury.png',
        9: 'jupiter.png'
    };

    const imagePath = images[radicalNumber] ? `/front-assets/images/${images[radicalNumber]}` : null;

    const data = {
        title: req.t('energy_booster_remedy'),
        description: req.t('oil_suggestion_description'),
        oilSuggestion: `${req.t('oil_suggestion_for_you')}: ${prediction.oil_suggestion}`,
        planet_image: imagePath
    };

    return res.status(200).json({
        success: true,
        message: req.t('success'),
        data
    });
};

exports.healthAnalysis = (req, res) => {
    const date = req.query.date;
    const locale = req.query.lang || 'en';

    if (!date || isNaN(Date.parse(date))) {
        return res.status(400).json({
            success: false,
            message: req.t('validation_error'),
            errors: [req.t('date_required_valid')]
        });
    }

    const radicalNumber = calculateRadicalNumber(date);

    const prediction = predictions.find(
        (item) => item.language === locale && Number(item.no) === radicalNumber
    );

    if (!prediction) {
        return res.status(404).json({
            success: false,
            message: req.t('prediction_not_found')
        });
    }

    const data = {
        health: prediction.health,
    };

    return res.status(200).json({
        success: true,
        message: req.t('success'),
        data
    });
};

exports.marriageRelationship = (req, res) => {
    const date = req.query.date;
    const locale = req.query.lang || 'en';

    if (!date || isNaN(Date.parse(date))) {
        return res.status(400).json({
            success: false,
            message: req.t('validation_error'),
            errors: [req.t('date_required_valid')]
        });
    }

    const radicalNumber = calculateRadicalNumber(date);

    const prediction = predictions.find(
        (item) => item.language === locale && Number(item.no) === radicalNumber
    );

    if (!prediction) {
        return res.status(404).json({
            success: false,
            message: req.t('prediction_not_found')
        });
    }

    const data = {
        relationship: prediction.relationship,
    };

    return res.status(200).json({
        success: true,
        message: req.t('success'),
        data
    });
};

exports.luckyThings = (req, res) => {
    const date = req.query.date;
    const locale = req.query.lang || 'en';

    if (!date || isNaN(Date.parse(date))) {
        return res.status(400).json({
            success: false,
            message: req.t('validation_error'),
            errors: [req.t('date_required_valid')]
        });
    }

    const radicalNumber = calculateRadicalNumber(date);
    const destinyNumber = calculateDestinyNumber(date);

    const getPrediction = (no) =>
        predictions.find(
            (item) => item.language === locale && Number(item.no) === no
        );

    const radicalPrediction = getPrediction(radicalNumber);
    const destinyPrediction = getPrediction(destinyNumber);

    if (!radicalPrediction || !destinyPrediction) {
        return res.status(404).json({
            success: false,
            message: 'Prediction not found for radical or destiny number.'
        });
    }

    const buildChart = (p) => ({
        friend: p.favourable_number?.split(',') || [],
        neutral: p.neutral_numbers?.split(',') || [],
        non_friend: p.enemy_numbers?.split(',') || []
    });

    const compatibilityChart = {
        [radicalNumber]: buildChart(radicalPrediction),
        [destinyNumber]: buildChart(destinyPrediction)
    };

    const driver = compatibilityChart[radicalNumber];
    const conductor = compatibilityChart[destinyNumber];

    let luckyNumbers = findCommonFriendNumbers(driver, conductor);
    addDriverFriendNeutralConductor(driver, conductor, luckyNumbers);
    addConductorFriendNeutralDriver(driver, conductor, luckyNumbers);
    removeNonFriendNumbers(driver, conductor, luckyNumbers);

    const unluckyNumbers = getUnluckyNumbers(driver, conductor);
    let neutralNumbers = findCommonNeutralNumbers(driver, conductor);
    neutralNumbers = excludeFromNeutral(neutralNumbers, luckyNumbers, unluckyNumbers);

    const luckyDates = calculateLuckyDates(radicalNumber);

    const radicalColours = radicalPrediction.Auspicious_colour?.split(', ') || [];
    const destinyColours = destinyPrediction.Auspicious_colour?.split(', ') || [];
    const auspiciousColours = [...new Set([...radicalColours, ...destinyColours])].join(', ');

    const data = {
        description: req.t('Lucky Things description'),
        luckyThings: {
            numbers: {
                lucky: {
                    label: req.t('LUCKY NUMBER'),
                    value: luckyNumbers.join(', ')
                },
                unlucky: {
                    label: req.t('UNLUCKY NUMBER'),
                    value: unluckyNumbers.join(', ')
                },
                neutral: {
                    label: req.t('NATURAL NUMBER'),
                    value: neutralNumbers.join(', ')
                }
            },
            dates_days: {
                lucky_dates: {
                    label: req.t('LUCKY DATE'),
                    value: luckyDates.join(', ')
                },
                lucky_days: {
                    label: req.t('LUCKY DAYS'),
                    value: radicalPrediction.favourable_day || ''
                }
            },
            colors_directions: {
                colors: {
                    label: req.t('LUCKY COLORS'),
                    value: auspiciousColours
                },
                lucky_direction: {
                    label: req.t('LUCKY DIRECTION'),
                    value: radicalPrediction.Favorable_direction || ''
                },
                main_gate_direction: {
                    label: req.t('MAIN GATE DIRECTION'),
                    value: radicalPrediction.main_gate_direction || ''
                }
            }
        }
    };

    return res.status(200).json({
        success: true,
        message: req.t('success'),
        data
    });
};

exports.remedies = (req, res) => {
    const { date, gender } = req.query;

    if (!date || isNaN(Date.parse(date)) || !gender) {
        return res.status(400).json({
            success: false,
            message: req.t('validation_error'),
            errors: [req.t('date_and_gender_required')]
        });
    }

    const data = getRemedyDescriptions(date, gender, req.t);

    return res.status(200).json({
        success: true,
        message: req.t('success'),
        data
    });
};

exports.careerAnalysis = (req, res) => {
    const date = req.query.date;
    const locale = req.query.lang || 'en';

    if (!date || isNaN(Date.parse(date))) {
        return res.status(400).json({
            success: false,
            message: req.t('validation_error'),
            errors: [req.t('date_required_valid')]
        });
    }

    const radicalNumber = calculateRadicalNumber(date);

    const prediction = predictions.find(
        (item) => item.language === locale && Number(item.no) === radicalNumber
    );

    if (!prediction) {
        return res.status(404).json({
            success: false,
            message: req.t('prediction_not_found')
        });
    }

    const data = {
        career: prediction.career || ''
    };

    return res.status(200).json({
        success: true,
        message: req.t('success'),
        data
    });
};

exports.moneyAnalysis = (req, res) => {
    const date = req.query.date;
    const locale = req.query.lang || 'en';

    if (!date || isNaN(Date.parse(date))) {
        return res.status(400).json({
            success: false,
            message: req.t('validation_error'),
            errors: [req.t('date_required_valid')]
        });
    }

    const radicalNumber = calculateRadicalNumber(date);

    const prediction = predictions.find(
        (item) => item.language === locale && Number(item.no) === radicalNumber
    );

    if (!prediction) {
        return res.status(404).json({
            success: false,
            message: req.t('prediction_not_found')
        });
    }

    const data = {
        money: prediction.money || ''
    };

    return res.status(200).json({
        success: true,
        message: req.t('success'),
        data
    });
};

exports.jobAnalysis = (req, res) => {
    const date = req.query.date;
    const locale = req.query.lang || 'en';

    if (!date || isNaN(Date.parse(date))) {
        return res.status(400).json({
            success: false,
            message: req.t('validation_error'),
            errors: [req.t('date_required_valid')]
        });
    }

    const radicalNumber = calculateRadicalNumber(date);

    const prediction = predictions.find(
        (item) => item.language === locale && Number(item.no) === radicalNumber
    );

    if (!prediction) {
        return res.status(404).json({
            success: false,
            message: req.t('prediction_not_found')
        });
    }

    const data = {
        job: prediction.job || ''
    };

    return res.status(200).json({
        success: true,
        message: req.t('success'),
        data
    });
};

const personalYearData = require('../data/personalYear.json'); // Or fetch from DB

exports.personalYear = (req, res) => {
    const date = req.query.date;

    if (!date || isNaN(Date.parse(date))) {
        return res.status(400).json({
            success: false,
            message: req.t('validation_error'),
            errors: [req.t('date_required_valid')]
        });
    }

    const birthDate = new Date(date);
    const birthDay = String(birthDate.getDate()).padStart(2, '0');
    const birthMonth = String(birthDate.getMonth() + 1).padStart(2, '0');
    const currentYear = new Date().getFullYear();

    const radicalNumber = calculateRadicalNumber(date);
    const personalYear = calculatePersonalYear(birthDay, birthMonth, currentYear);

    // Fetch matching data
    const luckFactor = personalYearData.find(item =>
        Number(item.number) === personalYear && Number(item.radical_number) === radicalNumber
    );

    const number = luckFactor?.number ?? null;

    let description;
    if (number >= 1 && number <= 9) {
        description = {
            title: req.t(`personal year ${number} title`),
            description: req.t(`personal year ${number} description`)
        };
    } else {
        description = {
            title: 'personal year unknown title',
            description: 'personal year unknown description'
        };
    }

    const luckFactorDetails = {
        title: req.t('Your Luck factors based on compatibility between your personal year and your driver number'),
        descriptions: []
    };

    if (luckFactor?.other_things && luckFactor?.luck_factor) {
        luckFactorDetails.descriptions.push(
            req.t('Luck Factor - Research, Education, Spiritual & Occult Activities') + ' : ' + luckFactor.luck_factor,
            req.t('Luck Factor - Other Things') + ' : ' + luckFactor.other_things
        );
    } else if (luckFactor?.luck_factor) {
        luckFactorDetails.descriptions.push(
            req.t('Luck Factor') + ' : ' + luckFactor.luck_factor
        );
    } else if (luckFactor?.education_religion && luckFactor?.job_business) {
        luckFactorDetails.descriptions.push(
            req.t('Luck Factor - Education Religion') + ' : ' + luckFactor.education_religion,
            req.t('Luck Factor - Job , Business , Education') + ' : ' + luckFactor.job_business
        );
    }

    // Notes
    const notes = [];

    if (luckFactor?.number == 1 && radicalNumber == 8) {
        notes.push(req.t('Note') + ' : ' + req.t('personal year 1 note'));
    }

    if (luckFactor?.number == 3) {
        notes.push(req.t('Note') + ' : ' + req.t('personal year 3 note'));
    }

    if (notes.length) {
        luckFactorDetails.notes = notes;
    }

    const data = {
        personalYear: `${req.t('YOUR PERSONAL YEAR')} : ${personalYear}`,
        description,
        luckFactorDetails
    };

    return res.status(200).json({
        success: true,
        message: req.t('success'),
        data
    });
};

const fs = require('fs');
const path = require('path');

exports.karmicNumber = async (req, res) => {
    const { date, lang = 'en' } = req.query;

    // Basic validation for date format: yyyy-mm-dd
    if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
        return res.status(400).json({
            success: false,
            message: req.t('validation_error'),
            errors: [req.t('date_required_valid')]
        });
    }

    const birthDay = parseInt(date.split('-')[2]);

    try {
        const karmicDataPath = path.join(__dirname, '../data/karmicNumbers.json');
        const rawData = fs.readFileSync(karmicDataPath, 'utf8');
        const karmicJson = JSON.parse(rawData);

        const langData = karmicJson[lang] || karmicJson['en'];
        const karmic = langData[birthDay];

        let karmicNumber;

        if (karmic) {
            karmicNumber = {
                title: req.t('Your Karmic Number', { karmic_number: birthDay }),
                summary: `${req.t('Karmic_Number')} ${birthDay} - ${karmic.karmic_title}`,
                descriptions: karmic.descriptions
            };
        } else {
            karmicNumber = {
                message: req.t('You are not born in Karmic Numbers')
            };
        }

        const data = {
            karmicNumbers: req.t('10, 13, 14, 16, 19 are karmic Numbers'),
            karmicNumber: karmicNumber
        };

        return res.status(200).json({
            success: true,
            message: req.t('success'),
            data
        });
    } catch (err) {
        console.error('Error fetching karmic number from JSON:', err);
        return res.status(500).json({
            success: false,
            message: 'Server Error'
        });
    }
};

// const KarmicNumber = require('../models/KarmicNumber'); // Replace with your model

// exports.karmicNumber = async (req, res) => {
//     const { date, lang = 'en' } = req.query;

//     if (!date || !isValid(parseISO(date))) {
//         return res.status(400).json({
//             success: false,
//             message: req.t('validation_error'),
//             errors: [req.t('date_required_valid')]
//         });
//     }

//     const birthDay = parseInt(date.split('-')[2]); // Extract day from yyyy-mm-dd
//     try {
//         const karmic = await KarmicNumber.findOne({
//             language: lang,
//             number: birthDay
//         });

//         let karmicNumber;

//         if (karmic) {
//             const descriptions = karmic.description
//                 .split('.')
//                 .map(desc => desc.trim())
//                 .filter(Boolean);

//             karmicNumber = {
//                 title: req.t('Your Karmic Number', { karmic_number: karmic.number }),
//                 summary: `${req.t('Karmic Number')} ${karmic.number} - ${karmic.karmic_title}`,
//                 descriptions: descriptions
//             };
//         } else {
//             karmicNumber = {
//                 message: req.t('You are not born in Karmic Numbers')
//             };
//         }

//         const data = {
//             karmicNumbers: req.t('10, 13, 14, 16, 19 are karmic Numbers'),
//             karmicNumber: karmicNumber
//         };

//         return res.status(200).json({
//             success: true,
//             message: req.t('success'),
//             data
//         });
//     } catch (err) {
//         console.error('Error fetching karmic number:', err);
//         return res.status(500).json({
//             success: false,
//             message: 'Server Error'
//         });
//     }
// };

exports.masterDriver = (req, res) => {
    const date = req.query.date;

    if (!date || isNaN(Date.parse(date))) {
        return res.status(400).json({
            success: false,
            message: req.t('validation_error'),
            errors: [req.t('date_required_valid')]
        });
    }

    const masterNumberByRadical = calculateMasterNumberByRadical(date);
    let masterDriver = {};

    if (masterNumberByRadical === 11) {
        masterDriver = {
            title: req.t('Your Master Driver Number', { mdn: '11' }),
            summary: req.t('Your Driver Number', { dn: '11/2' }),
            descriptionTitle: req.t('Characteristics of an individual having Master Driver Number as 11 is as under'),
            descriptions: [
                req.t('Dreamer - Big Dreams, but not doers, cannot achieve what they dream.'),
                req.t('Unrealistic goals.'),
                req.t('Needs a push, support or motivation, challenge to achieve their dreams ( from near & dear ones).'),
                req.t('Can do wonders in life if get proper guidance and support.'),
                req.t('Is double sun power')
            ]
        };
    } else if (masterNumberByRadical === 22) {
        masterDriver = {
            title: req.t('Your Master Driver Number', { mdn: '22' }),
            summary: req.t('Your Driver Number', { dn: '22/4' }),
            descriptionTitle: req.t('Characteristics of an individual having Master Driver Number as 22 is as under'),
            descriptions: [
                req.t('Dreamer - and doers.'),
                req.t('What they think, they will do it.'),
                req.t('Will not rest till they achieve their goal.'),
                req.t('Does not require support or motivation to achieve their dreams.'),
                req.t('Need is hard work, focused approach, Realistic'),
                req.t('Else - Raja - Rank.')
            ]
        };
    } else {
        masterDriver = {
            message: req.t('You do not have a Master Driver number')
        };
    }

    return res.status(200).json({
        success: true,
        message: req.t('success'),
        data: { masterDriver }
    });
};

exports.masterConductor = (req, res) => {
    const date = req.query.date;

    if (!date || isNaN(Date.parse(date))) {
        return res.status(400).json({
            success: false,
            message: req.t('validation_error'),
            errors: [req.t('date_required_valid')]
        });
    }

    const dateObj = new Date(date);
    const birthDay = dateObj.getDate();
    const birthMonth = dateObj.getMonth() + 1; // getMonth returns 0-based index
    const birthYear = dateObj.getFullYear();

    const masterDestinyNumber = calculateMasterDestinyNumber(birthDay, birthMonth, birthYear);

    let masterDriver = {};

    if (masterDestinyNumber.horizontal === 11 || masterDestinyNumber.verticalCompoundSum === 11) {
        masterDriver = {
            title: req.t('Your Master Conductor Number', { mcn: '11' }),
            summary: req.t('Your Conductor Number', { cn: '11/2' }),
            descriptionTitle: req.t('Characteristics of an individual having Master Conductor Number as 11 is as under'),
            descriptions: [
                req.t('Dreamer - Big Dreams, but not doers, cannot achieve what they dream.'),
                req.t('Unrealistic goals.'),
                req.t('Needs a push, support or motivation, challenge to achieve their dreams ( from near & dear ones).'),
                req.t('Can do wonders in life if get proper guidance and support.'),
                req.t('Is double sun power')
            ]
        };
    } else if (masterDestinyNumber.horizontal === 22 || masterDestinyNumber.verticalCompoundSum === 22) {
        masterDriver = {
            title: req.t('Your Master Conductor Number', { mcn: '22' }),
            summary: req.t('Your Conductor Number', { cn: '22/4' }),
            descriptionTitle: req.t('Characteristics of an individual having Master Conductor Number as 22 is as under'),
            descriptions: [
                req.t('Dreamer - and doers.'),
                req.t('What they think, they will do it.'),
                req.t('Will not rest till they achieve their goal.'),
                req.t('Does not require support or motivation to achieve their dreams.'),
                req.t('Need is hard work, focused approach, Realistic'),
                req.t('Else - Raja - Rank.')
            ]
        };
    } else if (masterDestinyNumber.horizontal === 33 || masterDestinyNumber.verticalCompoundSum === 33) {
        masterDriver = {
            title: req.t('Your Master Conductor Number', { mcn: '33' }),
            summary: req.t('Your Conductor Number', { cn: '33/6' }),
            descriptionTitle: req.t('Characteristics of an individual having Master Conductor Number as 33 is as under'),
            descriptions: [
                req.t('Unconditional love.'),
                req.t('No enemies.'),
                req.t('Complete humanitarian.'),
                req.t('They will experience the results and then advice remedies to others.'),
                req.t('Good Preachers.')
            ]
        };
    } else {
        masterDriver = {
            message: req.t('You do not have a master conductor number')
        };
    }

    return res.status(200).json({
        success: true,
        message: req.t('success'),
        data: { masterDriver }
    });
};