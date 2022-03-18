const { BasisTheory } = require('@basis-theory/basis-theory-js');
const express = require('express');
const Stripe = require('stripe');

const SERVER_KEY = 'key_CYesZCWsn3NB7eC6f1ktkc';

const REACTOR_ID = 'a0e7a38c-648e-45d9-a83c-be5eca2d56fa';
const STRIPE_API_KEY =
  'sk_test_51JGRIPKAqx6MOOTELgHWDZ7fqPN3uWH6JD6iTYULt5P3umKOij1h4xPBNtVuxuAGldxHwBb7zYJNmK5xyxCOXwX900hCsznn4O';

const bt = new BasisTheory();
const stripe = Stripe(STRIPE_API_KEY);
const router = express.Router();

bt.init(SERVER_KEY);

const executeStripeReactor = async (tokenId) => {
  const reactionToken = await bt.reactors.react(REACTOR_ID, {
    args: {
      card: `{{${tokenId}}}`
    }
  });

  return reactionToken.raw.id;
};

const chargeWithStripe = async (paymentMethodId) => {
  const paymentIntent = await stripe.paymentIntents.create({
    amount: 1099,
    currency: 'usd',
    payment_method: paymentMethodId,
    confirm: true,
  });

  return paymentIntent;
};

router.post('/charge', async (req, res) => {
  const cardTokenId = req.body.card_token_id;
  const stripeReactionId = await executeStripeReactor(cardTokenId);
  const charge = await chargeWithStripe(stripeReactionId);

  return res.json({ success: charge.status === 'succeeded' });
});

module.exports = { cardApi: router };
