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
    getZodiacByDate,
    getRudrakshaSuggestion,
    calculateLuckyDates,
    getRemedyDescriptions
} = require('../utils');

// Main loshuGrid controller
exports.loshuGrid = (req, res) => {
    const { date, gender, lang = 'en' } = req.query;

    if (!date || !gender) {
        return res.status(400).json({ message: 'Missing required query parameters: date, gender' });
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

    res.json({
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
    });
};

// Number Analysis Controller
exports.numberAnalysis = (req, res) => {
    const { name, date, phone, lang = 'en' } = req.query;

    // Validation
    if (!name || !date || !phone || phone.length !== 10) {
        return res.status(400).json({ message: 'Missing or invalid required query parameters: name, date, phone' });
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
        radicalNumber,
        destinyNumber,
        nameNumber,
        nameCompoundNumber,
        monthNumber,
        yearNumber,
        westernZodiacSign,
        mobileNumber
    });
};

// exports.intellectualPlane = (req, res) => {
//     const { date, gender } = req.query;

//     if (!date || !gender) {
//         return res.status(400).json({ message: res.__('Missing required parameters') });
//     }

//     const planeDigits = [4, 9, 2];
//     const plane = 'intellectual';
//     const weight = 'inte_weight'; // used as a key in translation

//     const data = getPlaneDetails({ date, gender, planeDigits, plane, weight }, res);

//     if (data.percentage === 100) {
//         data.percentageDescription = res.__('Intellectual plane weightage 100%');
//     }

//     return res.json({ success: true, data });
// };


exports.planeDetails = (req, res) => {
    const type = req.params.type.replace('-plane', '');
    const { date, gender } = req.query;

    if (!date || !gender) {
        return res.status(400).json({ message: res.__('Missing required parameters') });
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
        return res.status(400).json({ message: res.__('Invalid plane type') });
    }

    const config = planeConfig[type];
    const data = getPlaneDetails({
        date,
        gender,
        planeDigits: config.digits,
        plane: type,
        weight: config.weight
    }, res);

    if (data.percentage === 100) {
        data.percentageDescription = res.__(`${type} plane weightage 100%`);
    }

    return res.json({ success: true, data });
};

exports.missingNumbers = (req, res) => {
    const { date, gender, lang = 'en' } = req.query;

    if (!date || !gender) {
        return res.status(400).json({
            success: false,
            message: 'Validation Error',
            errors: ['date and gender are required']
        });
    }

    const realDigits = getRealDigits(date, gender);
    const allDigits = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    const missingNumbers = allDigits.filter(d => !realDigits.includes(d));

    const descriptionMap = {
        '1': [
            res.__('Difficulty in expressing their inner views.'),
            res.__('Always needs support from others.'),
            res.__('Egoless'),
            res.__('May stammer at the early age.'),
            res.__('Note : Gel fast, Slow decision making, should respect father & do Surya Dardhan.')
        ],
        '2': [
            res.__('Lack of sensitivity and intuition.'),
            res.__('May not care other’s feelings.'),
            res.__('Do not admit their mistake and try to justify their actions.'),
            res.__('Late Marriage.'),
            res.__('Note : Should not waste water & respect mother.')
        ],
        '3': [
            res.__('Lack of creativity and good imaginative power.'),
            res.__('May surrender to the difficult situation.'),
            res.__('Support Issue / or ask for support.')
        ],
        '4': [
            res.__('Lack of discipline and organisation.'),
            res.__('Clumsy hands.')
        ],
        '5': [
            res.__('Lack of balance in every sphere of life.'),
            res.__('Lack the drive and versatility to get their goals.'),
            res.__('Confidence'),
            res.__('Travelling ?')
        ],
        '6': [
            res.__('Poor bonding with home and family.'),
            res.__('Weak relationship sector.'),
            res.__('May face marriage problem.'),
            res.__('Do not get the support from the society at the time of crunch.')
        ],
        '7': [
            res.__('Lack of spiritualism.'),
            res.__('Religion, occult, education.'),
            res.__('May not care for the feelings of others.'),
            res.__('No Dokha to 7,'),
            res.__('No Setback')
        ],
        '8': [
            res.__('Poor in financial management, spendthrift.')
        ],
        '9': [
            res.__('Overlook the feelings of others.'),
            res.__('Lack of intelligence and energy n may not care for other’s feelings.')
        ]
    };

    const details = missingNumbers.map(num => {
        return {
            [`Missing Number ${num}`]: descriptionMap[num.toString()] || ['No description available']
        };
    });

    return res.json({
        success: true,
        data: {
            missingNumbers: missingNumbers.join(','),
            missingNumberDitails: details
        },
        message: 'Success!'
    });
};

exports.availableNumbers = (req, res) => {
    const { date, gender, lang = 'en' } = req.query;

    if (!date || !gender) {
        return res.status(400).json({
            success: false,
            message: 'Validation Error',
            errors: ['date and gender are required']
        });
    }

    const realDigits = getRealDigits(date, gender);
    const allDigits = [1, 2, 3, 4, 5, 6, 7, 8, 9];

    const availableArray = allDigits.filter(d => realDigits.includes(d));
    const descriptions = {
        '1': res.__('Available number 1 description'),
        '2': res.__('Available number 2 description'),
        '3': res.__('Available number 3 description'),
        '4': res.__('Available number 4 description'),
        '5': res.__('Available number 5 description'),
        '6': res.__('Available number 6 description'),
        '7': res.__('Available number 7 description'),
        '8': res.__('Available number 8 description'),
        '9': res.__('Available number 9 description'),
    };

    const response = availableArray.map(number => ({
        number: `${res.__('Number')} ${number}`,
        description: descriptions[number.toString()] || 'No description found'
    }));

    return res.json({
        success: true,
        data: {
            availableNumbers: availableArray.join(','),
            availableNumberDitails: response
        },
        message: 'Success!'
    });
};

exports.mobileAnalysis = (req, res) => {
    const { phone, lang = 'en' } = req.query;

    if (!phone || !/^\d{10}$/.test(phone)) {
        return res.status(400).json({
            success: false,
            message: 'Validation Error',
            errors: ['phone must be a 10-digit number']
        });
    }

    const mobileNumber = calculateMobileNumber(phone);
    const digitAnalysis = analyzeEachNumber(phone);
    const individualDigitAnalysis = digitAnalysis.map(item => ({
        digit: `${res.__({ phrase: 'Number', locale: lang })} ${item.digit}`,
        meaning: res.__({ phrase: item.meaning, locale: lang })
    }));

    const descriptions = {
        '1': res.__({ phrase: 'mobile number 1', locale: lang }),
        '2': res.__({ phrase: 'mobile number 2', locale: lang }),
        '3': res.__({ phrase: 'mobile number 3', locale: lang }),
        '4': res.__({ phrase: 'mobile number 4', locale: lang }),
        '5': res.__({ phrase: 'mobile number 5', locale: lang }),
        '6': res.__({ phrase: 'mobile number 6', locale: lang }),
        '7': res.__({ phrase: 'mobile number 7', locale: lang }),
        '8': res.__({ phrase: 'mobile number 8', locale: lang }),
        '9': res.__({ phrase: 'mobile number 9', locale: lang })
    };

    let mobileNumberSumResult = [];
    if (mobileNumber == 5) {
        mobileNumberSumResult.push(res.__({ phrase: 'Your mobile number sum result is Best', locale: lang }));
    } else if (mobileNumber == 6 || mobileNumber == 1) {
        mobileNumberSumResult.push(res.__({ phrase: 'Your mobile number sum result is Good', locale: lang }));
    } else if (mobileNumber == 3) {
        mobileNumberSumResult.push(
            res.__({ phrase: 'Your mobile number sum result is Good', locale: lang }),
            res.__({ phrase: 'but try making in to 5(Best), 6(Good), 1(Average)', locale: lang })
        );
    } else {
        mobileNumberSumResult.push(
            res.__({ phrase: 'Your mobile number sum is not Good', locale: lang }),
            res.__({ phrase: 'try to change your number to sum 5(Best), 6(Good), 1(Average)', locale: lang })
        );
    }

    const negativeNums = negativeNumbers(digitAnalysis);
    const negativeNumbersText = negativeNums.length
        ? `${res.__({ phrase: 'Negative Number in your mobile number', locale: lang })} : ${negativeNums.join(', ')}`
        : res.__({ phrase: 'There is no negative number in your mobile number.', locale: lang });

    const triplets = findTriplets(phone);
    const tripletsText = triplets.length
        ? `${res.__({ phrase: 'Pairs of Three found in your mobile number', locale: lang })} : ${triplets.join(', ')}`
        : res.__({ phrase: 'You have no triplets of 1, 3, 5, 6', locale: lang });

    return res.json({
        success: true,
        data: {
            mobileNumber: `${res.__({ phrase: 'Your Mobile Number is', locale: lang })}: ${phone}`,
            mobileNumberSum: `${res.__({ phrase: 'Your mobile number sum is', locale: lang })}: ${mobileNumber}`,
            mobileNumberDescriptions: descriptions[mobileNumber.toString()] || 'No description found',
            individualDigitAnalysis,
            mobileNumberSumResult,
            negativeNumbers: negativeNumbersText,
            pairsOfThree: tripletsText
        },
        message: 'Success!'
    });
};

exports.nameAnalysis = (req, res) => {
    const { name, date, gender, lang = 'en' } = req.query;

    if (!name || !date || !gender) {
        return res.status(400).json({ error: "name, date and gender are required" });
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

    res.json({
        description: "Name Number Description",
        nameNumber: `Your Name number as per Chaldean Numerology is : ${nameNumber}`,
        nameCompatibilityAsPerMoolank: getCompatibilityMessage(nameNumber, driver, 'Moolank'),
        nameCompatibilityAsPerBhagyank: getCompatibilityMessage(nameNumber, conductor, 'Bhagyank'),
        overallNameCompatibilityAsPerMoolankBhagyank: getOverallCompatibility(nameNumber, lucky, neutral, unlucky, 'Name'),

        firstNameNumber: `Your First Name number as per Chaldean Numerology is : ${firstNameNumber}`,
        firstNameCompatibilityAsPerMoolank: getCompatibilityMessage(firstNameNumber, driver, 'Moolank', 'First Name'),
        firstNameCompatibilityAsPerBhagyank: getCompatibilityMessage(firstNameNumber, conductor, 'Bhagyank', 'First Name'),
        overallFirstNameCompatibilityAsPerMoolankBhagyank: getOverallCompatibility(firstNameNumber, lucky, neutral, unlucky, 'First Name'),

        suggestedNameNumber: "Suggested NAME NUMBER (FIRST & FULL NAME) as per your Birthday (Moolank) & Life Path Number (Bhagyank)",
        luckyNumbers: `Favourable Numbers : ${lucky.join(', ')}`,
        neutralNumbers: `Natural Numbers : ${neutral.join(', ')}`,
        unluckyNumbers: `Avoidable Numbers : ${unlucky.join(', ')}`,
        suggestedTotal: suggestedTotal.length > 0
            ? `Suggested name spelling total : ${suggestedTotal.join(', ')}`
            : 'No specific name spelling suggestion.'
    });
};

exports.vehicleAnalysis = (req, res) => {
    const { vehicle, lang = 'en' } = req.query;

    if (!vehicle || !/^\d{4}$/.test(vehicle)) {
        return res.status(400).json({
            success: false,
            message: 'Validation Error',
            errors: ['vehicle must be a 4-digit number']
        });
    }

    const vehicleNumber = calculateVehicleNumber(vehicle);
    const digitAnalysis = analyzeEachNumber(vehicle);
    const individualDigitAnalysis = digitAnalysis.map(item => ({
        digit: `${res.__({ phrase: 'Number', locale: lang })} ${item.digit}`,
        meaning: res.__({ phrase: item.meaning, locale: lang })
    }));

    const descriptions = {
        '1': res.__({ phrase: 'vehicle number 1', locale: lang }),
        '2': res.__({ phrase: 'vehicle number 2', locale: lang }),
        '3': res.__({ phrase: 'vehicle number 3', locale: lang }),
        '4': res.__({ phrase: 'vehicle number 4', locale: lang }),
        '5': res.__({ phrase: 'vehicle number 5', locale: lang }),
        '6': res.__({ phrase: 'vehicle number 6', locale: lang }),
        '7': res.__({ phrase: 'vehicle number 7', locale: lang }),
        '8': res.__({ phrase: 'vehicle number 8', locale: lang }),
        '9': res.__({ phrase: 'vehicle number 9', locale: lang })
    };

    let vehicleNumberSumResult = [];
    if (vehicleNumber == 5) {
        vehicleNumberSumResult.push(res.__({ phrase: 'Your vehicle number sum result is Best', locale: lang }));
    } else if (vehicleNumber == 6 || vehicleNumber == 1) {
        vehicleNumberSumResult.push(res.__({ phrase: 'Your vehicle number sum result is Good', locale: lang }));
    } else if (vehicleNumber == 3) {
        vehicleNumberSumResult.push(
            res.__({ phrase: 'Your vehicle number sum result is Good', locale: lang }),
            res.__({ phrase: 'but try making in to 5(Best), 6(Good), 1(Average)', locale: lang })
        );
    } else {
        vehicleNumberSumResult.push(
            res.__({ phrase: 'Your vehicle number sum is not Good', locale: lang }),
            res.__({ phrase: 'try to change your number to sum 5(Best), 6(Good), 1(Average)', locale: lang })
        );
    }

    const negativeNums = negativeNumbers(digitAnalysis);
    const negativeNumbersText = negativeNums.length
        ? `${res.__({ phrase: 'Negative Number in your vehicle number', locale: lang })} : ${negativeNums.join(', ')}`
        : res.__({ phrase: 'There is no negative number in your vehicle number.', locale: lang });

    const triplets = findTriplets(vehicle);
    const tripletsText = triplets.length
        ? `${res.__({ phrase: 'Pairs of Three found in your vehicle number', locale: lang })} : ${triplets.join(', ')}`
        : res.__({ phrase: 'You have no triplets of 1, 3, 5, 6', locale: lang });

    return res.json({
        success: true,
        data: {
            vehicleNumber: `${res.__({ phrase: 'Your Vehicle Number is', locale: lang })}: ${vehicle}`,
            vehicleNumberSum: `${res.__({ phrase: 'Your vehicle number sum is', locale: lang })}: ${vehicleNumber}`,
            vehicleNumberDescriptions: descriptions[vehicleNumber.toString()] || 'No description found',
            individualDigitAnalysis,
            vehicleNumberSumResult,
            negativeNumbers: negativeNumbersText,
            pairsOfThree: tripletsText
        },
        message: 'Success!'
    });
};

exports.rudrakshaSuggestion = (req, res) => {
    const date = req.query.date; // for GET; use req.body.date for POST

    if (!date || isNaN(Date.parse(date))) {
        return res.status(400).json({
            success: false,
            message: 'Validation Error',
            errors: ['date is required and must be a valid date']
        });
    }

    const zodiac = getZodiacByDate(date);
    const rudraksha = getRudrakshaSuggestion(zodiac);

    const description = [
        'Wearing Rudraksha helps balance cosmic energies.',
        'Each Zodiac has a favorable Rudraksha to enhance well-being.'
    ];

    const data = {
        description: description,
        zodiac: `Your Zodiac: ${zodiac}`,
        rudraksha: `Rudraksha suggestion for you: ${rudraksha} Mukhi Rudraksha`
    };

    return res.status(200).json({
        success: true,
        message: 'Success!',
        data: data
    });
};

const predictions = require('../data/predictions.json');

exports.clothColour = (req, res) => {
    const date = req.query.date; // use req.body.date for POST method

    if (!date || isNaN(Date.parse(date))) {
        return res.status(400).json({
            success: false,
            message: 'Validation Error',
            errors: ['date is required and must be a valid date']
        });
    }

    const radicalNumber = calculateRadicalNumber(date);

    // Assuming lang support (e.g., "en", "hi", etc.)
    const locale = req.query.lang || 'en'; // Optional language query

    const prediction = predictions.find(
        (item) => item.language === locale && item.no === radicalNumber
    );

    if (!prediction) {
        return res.status(404).json({
            success: false,
            message: 'Prediction not found for this radical number and locale.'
        });
    }

    const data = {
        description: "Wearing specific colors aligns your energy with universal vibrations.",
        clothColour: `Cloth color suggestions for you: ${prediction.cloth_colour}`
    };

    return res.status(200).json({
        success: true,
        message: 'Success!',
        data: data
    });
};

exports.watchColour = (req, res) => {
    const date = req.query.date;

    if (!date || isNaN(Date.parse(date))) {
        return res.status(400).json({
            success: false,
            message: 'Validation Error',
            errors: ['date is required and must be a valid date']
        });
    }

    const radicalNumber = calculateRadicalNumber(date);
    const locale = req.query.lang || 'en';

    const prediction = predictions.find(
        (item) => item.language === locale && item.no === radicalNumber
    );

    if (!prediction) {
        return res.status(404).json({
            success: false,
            message: 'Prediction not found for this radical number and locale.'
        });
    }

    const data = {
        watchColour: `Wrist watch color suggestions for you: ${prediction.watch_colour}`,
        wristWatch: `Wrist Watch ${radicalNumber}`
    };

    return res.status(200).json({
        success: true,
        message: 'Success!',
        data: data
    });
};

exports.oilSuggestion = (req, res) => {
    const date = req.query.date;

    if (!date || isNaN(Date.parse(date))) {
        return res.status(400).json({
            success: false,
            message: 'Validation Error',
            errors: ['date is required and must be a valid date']
        });
    }

    const radicalNumber = calculateRadicalNumber(date);
    const locale = req.query.lang || 'en';

    const prediction = predictions.find(
        (item) => item.language === locale && item.no === radicalNumber
    );

    if (!prediction) {
        return res.status(404).json({
            success: false,
            message: 'Prediction not found for this radical number and locale.'
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

    const imageName = images[radicalNumber] || null;
    const imagePath = imageName ? `/front-assets/images/${imageName}` : null;

    const data = {
        title: 'Energy booster remedy',
        description: 'Oiling specific body parts can channel planetary energy for better health.',
        oilSuggestion: `Oil suggestions for you: ${prediction.oil_suggestion}`,
        planet_image: imagePath
    };

    return res.status(200).json({
        success: true,
        message: 'Success!',
        data: data
    });
};

exports.healthAnalysis = (req, res) => {
    const date = req.query.date;

    if (!date || isNaN(Date.parse(date))) {
        return res.status(400).json({
            success: false,
            message: 'Validation Error',
            errors: ['date is required and must be a valid date']
        });
    }

    const radicalNumber = calculateRadicalNumber(date);
    const locale = req.query.lang || 'en';

    const prediction = predictions.find(
        (item) => item.language === locale && Number(item.no) === radicalNumber
    );

    if (!prediction) {
        return res.status(404).json({
            success: false,
            message: 'Prediction not found for this radical number and locale.'
        });
    }

    const data = {
        health: prediction.health,
    };

    return res.status(200).json({
        success: true,
        message: 'Success!',
        data: data
    });
};

exports.marriageRelationship = (req, res) => {
    const date = req.query.date;

    if (!date || isNaN(Date.parse(date))) {
        return res.status(400).json({
            success: false,
            message: 'Validation Error',
            errors: ['date is required and must be a valid date']
        });
    }

    const radicalNumber = calculateRadicalNumber(date);
    const locale = req.query.lang || 'en';

    const prediction = predictions.find(
        (item) => item.language === locale && Number(item.no) === radicalNumber
    );

    if (!prediction) {
        return res.status(404).json({
            success: false,
            message: 'Prediction not found for this radical number and locale.'
        });
    }

    const data = {
        relationship: prediction.relationship,
    };

    return res.status(200).json({
        success: true,
        message: 'Success!',
        data
    });
};

exports.luckyThings = (req, res) => {
    const date = req.query.date;
    const locale = req.query.lang || 'en';

    if (!date || isNaN(Date.parse(date))) {
        return res.status(400).json({
            success: false,
            message: 'Validation Error',
            errors: ['date is required and must be a valid date']
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
        description: 'Lucky Things description',
        luckyThings: {
            numbers: {
                lucky: {
                    label: 'LUCKY NUMBER',
                    value: luckyNumbers.join(', ')
                },
                unlucky: {
                    label: 'UNLUCKY NUMBER',
                    value: unluckyNumbers.join(', ')
                },
                neutral: {
                    label: 'NATURAL NUMBER',
                    value: neutralNumbers.join(', ')
                }
            },
            dates_days: {
                lucky_dates: {
                    label: 'LUCKY DATE',
                    value: luckyDates.join(', ')
                },
                lucky_days: {
                    label: 'LUCKY DAYS',
                    value: radicalPrediction.favourable_day || ''
                }
            },
            colors_directions: {
                colors: {
                    label: 'LUCKY COLORS',
                    value: auspiciousColours
                },
                lucky_direction: {
                    label: 'LUCKY DIRECTION',
                    value: radicalPrediction.Favorable_direction || ''
                },
                main_gate_direction: {
                    label: 'MAIN GATE DIRECTION',
                    value: radicalPrediction.main_gate_direction || ''
                }
            }
        }
    };

    return res.status(200).json({
        success: true,
        message: 'Success!',
        data
    });
};

exports.remedies = (req, res) => {
  const { date, gender } = req.query;

  if (!date || isNaN(Date.parse(date)) || !gender) {
    return res.status(400).json({
      success: false,
      message: 'Validation Error',
      errors: ['date and gender are required and date must be valid']
    });
  }

  const data = getRemedyDescriptions(date, gender, req.__);

  return res.status(200).json({
    success: true,
    message: req.__('Success'),
    data
  });
};

exports.careerAnalysis = (req, res) => {
    const date = req.query.date;

    if (!date || isNaN(Date.parse(date))) {
        return res.status(400).json({
            success: false,
            message: 'Validation Error',
            errors: ['date is required and must be a valid date']
        });
    }

    const radicalNumber = calculateRadicalNumber(date);
    const locale = req.query.lang || 'en';

    const prediction = predictions.find(
        (item) => item.language === locale && Number(item.no) === radicalNumber
    );

    if (!prediction) {
        return res.status(404).json({
            success: false,
            message: 'Prediction not found for this radical number and locale.'
        });
    }

    const data = {
        career: prediction.career || ''
    };

    return res.status(200).json({
        success: true,
        message: 'Success!',
        data
    });
};

exports.moneyAnalysis = (req, res) => {
    const date = req.query.date;

    if (!date || isNaN(Date.parse(date))) {
        return res.status(400).json({
            success: false,
            message: 'Validation Error',
            errors: ['date is required and must be a valid date']
        });
    }

    const radicalNumber = calculateRadicalNumber(date);
    const locale = req.query.lang || 'en';

    const prediction = predictions.find(
        (item) => item.language === locale && Number(item.no) === radicalNumber
    );

    if (!prediction) {
        return res.status(404).json({
            success: false,
            message: 'Prediction not found for this radical number and locale.'
        });
    }

    const data = {
        money: prediction.money || ''
    };

    return res.status(200).json({
        success: true,
        message: 'Success!',
        data
    });
};

exports.jobAnalysis = (req, res) => {
    const date = req.query.date;

    if (!date || isNaN(Date.parse(date))) {
        return res.status(400).json({
            success: false,
            message: 'Validation Error',
            errors: ['date is required and must be a valid date']
        });
    }

    const radicalNumber = calculateRadicalNumber(date);
    const locale = req.query.lang || 'en';

    const prediction = predictions.find(
        (item) => item.language === locale && Number(item.no) === radicalNumber
    );

    if (!prediction) {
        return res.status(404).json({
            success: false,
            message: 'Prediction not found for this radical number and locale.'
        });
    }

    const data = {
        job: prediction.job || ''
    };

    return res.status(200).json({
        success: true,
        message: 'Success!',
        data
    });
};

exports.personalYear = (req, res) => { };

exports.karmicNumber = (req, res) => { };

exports.masterDriver = (req, res) => { };

exports.masterConductor = (req, res) => { };