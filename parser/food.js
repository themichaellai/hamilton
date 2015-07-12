var factory = function(redis) {
  return function(body, cb) {
    var message = body.Body;
    var parts = message.split(' ');
    if (parts.length > 0 && parts[0] !== 'food') {
      return cb();
    }
    if (parts[1] === 'sub') {
      var restaurantName = parts[2];
      redis.lpush('food:' + restaurantName, body.From, function(err, rep) {
        return cb('you are subscribed for ' + restaurantName);
      });
    } else {
      var restaurantName = parts[1];
      var order = parts.splice(2).join(' ');
      redis.lrange(
        'food:' + restaurantName, 0, -1,
        function(err, foodPeople) {
          // TODO: send texts to foodPeople
          console.log('notifying', foodPeople);
          return cb('you are in the queue for ' + restaurantName + ' at position ' + 1 + '!');
      });
    }
  };
};

module.exports = factory;
