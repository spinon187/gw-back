const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const msgModel = new Schema({
  from: {type: String, index: true},
  to: {type: String, index: true},
  msg: {type: String},
  key: {type: String, default: null},
  me: {type: String, default: null},
  you: {type: String, default: null},
  created: {type: Date, default: Date.now},
  nuke: {type: Boolean, default: false},
  partial: {type: Boolean, default: false},
  request: {type: Boolean, default: false},
  accept: {type: Boolean, default: false}
})
module.exports = mongoose.model('Msg', msgModel)