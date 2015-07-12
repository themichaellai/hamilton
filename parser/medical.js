var _ = require('underscore');
var Subscriber = require('../models/subscriber');
var config = require('../config');
var twilio = require('twilio')(config.TWILIO.SID, config.TWILIO.AUTH);
var async = require('async');


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
      if (parts.length < 3) {
        return cb('med arguments are wrong');
      }
      var lat = parts[1]
      var lng = parts[2]
      var message;
      var locationEnabled;
      if (_.isNaN(lat) || _.isNaN(lng)) {
        locationEnabled = false;
        message = parts.splice(1).join(' ');
      } else {
        locationEnabled = true;
        var url = 'http://maps.google.com/?ie=UTF8&hq=&ll=' + lat + ',' + lng + '&z=13';
        message = parts.splice(3).join(' ') + ' ' + url;
      }
      Subscriber.find({
        resource: 'med',
      }, function(err, medPeople) {
        // TODO: send texts to medPeople
        var texts = _.map(medPeople, function(person) {
          return function(cb) {
            twilio.sms.messages.create({
              to: person.phoneNumber,
              from: config.TWILIO.NUMBER,
              body: message,
            }, function(err, text) {
              if (err) return cb(err);
              return cb(null, text);
            });
          };
        });
        async.parallel(texts, function(err) {
          return cb('help is on the way!');
        });
      });
    }
  };
};

module.exports = factory;
