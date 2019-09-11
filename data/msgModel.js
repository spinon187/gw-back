const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const msgModel = new Schema({
  from: {type: String},
  to: {type: String, index: true},
  msg: {type: String},
}, {
  timestamps: {createdAt: 'created'}
}
)
module.exports = mongoose.model('Msg', msgModel)