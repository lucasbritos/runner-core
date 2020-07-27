const winston = require('winston');
const param = require('./parseParam')();

const logger = winston.createLogger({
  level: param.logLevel,
  format: winston.format.json(),
  timestamp: true,
  defaultMeta: { },
  transports: [
    //
    // - Write all logs with level `error` and below to `error.log`
    // - Write all logs with level `info` and below to `combined.log`
    //
    new winston.transports.File({ filename: 'log/runner.log' }),
  ],
});
 
//
// If we're not in production then log to the `console` with the format:
// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
//
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({format: winston.format.simple(),'timestamp':true  }));
}

module.exports=logger;