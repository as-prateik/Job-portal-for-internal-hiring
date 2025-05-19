const fs = require('fs');

let requestLogger = (req, res, next) => {
    let logMessage = "" + new Date() + " " + req.method + " " + req.url + "\n";
    fs.appendFile('./loggerFiles/requestLogger.txt', logMessage, (err) => {
        if (err) return next(err);
        else next();
    });
}


module.exports = requestLogger;