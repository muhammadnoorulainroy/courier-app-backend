const Stripe = require("stripe");
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Create a payment intent
const createPaymentIntent = async (amount, currency, cardDetails, description) => {
  const paymentMethod = await stripe.paymentMethods.create({
    type: "card",
    card: {
      number: cardDetails.number,
      exp_month: cardDetails.expMonth,
      exp_year: cardDetails.expYear,
      cvc: cardDetails.cvc,
    },
  });

  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round(amount * 100), // Convert to cents
    currency,
    payment_method: paymentMethod.id,
    description,
    confirm: true,
    return_url: "https://yourwebsite.com/payment-success",
  });

  return paymentIntent;
};

// Confirm a payment intent
const confirmPaymentIntent = async (paymentIntentId, paymentMethodId) => {
  const paymentIntent = await stripe.paymentIntents.confirm(paymentIntentId, {
    payment_method: paymentMethodId,
  });
  return paymentIntent;
};

// Refund a payment
const refundPayment = async (paymentIntentId) => {
  const refund = await stripe.refunds.create({
    payment_intent: paymentIntentId,
  });
  return refund;
};

module.exports = {
  createPaymentIntent,
  confirmPaymentIntent,
  refundPayment,
};
