const express = require('express');
const initializeSocketIO = require('./socketio');

const app = express();
const server = app.listen(3005, () => console.log('sunucu çalıştı.'));

initializeSocketIO(server);