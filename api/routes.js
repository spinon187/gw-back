require('dotenv').config();


const express = require('express');
const jwt = require('jsonwebtoken');
const Msg = require('../data/msgModel');
const Uid = require('../data/uidModel');
const Connects = require('../data/conModel');
const auth = require('../middleware/authentication');

const router = express.Router();

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

router.post('/check', auth, (req, res) => {
  // console.log(req.body)
  let sent = {}, to = req.body.to;
  Msg.find({to: to})
  .then(msgs => {
    msgs.forEach(msg => sent[msg.from] = sent[msg.from] ? sent[msg.from] + 1 : 1);
    res.status(200).json(sent);
  })
  .catch(err => res.status(500).send(err))
})

router.post('/msgs', auth, (req, res) => {
  let to = req.body.to;
    Msg.find({to: to})
      .then(msgs => {
        Msg.deleteMany({to: to})
          .then(deleted => res.status(200).json(msgs))
          .catch(err => res.status(500).send(err))
        })
      .catch(err => res.status(500).send(err))
})

router.post('/connections', auth, (req, res) => {
  let to = req.body.to;
  Connects.find({to: to})
    .then(reqs => {
      Connects.deleteMany({to: to})
        .then(deleted => res.status(200).json(reqs))
        .catch(err => res.status(500).send(err))
      })
    .catch(err => res.status(500).send(err))
})

router.post('/reqs', auth, (req, res) => {
  Connects.create(req.body)
    .then(added => res.status(201).json(added))
    .catch(err => res.status(500).send(err))
})

router.post('/send', auth, (req, res) => {
  const body = req.body
  Msg.create(body)
    .then(added => res.status(201).json(added))
    .catch(err => res.status(500).send(err))
})

router.post('/uid', (req, res) => {
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


router.post('/nuke', auth, (req, res) => {
  let uid = req.body.uid;
  let targs = req.body.targs;
  // console.log(req.body);
  // console.log(uid, targs)
  Uid.deleteOne({uid: uid})
    .then(deleted => {
      Msg.deleteMany().or([{to: uid}, {from: uid}])
        .then(deleted2 => {
          targs.forEach(targ =>
            Msg.create({
              to: targ,
              from: uid,
              msg: 'delete',
              nuke: true
            })
              .then(sent => res.status(201).json({nuked: true}))
              .catch(err => res.status(500).send(err))
          )})
        .catch(err => res.status(500).send(err))
    })
    .catch(err => res.status(500).send(err))
})

router.post('/delete', auth, (req, res) => {
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
