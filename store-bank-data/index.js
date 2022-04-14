const { BasisTheory } = require('@basis-theory/basis-theory-js');
const express = require('express');

const app = express();

const port = 3000;

let account;
let basisTheory;

app.use(express.json());

app.get('/get_mask', (req, res) => {
  res.send(account.data);
});

app.get('/get', async (req, res) => {
  if (!account) {
    return res.status(404).send();
  }

  const bankToken = await basisTheory.tokens.retrieve(account.id);

  return res.send(bankToken.data);
});

app.post('/create', async (req, res) => {
  const { accountNumber, routingNumber } = req.body;

  const bankTokenResponse = await basisTheory.tokens.create({
    type: 'bank',
    data: {
      routingNumber,
      accountNumber,
    }
  });

  account = bankTokenResponse;

  res.send();
});

app.listen(port, async () => {
  basisTheory = await new BasisTheory().init('key_KiS9dUs6km3XEKo8ETWVSm');

  // eslint-disable-next-line no-console
  console.log(`Example app listening at http://localhost:${port}`);
});
