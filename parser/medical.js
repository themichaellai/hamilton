var Subscriber = require('../models/subscriber');

var factory = function(mongoose) {
  return function(body, cb) {
    var message = body.Body;
    var parts = message.split(' ');
    if (parts.length > 0 && parts[0] !== 'med') {
      return cb();
    }
    if (parts[1] === 'sub') {
      var subscriber = new Subscriber({
        phoneNumber: body.From,
        resource: 'med',
      });
      subscriber.save(function(err, res) {
        return cb('you are subscribed for all med requests');
      });
    } else {
      var order = parts.splice(1).join(' ');
      Subscriber.find({
        resource: 'med',
      }, function(err, medPeople) {
        // TODO: send texts to medPeople
        return cb('help is on the way!');
      });
    }
  };
};

module.exports = factory;
