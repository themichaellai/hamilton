var Subscriber = require('../models/subscriber');

var factory = function(mongoose) {
  return function(body, cb) {
    var message = body.Body;
    var parts = message.split(' ');
    if (parts.length > 0 && parts[0] !== 'food') {
      return cb();
    }
    if (parts[1] === 'sub') {
      var restaurantName = parts[2];
      var subscriber = new Subscriber({
        phoneNumber: body.From,
        resource: 'food:' + restaurantName,
      });
      subscriber.save(function(err, res) {
        return cb('you are subscribed for ' + restaurantName);
      });
    } else {
      var restaurantName = parts[1];
      var order = parts.splice(2).join(' ');
      Subscriber.find({
        resource: 'food:' + restaurantName,
      }, function(err, foodPeople) {
        // TODO: send texts to foodPeople
        console.log('notifying', foodPeople);
        return cb('you are in the queue for ' + restaurantName + ' at position ' + 1 + '!');
      });
    }
  };
};

module.exports = factory;
