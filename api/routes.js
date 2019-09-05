require('dotenv').config();

const express = require('express');
const db = require('../data/functions.js');
const jwt = require('jsonwebtoken');
const Msg = require('../data/msgModel');

const router = express.Router();

router.get('/:to/:from', (req, res) => {
  const body = req.params;
  Msg.find({to: body.to, from: body.from})
    .then(msgs => res.status(200).json(msgs))
    .catch(err => res.status(500).send(err))
})

router.post('/send', (req, res) => {
  const body = req.body
  Msg.create(body)
    .then(added => res.status(201).json(added))
    .catch(err => res.status(500).send(err))
})

router.delete('/:to/:from', (req, res) => {
  const body = req.params;
  Msg.deleteMany({to: body.to, from: body.from})
    .then(deleted => res.status(200).json(deleted))
    .catch(err => res.status(500).send(err))
})

module.exports = router;
