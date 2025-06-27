const predictions = require('./data/predictions.json');

function reduceToSingleDigit(num) {
    while (num > 9 && num !== 11 && num !== 22 && num !== 33) {
        num = num.toString().split('').reduce((sum, d) => sum + parseInt(d), 0);
    }
    return num;
}

function calculateRadicalNumber(date) {
    const day = parseInt(date.split('-')[2]);
    return reduceToSingleDigit(day);
}

function calculateDestinyNumber(date) {
    const [year, month, day] = date.split('-');
    const total = [...year, ...month, ...day].reduce((acc, digit) => acc + parseInt(digit), 0);
    return reduceToSingleDigit(total);
}

function calculateKuaNumber(date, gender) {
    const year = parseInt(date.split('-')[0]);
    const lastTwo = year % 100;
    let sum = lastTwo.toString().split('').reduce((s, d) => s + parseInt(d), 0);
    if (sum > 9) sum = sum.toString().split('').reduce((s, d) => s + parseInt(d), 0);

    let kua;
    if (gender.toLowerCase() === 'male') {
        kua = 10 - sum;
        if (year > 2000) {
            kua += 9;
            if (kua > 9) kua = kua.toString().split('').reduce((s, d) => s + parseInt(d), 0);
        }
    } else {
        kua = sum + 5;
        if (year > 2000) kua += 6;
        if (kua > 9) kua = kua.toString().split('').reduce((s, d) => s + parseInt(d), 0);
    }

    if (kua === 5) kua = gender.toLowerCase() === 'male' ? 2 : 8;
    return kua;
}

function extractDigits(date) {
    return date.replace(/[^0-9]/g, '').split('').map(Number);
}

function numenumberget(text) {
    const CHALDEAN = {
        a: 1, b: 2, c: 3, d: 4, e: 5, f: 8, g: 3, h: 5, i: 1,
        j: 1, k: 2, l: 3, m: 4, n: 5, o: 7, p: 8, q: 1, r: 2,
        s: 3, t: 4, u: 6, v: 6, w: 6, x: 5, y: 1, z: 7
    };
    text = text.toLowerCase().replace(/[^0-9a-z]/g, '');
    return reduceToSingleDigit([...text].reduce((sum, l) => sum + (CHALDEAN[l] || parseInt(l) || 0), 0));
}

function calculateCompoundNumber(name) {
    const CHALDEAN = {
        A: 1, B: 2, C: 3, D: 4, E: 5, F: 8, G: 3, H: 5, I: 1,
        J: 1, K: 2, L: 3, M: 4, N: 5, O: 7, P: 8, Q: 1, R: 2,
        S: 3, T: 4, U: 6, V: 6, W: 6, X: 5, Y: 1, Z: 7
    };
    name = name.toUpperCase();
    return [...name].reduce((total, char) => total + (CHALDEAN[char] || 0), 0);
}

function getMonthSumFromDate(date) {
    const month = date.split('-')[1];
    return month.split('').reduce((sum, d) => sum + parseInt(d), 0);
}

function getYearSumFromDate(date) {
    const year = date.split('-')[0];
    let sum = year.split('').reduce((sum, d) => sum + parseInt(d), 0);
    return sum > 9 ? sum.toString().split('').reduce((sum, d) => sum + parseInt(d), 0) : sum;
}

function calculateMobileNumber(phone) {
    const digits = phone.replace(/\D/g, '');
    let sum = digits.split('').reduce((acc, d) => acc + parseInt(d), 0);
    while (sum > 9) {
        sum = sum.toString().split('').reduce((a, d) => a + parseInt(d), 0);
    }
    return sum;
}

function calculateVehicleNumber(vehicle) {
    const digits = vehicle.replace(/\D/g, '');
    let sum = digits.split('').reduce((acc, d) => acc + parseInt(d), 0);
    while (sum > 9) {
        sum = sum.toString().split('').reduce((a, d) => a + parseInt(d), 0);
    }
    return sum;
}

function getWesternZodiacSign(month, day) {
    const zodiac = [
        ['Capricorn', 'Aquarius'],
        ['Aquarius', 'Pisces'],
        ['Pisces', 'Aries'],
        ['Aries', 'Taurus'],
        ['Taurus', 'Gemini'],
        ['Gemini', 'Cancer'],
        ['Cancer', 'Leo'],
        ['Leo', 'Virgo'],
        ['Virgo', 'Libra'],
        ['Libra', 'Scorpio'],
        ['Scorpio', 'Sagittarius'],
        ['Sagittarius', 'Capricorn']
    ];
    const cutoffs = [20, 18, 20, 20, 21, 21, 22, 23, 23, 23, 22, 21];
    return day < cutoffs[month - 1] ? zodiac[month - 1][0] : zodiac[month - 1][1];
}

function loShuGrid(date, gender) {
    const digits = realDigits(date, gender);
    const grid = {};

    for (let i = 1; i <= 9; i++) grid[i] = '';

    digits.forEach(d => {
        if (d >= 1 && d <= 9) grid[d] += d;
    });

    Object.keys(grid).forEach(k => {
        if (grid[k] === '') grid[k] = null;
    });

    return grid;
}

function realDigits(date, gender) {
    const digits = extractDigits(date); // e.g., [1,9,9,2,1,0,0,9]
    const radical = calculateRadicalNumber(date);
    const destiny = calculateDestinyNumber(date);
    const kua = calculateKuaNumber(date, gender);

    return [...digits.map(Number), radical, destiny, kua];
}

function getPlaneDetails({ date, gender, planeDigits, plane, weight }, req) {
    const grid = loShuGrid(date, gender);
    const formatted = `(${planeDigits.join('-')})`;

    const planeValues = planeDigits.map(d => grid[d] || '').filter(Boolean);
    const percentage = Math.floor((planeValues.length / planeDigits.length) * 100);

    return {
        planeName: req.t(`${plane}_plane`).toUpperCase(),
        planeNumber: `${req.t(`${plane}_plane_with_digits`, { digits: formatted })} : ${planeValues.join(', ')}`,
        description: req.t(`${plane}_plane_description`),
        weightage: req.t(`${plane}_plane_weightage`, { [weight]: percentage }),
        percentage
    };
}

function getRealDigits(date, gender) {
    const radical = calculateRadicalNumber(date);
    const destiny = calculateDestinyNumber(date);
    const kua = calculateKuaNumber(date, gender);

    const digits = extractDigits(date).map(Number);
    digits.push(radical, destiny, kua);

    return digits;
}

function analyzeEachNumber(number) {
    const digits = number.replace(/\D/g, '');

    const meaningKeys = {
        1: 'digit_meaning_1',
        2: 'digit_meaning_2',
        3: 'digit_meaning_3',
        4: 'digit_meaning_4',
        5: 'digit_meaning_5',
        6: 'digit_meaning_6',
        7: 'digit_meaning_7',
        8: 'digit_meaning_8',
        9: 'digit_meaning_9'
    };

    const processed = new Set();
    const analysis = [];

    for (const digit of digits) {
        if (!processed.has(digit) && meaningKeys[digit]) {
            analysis.push({ digit, meaning: meaningKeys[digit] });
            processed.add(digit);
        }
    }

    return analysis;
}

function negativeNumbers(digitAnalysis) {
    const negatives = [];
    digitAnalysis.forEach(d => {
        if (['2', '4', '8'].includes(d.digit)) {
            negatives.push(d.digit);
        }
    });
    return negatives;
}

function findTriplets(number) {
    const triplets = ['111', '333', '555', '666'];
    return triplets.filter(triplet => number.includes(triplet));
}

// Helper functions (same logic from Laravel ported to JS)
function findPrediction(no, lang = 'en') {
    return predictions.find(p => p.no == no && p.language == lang);
}

function getChart(prediction) {
    return {
        friend: prediction.favourable_number.split(','),
        neutral: prediction.neutral_numbers.split(','),
        non_friend: prediction.enemy_numbers.split(',')
    };
}

function findCommonFriendNumbers(driver, conductor) {
    return driver.friend.filter(n => conductor.friend.includes(n));
}

function addDriverFriendNeutralConductor(driver, conductor, lucky) {
    driver.friend.forEach(n => {
        if (conductor.neutral.includes(n)) lucky.push(n);
    });
}

function addConductorFriendNeutralDriver(driver, conductor, lucky) {
    conductor.friend.forEach(n => {
        if (driver.neutral.includes(n)) lucky.push(n);
    });
}

function removeNonFriendNumbers(driver, conductor, lucky) {
    return lucky.filter(n => !driver.non_friend.includes(n) && !conductor.non_friend.includes(n));
}

function getUnluckyNumbers(driver, conductor) {
    return [...new Set([...driver.non_friend, ...conductor.non_friend].filter(n => n !== '0'))];
}

function findCommonNeutralNumbers(driver, conductor) {
    return [...new Set([...driver.neutral, ...conductor.neutral])];
}

function excludeFromNeutral(neutral, lucky, unlucky) {
    return neutral.filter(n => !lucky.includes(n) && !unlucky.includes(n));
}

function suggestNameSpellingTotal(lucky, neutral, driver, conductor) {
    const l = [...lucky, ...neutral];
    const d = parseInt(driver);
    const c = parseInt(conductor);
    const suggested = [];

    if (l.includes("5")) suggested.push(5);
    if (l.includes("6") && d !== 3 && c !== 3) suggested.push(6);
    if (l.includes("1") && d !== 8 && c !== 8) suggested.push(1);
    if (l.includes("3") && d !== 6 && c !== 6) suggested.push(3);

    return suggested;
}

function getCompatibilityMessage(number, chart, type, label, t) {
    if (chart.friend.includes(number.toString())) {
        return t('compatibility.great', { label, type });
    } else if (chart.neutral.includes(number.toString())) {
        return t('compatibility.average', { label, type });
    } else {
        return t('compatibility.not_aligned', { label, type });
    }
}

function getOverallCompatibility(number, lucky, neutral, unlucky, label, t) {
    if (lucky.includes(number.toString())) {
        return t('compatibility.great_overall', { label });
    } else if (neutral.includes(number.toString())) {
        return t('compatibility.average_overall', { label });
    } else {
        return t('compatibility.not_aligned_overall', { label });
    }
}

function getSuggestedNameSpellings(suggestedTotal, t) {
    const messages = {
        1: {
            title: t('The name spelling should come to a total of 1'),
            descriptions: [
                t('If 5 and 6 both are available / present in the numeroscope'),
                t('Neither the driver nor conductor number is 8, the name spelling should total 1.'),
            ],
        },
        3: {
            title: t('The name spelling should be considered for a total of 3'),
            descriptions: [
                t('If no.3 is missing in the numeroscope'),
                t('Neither the driver nor conductor number is 6,'),
                t('The person is in a specific profession (field of education, medicine or spirituality), the name spelling should total 3.'),
            ],
        },
        5: {
            title: t('The name spelling should come to a total of 5'),
            descriptions: [
                t('If no.5 is missing in the numeroscope'),
                t('It completes 2 5 8 or 4 5 6 line when added. Changes life'),
            ],
        },
        6: {
            title: t('The name spelling should come to a total of 6'),
            descriptions: [
                t('If no.6 is missing in the numeroscope'),
                t('Neither the driver nor conductor number is 3, the name spelling should total 6.'),
            ],
        },
    };

    const output = [];

    for (const total of suggestedTotal) {
        if (messages[total]) {
            output.push({
                [messages[total].title]: messages[total].descriptions
            });
        }
    }

    return output;
}

function getZodiacByDate(birthDate) {
    const date = new Date(birthDate);
    const month = date.getMonth() + 1;
    const day = date.getDate();

    const zodiacDates = [
        { name: 'Capricorn', start: [12, 22], end: [12, 31] },
        { name: 'Capricorn', start: [1, 1], end: [1, 19] },
        { name: 'Aquarius', start: [1, 20], end: [2, 18] },
        { name: 'Pisces', start: [2, 19], end: [3, 20] },
        { name: 'Aries', start: [3, 21], end: [4, 19] },
        { name: 'Taurus', start: [4, 20], end: [5, 20] },
        { name: 'Gemini', start: [5, 21], end: [6, 20] },
        { name: 'Cancer', start: [6, 21], end: [7, 22] },
        { name: 'Leo', start: [7, 23], end: [8, 22] },
        { name: 'Virgo', start: [8, 23], end: [9, 22] },
        { name: 'Libra', start: [9, 23], end: [10, 22] },
        { name: 'Scorpio', start: [10, 23], end: [11, 21] },
        { name: 'Sagittarius', start: [11, 22], end: [12, 21] }
    ];

    for (let z of zodiacDates) {
        const [startMonth, startDay] = z.start;
        const [endMonth, endDay] = z.end;

        const start = new Date(date.getFullYear(), startMonth - 1, startDay);
        const end = new Date(date.getFullYear(), endMonth - 1, endDay);

        if (startMonth > endMonth) {
            // Range spans new year
            end.setFullYear(end.getFullYear() + 1);
        }

        if (date >= start && date <= end) {
            return z.name;
        }
    }

    return null;
}

function getRudrakshaSuggestion(zodiac) {
    const mapping = {
        Aries: '3',
        Taurus: '6',
        Gemini: '4',
        Cancer: '2',
        Leo: '12',
        Virgo: '1',
        Libra: '8',
        Scorpio: '5',
        Sagittarius: '9',
        Capricorn: '10',
        Aquarius: '7',
        Pisces: '11'
    };

    return mapping[zodiac] || 'No suggestion available';
}

const calculateLuckyDates = (radicalNumber) => {
    const luckyDatesMap = {
        1: [3, 12, 21, 30, 5, 14, 23, 9, 18, 27],
        2: [1, 10, 19, 28],
        3: [1, 10, 19, 28, 7, 16, 25],
        4: [7, 16, 25, 2, 20, 11, 29],
        5: [1, 10, 19, 28],
        6: [5, 14, 23],
        7: [4, 13, 22, 3, 12, 21, 30, 31, 1, 10, 19, 14, 23, 20],
        8: [5, 14, 23],
        9: [1, 10, 19, 28, 5, 14, 23, 3, 12, 21, 30]
    };
    return luckyDatesMap[radicalNumber] || [];
};

const getRemedyDescriptions = (birthDate, gender, t) => {
    const real = realDigits(birthDate, gender);
    const allDigits = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    const missingNumbers = allDigits.filter(num => !real.includes(num));

    const descriptionMap = {
        '1': [
            t('Drink lots of water'),
            t('Offer water to Sun in the mornings.'),
            t('Note: Those who have driver or conductor number as 8, do not offer water to Sun. Lota of tamba / Kum Kum. There is no effect of Kua number.'),
            t('Take blessings of your father or father figure, personally or by mobile or by photo.')
        ],
        '2': [
            t('Wear pearls or crystals and keep a pair of silver Swan statues in the house.'),
            t('Hang pictures of Mountains without any lake, sea, river in the South West corner of the home.'),
            t('Donate white colored items like sugar, rice, white clothes to the beggar.'),
            t('Keep Earthen pot in the Southwest corner of the house.'),
            t("Drink water stored in a silver or copper vessel overnight to enhance the Moon's calming effects."),
            t("Take blessings of your Mother personally or by mobile or by photo.")
        ],
        '3': [
            t('Must wear a Tulsi mala made of five Mukhi Rudraksha.'),
            t('The east side of the house should include scenes of green plants because number three stands for the wood element.'),
            t('Put a tilak on your forehead with saffron'),
            t('Always carry something made of wood (for example, a sandalwood rosary, a wooden bracelet, or a pen).'),
            t('Avoid Rahu Kaal for any important activities or wearing remedies. Check the timing daily.'),
            t('Take blessings from your Guru and always give respect full heartedly.')
        ],
        '4': [
            t('One should wear Tulsi Mala along with Five Mukhi Rudraksha and donate coconut as the fourth number means wood element.'),
            t('Always carry something wooden, such as a pen, bracelet, or keychain.'),
            t('Should wear on lucky date only'),
            t('Check Rahu Kaal daily and avoid important tasks during this time.'),
            t('Keep South-East landscapes lush with vegetation.'),
            t('Must help, support, respect poor needy people by giving them food, water, medicines etc.'),
        ],
        '5': [
            t('Must wear clear crystal (Spatik) bracelet or mala 23 bits, It will cleanse the aura and there will be no negative thoughts.'),
            t('Must wear any shade of green colour daily.'),
            t('Must eat green vegetables.'),
            t('Offer green grass to cow every day, specially on Wednesday.'),
            t('Walk barefoot every morning.'),
            t('Must help, support and respect poor, needy, orphan kids by giving them clothes, food, water, medicines, education, books etc'),
            t('Green Mask / Wear Crystal Mala/ Green Shade/ Hankerchief/Sabji/ Dhaniya/')
        ],
        '6': [
            t('Must wear gold & silver combination metal strap watch.'),
            t('Vibration of metal watch enters body & connects you with the time & vice versa.'),
            t('Spend money for yourself by buying branded clothes, perfumes, accessories etc.')
        ],
        '7': [
            t('Must wear gold metal strap watch.'),
            t('Do lots of religious work like performing puja, giving time and services to religious places, giving donations and providing better infrastructure if possible. Devote yourself in religious activities.')
        ],
        '8': [
            t('On Saturdays, they should refrain from eating non-vegetarian fare and instead fast.'),
            t('Keep an urn of water and crystals in the north-east direction.'),
            t('Donate salty foods to needy people.'),
            t('Give respect to people who are giving services to you such as, liftman, watchman, rickshaw drivers, taxi drivers, sweepers and your employees as well.')
        ],
        '9': [
            t('Must wear red thread on hand always'),
            t('Must wear red colour on Tuesdays.'),
            t('Wear Red clothes / Inner garment'),
            t('Give respect to people who are giving services to you such as, traffic police, army, doctors.'),
        ],
    };

    const remedies = missingNumbers.map((num) => ({
        [t('missing_number_label', { number: num })]: descriptionMap[num.toString()] || [t('no_description_available')]
    }));

    return {
        missingNumbers: missingNumbers.join(','),
        remedies
    };
};

function calculatePersonalYear(birthDay, birthMonth, currentYear) {
    const newDate = `${birthDay}-${birthMonth}-${currentYear}`;
    let sum = [...newDate.replace(/-/g, '')].reduce((acc, digit) => acc + parseInt(digit), 0);

    while (sum > 9) {
        sum = sum.toString().split('').reduce((acc, digit) => acc + parseInt(digit), 0);
    }

    return sum;
}

function calculateMasterNumberByRadical(birthDate) {
    const day = parseInt(birthDate.split('-')[2], 10);
    return reduceToMasterNumber(day);
}

function reduceToMasterNumber(number) {
    while (number > 9 && number !== 11 && number !== 22 && number !== 33) {
        number = number.toString().split('').reduce((sum, digit) => sum + parseInt(digit, 10), 0);
    }
    return number;
}

function calculateMasterDestinyNumber(birthDay, birthMonth, birthYear) {
    const horizontal = digitSum(birthDay) + digitSum(birthMonth) + digitSum(birthYear);
    const vertical = birthDay + birthMonth + birthYear;
    const verticalCompoundSum = digitSum(vertical);
    const verticalSum = reduceToSingleDigit(verticalCompoundSum);

    return {
        horizontal,
        vertical,
        verticalCompoundSum,
        verticalSum
    };
}

function digitSum(number) {
    return number.toString().split('').reduce((acc, digit) => acc + parseInt(digit), 0);
}

module.exports = {
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
};