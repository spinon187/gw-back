const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const routes = require('./routes.js');

const server = express();

server.use(helmet());
server.use(express.json());
server.use(cors({
    credentials: true, origin: true
}));

server.use('/api', routes);

module.exports = server;