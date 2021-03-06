var async = require('async');
var _ = require('underscore');
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/hamilton');

var medical = require('./medical');
var uber = require('./uber');
var food = require('./food');

var parser = function(message, parserCb) {
  var funs = _.map([
    medical,
    uber,
    food,
  ], function(method) {
    return function(cb) {
      method(mongoose)(message, function(resText) {
        if (_.isUndefined(resText)) {
          return cb();
        } else {
          return cb('ok', resText);
        }
      });
    };
  });
  async.waterfall(funs, function(err, resText) {
    if (_.isUndefined(resText)) {
      return parserCb('Invalid command.');
    } else {
      return parserCb(resText);
    }
  });
};

module.exports = parser;
