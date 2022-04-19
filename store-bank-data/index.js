const { BasisTheory } = require('@basis-theory/basis-theory-js');
const express = require('express');

const app = express();

const port = 3000;

let account;
let basisTheory;

app.use(express.json());

app.get("/", (req, res) => {
  res.send(`<h2>Store bank data API example</h2>
    <p>The API exposes /create, /get and /get_mask endpoints. Below are the curl commands to call them.</p> 
    <h3>Create bank token</h3>
    <code>curl --location --request POST 'http://localhost:3000/create' \
    --header 'Content-Type: application/json' \
    --data-raw '{
        "routingNumber": "021000021",
        "accountNumber": "1234567891099"
    }'</code>
    <h3>Get raw bank data</h3>
    <code>curl --location --request GET 'http://localhost:3000/get'</code>
    <h3>Get masked bank data</h3>
    <code>curl --location --request GET 'http://localhost:3000/get_mask'</code>
  `);
});

app.get("/get_mask", (req, res) => {
  res.send(JSON.stringify(account.data) + "\n");
});

app.get("/get", async (req, res) => {
  if (!account) {
    return res.status(404).send();
  }

  const bankToken = await basisTheory.tokens.retrieve(account.id);

  return res.send(JSON.stringify(bankToken.data) + "\n");
});

app.post("/create", async (req, res) => {
  const { accountNumber, routingNumber } = req.body;

  const bankToken = await basisTheory.tokens.create({
    type: 'bank',
    data: {
      routingNumber,
      accountNumber
    }
  });

  account = bankToken;

  res.send("Bank token created \n");
});

app.listen(port, async () => {
  basisTheory = await new BasisTheory().init('key_KiS9dUs6km3XEKo8ETWVSm');

  // eslint-disable-next-line no-console
  console.log(`Example app listening at http://localhost:${port}`);
});
