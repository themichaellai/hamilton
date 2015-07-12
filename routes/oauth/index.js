var async = require('async');
var express = require('express');
var router = express.Router();
var request = require('request');
var config = require('../../config');
var Auth = require('../../models/auth');

router.get('/uber/return', function(req, res, next) {
  data = {
    form: {
      client_id: config.UBER.CLIENT_ID,
      client_secret: config.UBER.SECRET,
      grant_type: 'authorization_code',
      code: req.query.code,
      redirect_uri: 'https://5b42fa84.ngrok.com/oauth/uber/return',
    }
  };
  request.post('https://login.uber.com/oauth/token', data, function(err, reqRes, body) {
    var body = JSON.parse(body);
    var auth = new Auth({
      phoneNumber: req.query.state,
      access_token: body.access_token,
    });
    auth.save(function(err) {
      return res.sendStatus(200);
    });
  });
});

module.exports = router;
