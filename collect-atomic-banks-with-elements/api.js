const { BasisTheory } = require('@basis-theory/basis-theory-js');
const express = require('express');

const SERVER_KEY = 'key_CYesZCWsn3NB7eC6f1ktkc';
const REACTOR_ID = 'f066ba30-1398-4269-837a-5ac70d8a3ba6';

const bt = new BasisTheory();
const router = express.Router();

bt.init(SERVER_KEY);

const executeSpreedlyReactor = async ({ bankTokenId, name }) => {
  const reactionToken = await bt.reactors.react(REACTOR_ID, {
    args: {
      account_owner_full_name: name,
      bank: `{{${bankTokenId}}}`
    }
  });

  return reactionToken.raw;
};

router.post('/fund', async (req, res) => {
  const { bank_token_id: bankTokenId, name } = req.body;

  try {
    const {
      transaction: {
        token: transaction_token,
        payment_method: { token: payment_method_token },
      },
    } = await executeSpreedlyReactor({
      bankTokenId,
      name,
    });

    return res.json({
      success: true,
      transaction_token,
      payment_method_token,
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);

    return res.json({ success: false });
  }
});

module.exports = { bankApi: router };
