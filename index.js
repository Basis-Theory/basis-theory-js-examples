const {BasisTheory} = require("@basis-theory/basis-theory-js");
const Stripe = require("stripe");
const express = require("express");
const app = express();

const SERVER_KEY = "key_CYesZCWsn3NB7eC6f1ktkc";
const REACTOR_ID = "a0e7a38c-648e-45d9-a83c-be5eca2d56fa";
const STRIPE_API_KEY =
  "sk_test_51JGRIPKAqx6MOOTELgHWDZ7fqPN3uWH6JD6iTYULt5P3umKOij1h4xPBNtVuxuAGldxHwBb7zYJNmK5xyxCOXwX900hCsznn4O";

const bt = new BasisTheory();
bt.init(SERVER_KEY);
const stripe = Stripe(STRIPE_API_KEY);

app.use(express.static("public"));
app.use(express.json());

async function executeStripeReactor(tokenId) {
  const reactionToken = await bt.atomicCards.react(tokenId, {
    reactorId: REACTOR_ID
  });

  return reactionToken.raw.id;
}

async function chargeWithStripe(paymentMethodId) {
  const paymentIntent = await stripe.paymentIntents.create({
    amount: 1099,
    currency: "usd",
    payment_method: paymentMethodId,
    confirm: true
  });

  return paymentIntent;
}

app.post("/api/charge", async (req, res) => {
  const cardTokenId = req.body.card_token_id;
  const stripeReactionId = await executeStripeReactor(cardTokenId);
  const charge = await chargeWithStripe(stripeReactionId);

  return res.json({success: charge.status === "succeeded"});
});

app.listen(3000, () => {
  console.log(`started`);
});
