const { cardApi } = require('./card/api');
const express = require('express');

const app = express();

app.use('/card', express.static('card/public'));
app.use('/bank', express.static('bank/public'));
app.use('/shared', express.static('shared/public'));

app.use(express.json());

app.use('/api/card', cardApi);

app.listen(3000);
