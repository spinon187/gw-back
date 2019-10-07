const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const uidModel = new Schema(
  {
    uid: {type: String, index: true, unique: true}
  }, {
    timestamps: {createdAt: 'created'}
  },
  
)
module.exports = mongoose.model('Uid', uidModel)