require('dotenv').config();

const express = require('express');
const jwt = require('jsonwebtoken');
const Msg = require('../data/msgModel');
const Uid = require('../data/uidModel');

const router = express.Router();

router.get('/:to', (req, res) => {
  Msg.find({to: req.params.to})
    .then(msgs => {
      let sent = {};
      msgs.forEach(msg => sent[msg.from] = sent[msg.from] ? sent[msg.from] + 1 : 1);
      res.status(200).json(sent)
    })
    .catch(err => res.status(500).send(err))
})

router.get('/:to/:from', (req, res) => {
  const body = req.params;
  Msg.find({to: body.to, from: body.from})
    .then(msgs => {
      Msg.deleteMany({to: body.to, from: body.from})
        .then(deleted => res.status(200).json(msgs))
        .catch(err => res.status(500).send(err))
      })
    .catch(err => res.status(500).send(err))
})

router.post('/send', (req, res) => {
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
        Uid.create({uid: req.body.uid})
          .then(added => res.status(201).json({reg: true, uid: added.uid}))
          .catch(err => res.status(500).send(err))
      }
    })
    .catch(err => res.status(500).send(err))
})



// router.delete('/:to/:from', (req, res) => {
//   const body = req.params;
//   Msg.deleteMany({to: body.to, from: body.from})
//     .then(deleted => res.status(200).json(deleted))
//     .catch(err => res.status(500).send(err))
// })

module.exports = router;
