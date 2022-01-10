const { BasisTheory } = require('@basis-theory/basis-theory-js');
const express = require('express');

const app = express();

const port = 3000;

let account;
let basisTheory;

app.use(express.json());

app.get('/get_mask', (req, res) => {
  res.send(account.bank);
});

app.get('/get', async (req, res) => {
  if (!account) {
    return res.status(404).send();
  }

  const atomicBank = await basisTheory.atomicBanks.retrieve(
    account.id
  );

  res.send(atomicBank.bank);
});

app.post('/create', async (req, res) => {
  const { accountNumber, routingNumber } = req.body;

  const atomicBank = await basisTheory.atomicBanks.create({
    bank: {
      routingNumber,
      accountNumber,
    },
  });

  account = atomicBank;

  res.send();
});

app.listen(port, async () => {
  basisTheory = await new BasisTheory().init('key_KiS9dUs6km3XEKo8ETWVSm');

  // eslint-disable-next-line no-console
  console.log(`Example app listening at http://localhost:${port}`);
});
