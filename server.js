//Set directory path to web files
const WEB = `${__dirname}/web`;

//Bring in node packages
var express = require('express');
var app = express();
var winston = require('winston');
var colors = require('colors');
var nconf = require('nconf');

//Create time formatter to log time
const tsFormat = () => (new Date()).toLocaleTimeString();

//Create winston logger and have it log 'info' level and higher to both console and file
const logger = new (winston.Logger)({
  transports: [
    //Console output
    new (winston.transports.Console)({
      timestamp: tsFormat,
      colorize: true,
      level: 'info'
    }),
    //Logfile output
    new (winston.transports.File)({
      filename: `LogFile.log`,
      timestamp: tsFormat,
      level: 'info'
    })
  ]
});

//Have Nconf go from argument, to environment variable, to configFile.json
nconf.argv()
  .env()
  .file({ file: `${WEB}/configFile.json` });

//Serve static files
app.use(express.static(WEB))

//Handle successful requests to root and log them
app.get(`/`, function (req, res) {
    res.status(200).sendFile(`${WEB}/Index.html`);
    logger.info('Successful request to root.'.blue);
});

//Handle 404 errors and log them
app.get(`*`, function (req, res) {
    res.status(404).sendFile(`${WEB}/404.html`);
    logger.warn('Attempt to view non-existent page.'.yellow);
});

//Start server and log that it has started
app.listen(8080, function () {
    logger.info('Listening on port '.blue + (String)(nconf.get("port")).underline.blue);
});
