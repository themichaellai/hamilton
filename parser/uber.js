var uberLogin = require('../scripts/uber_login.js');
var factory = function(mongoose) {
  return function(body, cb) {
    var message = body.Body;
    var parts = message.split(' ');
    if (parts.length > 0 && parts[0] !== 'uber') {
      return cb();
    }

    if (parts[1] === 'auth') {
      var username = parts[2];
      var password = parts[3];
      var phone = body.From;
      uberLogin(username, password, phone, function() {
        return cb('you are authed!');
      });
    } else {
      return cb('your uber is on the way!');
    }
  };
};

module.exports = factory;
