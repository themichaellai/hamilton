var mongoose = require('mongoose');

var Auth = mongoose.model('Auth', mongoose.Schema({
  phoneNumber: String,
  accessToken: String,
}));

module.exports = Auth;
