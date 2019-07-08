const express = require('express');
const app = express();
const server = app.listen(3005, () => console.log('sunucu çalıştı.'));
const initializeSocketIO = require('./socketio');

initializeSocketIO(server);