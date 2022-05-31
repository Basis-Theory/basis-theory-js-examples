const { cardApi } = require('./api');
const express = require('express');

const app = express();

app.use('/', express.static('public'));

app.use(express.json());

app.use('/api', cardApi);

app.listen(3000);
