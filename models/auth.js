var mongoose = require('mongoose');

var Auth = mongoose.model('Auth', mongoose.Schema({
  phoneNumber: String,
  access_token: String,
}));

module.exports = Auth;
