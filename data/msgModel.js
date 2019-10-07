const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const msgModel = new Schema({
  from: {type: String, index: true},
  to: {type: String, index: true},
  msg: {type: String},
  created: {type: Date, default: Date.now},
  nuke: {type: Boolean, default: false},
})
module.exports = mongoose.model('Msg', msgModel)