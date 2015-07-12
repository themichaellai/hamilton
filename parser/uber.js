var _ = require('underscore');
var async = require('async');
var qs = require('querystring');
var request = require('request');
var uberLogin = require('../scripts/uber_login.js');
var Auth = require('../models/auth.js');


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
    } else if (parts.length === 3) {
      var lat = parseFloat(parts[1]);
      var lng = parseFloat(parts[2]);
      async.waterfall([
        function(cb) {
          Auth.findOne({phoneNumber: body.From}, function(err, auth) {
            if (err) {
              cb(err);
            } else if (!auth) {
              cb('uber error', 'you must authenticate first for ' + body.From);
            } else {
              cb(err, auth);
            }
          });
        },
        function(auth, cb) {
          var query = qs.stringify({
            latitude: lat,
            longitude: lng,
          });
          request.get({
            url: 'https://sandbox-api.uber.com/v1/products?' + query,
            headers: {
              'Authorization': 'Bearer ' + auth.accessToken,
            },
          }, function(err, reqRes, body) {
            if (reqRes.statusCode === 200) {
              var body = JSON.parse(body);
              var uberXId = _.first(_.filter(body.products, function(product) {
                return product.display_name === 'uberX';
              }));
              if (uberXId) {
                uberXId = uberXId.product_id;
              } else {
                console.log(query);
                console.log(body);
                return cb('uber error', 'could not retrieve product list');
              }
              cb(null, auth, uberXId);
            } else {
              console.log(body);
              console.log(query);
              cb('uber error', 'could not retrieve product list');
            }
          });
        },
        function(auth, productId, cb) {
          request.post({
            url: 'https://sandbox-api.uber.com/v1/requests',
            json: {
              product_id: productId,
              start_latitude: lat,
              start_longitude: lng,
              end_latitude: lat + 0.005,
              end_longitude: lng + 0.005,
            },
            headers: {
              'Authorization': 'Bearer ' + auth.accessToken,
            },
          }, function(err, reqRes, body) {
            if (reqRes.statusCode === 200 || reqRes.statusCode === 202) {
              return cb(null, auth, body.request_id);
            } else {
              console.log(reqRes.statusCode, body);
              if ('message' in body) {
                return cb('uber error', body.message);
              } else {
                var errors = body.errors.map(function(e) {
                  return e.title;
                }).join(', ');
                return cb('uber error', errors);
              }
            }
          });
        },
        function(auth, requestId, cb) {
          request.get({
            url: 'https://sandbox-api.uber.com/v1/requests/' + requestId + '/map',
            headers: {
              'Authorization': 'Bearer ' + auth.accessToken,
            },
          }, function(err, reqRes, body) {
            if (reqRes.statusCode === 200) {
              return cb(err, JSON.parse(body).href);
            } else {
              // Ignore failure, trip id might be OK enough for demo purposes
              return cb(null, requestId);
            }
          });
        }
      ], function(err, uberRes) {
        if (err === 'uber error') {
          return cb('there was a problem requesting your uber, ' + uberRes);
        } else if (err) {
          console.log(err);
          return cb('there was a problem requesting your uber');
        }
        return cb('your uber is on the way! ' + uberRes);
      });
    } else {
      return cb('no coordinates specified');
    }
  };
};

module.exports = factory;
