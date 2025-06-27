const express = require('express');
const i18next = require('i18next');
const i18nextMiddleware = require('i18next-http-middleware');
const Backend = require('i18next-fs-backend');
const setLanguage = require('./middleware/setLanguage');
const path = require('path');

const app = express();
const dotenv = require('dotenv');
dotenv.config();

// i18n config
i18next
    .use(Backend)
    .use(i18nextMiddleware.LanguageDetector)
    .init({
        fallbackLng: 'en',
        preload: ['en', 'hi', 'ka'], // preload all your supported languages
        detection: {
            order: ['querystring', 'header'],
            lookupQuerystring: 'lang'  // read ?lang=hi
        },
        backend: {
            loadPath: path.join(__dirname, '/locales/{{lng}}.json'),
        },
        interpolation: {
            escapeValue: false
        }
    });

app.use(i18nextMiddleware.handle(i18next));
app.use(setLanguage);

const numerologyRoutes = require('./routes/numerology'); // path sahi set karo

app.use(express.json());

app.use(express.static('public'));

// Use API prefix
app.use('/api/numerology', numerologyRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
