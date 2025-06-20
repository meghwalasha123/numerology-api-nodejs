// middleware/verifyUser.js
module.exports = function (req, res, next) {
    const apiKey = req.headers.key;
    if (apiKey && apiKey === '123456') {
        next();
    } else {
        return res.status(401).json({ status: 401, message: 'API key is required' });
    }
};
