require('dotenv').config();


const express = require('express');
const jwt = require('jsonwebtoken');
const Msg = require('../data/msgModel');
const Uid = require('../data/uidModel');
const auth = require('../middleware/authentication');

const router = express.Router();

router.use((req, res, next) => {
  res.setHeader('Expires', '-1');
  res.setHeader('Cache-Control', 'no-store, must-revalidate, no-cache');
  next()
})

function generateToken(id){
  // let phrase = new Uint32Array();
  // window.crypto.getRandomValues(phrase);
  const payload = {id: id};

  const options = {
      expiresIn: '7d'
  }
  // console.log(payload)
  return jwt.sign(payload, process.env.TOKEN_SECRET, options)
}

router.post('/msgs/:cachebuster/', auth, (req, res) => {
  let to = req.body.to;
    Msg.find({to: {$in: to}})
      .then(msgs => {
        Msg.deleteMany({to: {$in: to}})
          .then(deleted => res.status(200).json(msgs))
          .catch(err => res.status(500).send(err))
        })
      .catch(err => res.status(500).send(err))
})

router.post('/send/:cachebuster/', auth, (req, res) => {
  const body = req.body
  Msg.create(body)
    .then(added => res.status(201).json(added))
    .catch(err => res.status(500).send(err))
})

router.post('/uid/:cachebuster/', (req, res) => {
  Uid.find({uid: req.body.uid})
    .then(found => {
      if(found.length == 1) res.send({reg: false});
      else {
        token = generateToken(req.body.uid);
        Uid.create({uid: req.body.uid})
          .then(added => {
            res.status(201).json({reg: true, uid: added.uid, serverToken: token})
          })
          .catch(err => res.status(500).send(err))
      }
    })
    .catch(err => res.status(500).send(err))
})


router.post('/nuke/:cachebuster/', auth, (req, res) => {
  let targs = req.body, uid = targs[targs.length-1].from, self = targs.map(obj => obj.from);
  Uid.deleteOne({uid: uid})
    .then(deleted => {
      Msg.deleteMany().or([{to: {$in: self}}, {from: {$in: self}}])
        .then(deleted2 => {
          targs.forEach(targ =>{
            if(targ.to) Msg.create({
              to: targ.to,
              from: targ.from,
              msg: 'delete',
              nuke: true
            })
          })
        })
          .then(sent => res.status(201).json({nuked: true}))
          .catch(err => res.status(500).send(err))
        .catch(err => res.status(500).send(err))
    })
    .catch(err => res.status(500).send(err))
})

router.post('/delete/:cachebuster/', auth, (req, res) => {
  const body = req.body;
  console.log(body);
  Msg.deleteMany().or([{to: body.to, from: body.from}, {from: body.to, to: body.from}])
    .then(deleted => 
      Msg.create({
        to: body.to,
        from: body.from,
        msg: 'delete',
        nuke: true
      })
        .then(sent => res.status(200).json({nuked: true, targeted: body.to})))
        .catch(err => res.status(500).send(err))      
    .catch(err => res.status(500).send(err))
})

module.exports = router;
