var express = require('express');
var router = express.Router();
var config = require('../config');
var twilio = require('twilio');
var parser = require('../parser');

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/smstest', function(req, res) {
  var command = req.body.command;
  parser(command, function(message) {
    return res.send(message);
  });
});

router.post('/sms', twilio.webhook(config.TWILIO_AUTH), function(req, res) {
  var resMessage = parser(req.body.Body);
  var twiml = new twilio.TwimlResponse();
  twiml.message('your message was: ' + req.body.Body);
  res.send(twiml)
});

module.exports = router;
