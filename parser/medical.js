var medical = function(message, cb) {
  var parts = message.split(' ');
  if (parts.length > 0 && parts[0] !== 'med') {
    return cb();
  }
  return cb('help is on the way!');
};

module.exports = medical;
