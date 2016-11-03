/**
 * Created by wizard on 10/26/16.
 */

const logger = require('tracer').colorConsole();
logger.str = function (obj) {
    return JSON.stringify(obj, null, '  ');
};
module.exports = logger;