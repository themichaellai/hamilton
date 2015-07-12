var food = function(message, cb) {
  var parts = message.split(' ');
  if (parts.length > 0 && parts[0] !== 'food') {
    return cb();
  }
  var position = 1;
  var restaurantName = parts.slice(1).join(' ');
  return cb('you are in the queue for ' + restaurantName + ' at position ' + 1 + '!');
};

module.exports = food;
