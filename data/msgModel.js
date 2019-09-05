const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const msgModel = new Schema({
  from: {type: String},
  to: {type: String},
  msg: {type: String},
})
module.exports = mongoose.model('Msg', msgModel)