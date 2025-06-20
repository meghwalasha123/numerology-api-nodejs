const express = require('express');
const i18n = require('i18n');
const path = require('path');

const app = express();
const dotenv = require('dotenv');
dotenv.config();

// i18n config
i18n.configure({
    locales: ['en', 'hi', 'ka'],
    defaultLocale: 'en',
    queryParameter: 'lang', // read ?lang=en from URL
    directory: path.join(__dirname, 'locales'),
    autoReload: true,
    objectNotation: true
});

app.use(i18n.init);

const numerologyRoutes = require('./routes/numerology'); // path sahi set karo

app.use(express.json());

app.use(express.static('public'));

// Use API prefix
app.use('/api/numerology', numerologyRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
