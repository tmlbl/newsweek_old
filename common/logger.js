var winston = require('winston');

global.logger = new (winston.Logger)({
  transports: [
    new (winston.transports.Console)({ level: 'debug' }),
    new (winston.transports.File)({ filename: 'somefile.log' })
  ]
});
