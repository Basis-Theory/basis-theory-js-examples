const { bankApi } = require('./api');
const express = require('express');

const app = express();

app.use('/', express.static('public'));

app.use(express.json());

app.use('/api', bankApi);

app.listen(3000);
