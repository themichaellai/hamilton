var express = require('express');
var router = express.Router();
var config = require('../config');
var twilio = require('twilio');
var parser = require('../parser');

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/smstest', function(req, res) {
  parser(req.body, function(message) {
    return res.send(message);
  });
});

router.post('/sms', twilio.webhook(config.TWILIO.AUTH), function(req, res) {
  var resMessage = parser(req.body, function(message) {
    var twiml = new twilio.TwimlResponse();
    twiml.message(message);
    console.log('sending: "' + message + '" to ' + req.body.From);
    res.send(twiml)
  });
});

module.exports = router;

//{ ToCountry: 'US',
//  ToState: 'NC',
//  SmsMessageSid: 'SMf6a35bf42ad156861d2697f41770678f',
//  NumMedia: '0',
//  ToCity: 'SNOW CAMP',
//  FromZip: '27614',
//  SmsSid: 'SMf6a35bf42ad156861d2697f41770678f',
//  FromState: 'NC',
//  SmsStatus: 'received',
//  FromCity: 'CHAPEL HILL',
//  Body: 'Hung dress link ft',
//  FromCountry: 'US',
//  To: '',
//  ToZip: '27258',
//  MessageSid: 'SMf6a35bf42ad156861d2697f41770678f',
//  AccountSid: 'AC4c9f0c7869afbfd14230a0d58cc5e72b',
//  From: '',
//  ApiVersion: '2010-04-01' }
