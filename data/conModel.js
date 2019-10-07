const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const conModel = new Schema({
  from: {type: String, index: true},
  to: {type: String, index: true},
  key: {type: String},
  created: {type: Date, default: Date.now},
  request: {type: Boolean, default: false},
  accept: {type: Boolean, default: false},
  aliases: {type: String, default: null}
})
module.exports = mongoose.model('Connects', conModel)