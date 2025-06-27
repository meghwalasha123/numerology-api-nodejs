// middlewares/setLanguage.js
module.exports = function setLanguage(req, res, next) {
    const lang = req.query.lang || 'en'; // Default to 'en' if not provided
    if (req.i18n) {
        req.i18n.changeLanguage(lang);
    }
    next();
};
