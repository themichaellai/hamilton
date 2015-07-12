var config = require('../config');
var _ = require('underscore');
var Subscriber = require('../models/subscriber');
var twilio = require('twilio')(config.TWILIO.SID, config.TWILIO.AUTH);
var async = require('async');

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
        var texts = _.map(foodPeople, function(person) {
          return function(cb) {
            twilio.sms.messages.create({
              to: person.phoneNumber,
              from: config.TWILIO.NUMBER,
              body: 'Received order: ' + order,
            }, function(err, text) {
              if (err) return cb(err);
              return cb(null, text);
            });
          };
        });
        async.parallel(texts, function(err) {
          return cb('you are in the queue for ' + restaurantName + '!');
        });
      });
    }
  };
};

module.exports = factory;
