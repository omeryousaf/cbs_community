const path = require('path');
const config = require(path.join(global.appRoot, '/nodejs_config/config.js'));

module.exports = {
    isLoggedIn: (req, res, next) => {
        if (req.user && req.user._id) {
            return next();
        }
        return res.status(config.App.httpStatuses.SESSION_EXPIRED).send();
    }
};