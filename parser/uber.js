var factory = function(redis) {
  return function(body, cb) {
    var message = body.Body;
    var parts = message.split(' ');
    if (parts.length > 0 && parts[0] !== 'uber') {
      return cb();
    }
    return cb('your uber is on the way!');
  };
};

module.exports = factory;
