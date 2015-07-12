var mongoose = require('mongoose');

var Subscriber = mongoose.model('Subscriber', mongoose.Schema({
  phoneNumber: String,
  resource: String,
}));

module.exports = Subscriber;
