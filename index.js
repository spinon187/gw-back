
const server = require('./api/server.js');
// const MongoClient = require('mongodb').MongoClient;
const mongoose = require('mongoose');

const port = process.env.PORT || 7777;
mongoose.connect(`mongodb+srv://${process.env.DBUN}:${process.env.DBPW}@cluster0-jdect.mongodb.net/test?retryWrites=true&w=majority`, { useNewUrlParser: true, useUnifiedTopology: true },(err, client) => {
  if(err) return console.log(err);
  // db = client.db('spectest');
  server.listen(port, () => console.log(`Main screen turn on ${port}`));
})

