var uber = function(message, cb) {
  var parts = message.split(' ');
  if (parts.length > 0 && parts[0] !== 'uber') {
    return cb();
  }
  return cb('your uber is on the way!');
};

module.exports = uber;
