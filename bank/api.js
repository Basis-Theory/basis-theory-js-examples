const { BasisTheory } = require('@basis-theory/basis-theory-js');
const express = require('express');

const SERVER_KEY = 'key_CYesZCWsn3NB7eC6f1ktkc';
const REACTOR_ID = '4738430b-dcf7-4039-92fc-eb50901d7d90';
const CUSTOMER_ID = '4724f7af-f70a-4209-bf4e-b08330a522ab';

const bt = new BasisTheory();
const router = express.Router();

bt.init(SERVER_KEY);

const executeDwollaReactor = async (tokenId) => {
  const reactionToken = await bt.atomicBanks.react(tokenId, {
    reactorId: REACTOR_ID,
    requestParameters: {
      CUSTOMER_ID,
      FUNDING_SOURCE_NAME: 'Guide Funding Source',
      BANK_ACCOUNT_TYPE: 'checking',
    },
  });

  return reactionToken.raw.id;
};

router.post('/fund', async (req, res) => {
  const cardTokenId = req.body.bank_token_id;

  try {
    await executeDwollaReactor(cardTokenId);

    return res.json({ success: true });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);

    return res.json({ success: false });
  }
});

module.exports = { bankApi: router };
