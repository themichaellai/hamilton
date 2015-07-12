var Nightmare = require('nightmare');
var nightmare = new Nightmare();
var config = require('../config');

var login = function(username, password, phoneNumber, cb) {
  nightmare
    .goto('https://login.uber.com/oauth/authorize?client_id=' + config.UBER.CLIENT_ID + '&response_type=code&state=' + phoneNumber)
    .type('input#email', username)
    .type('input#password', password)
    .click('button')
    .wait()
    .evaluate(function() {
      return window.location.href;
    }, function(res) {
      console.log(res);
    })
    .click('button[value="yes"]')
    .wait()
    .evaluate(function() {
      return window.location.href;
    }, function(res) {
      console.log(res);
    })
    .run(function(err, nightmare) {
      if (err) console.log(err);
      return cb();
    })
}

if (!module.parent) {
  var username = process.argv[2];
  var password = process.argv[3];
  var phone = process.argv[4];
  login(username, password, phone, function() {
    console.log('done');
  });
}

module.exports = login;
