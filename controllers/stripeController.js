const stripeService = require("../services/stripeService");
const logger = require("../config/logger");

// Create a new payment
const createPayment = async (req, res) => {
  const { amount, currency, cardDetails, description } = req.body;

  try {
    const paymentIntent = await stripeService.createPaymentIntent(
      amount,
      currency,
      cardDetails,
      description
    );
    logger.info("Payment intent created successfully");
    res.status(200).json({
      success: true,
      message: "Payment intent created successfully",
      paymentIntent,
    });
  } catch (error) {
    logger.error(`Error creating payment intent: ${error.message}`);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Confirm a payment intent
const confirmPayment = async (req, res) => {
  const { paymentIntentId, paymentMethodId } = req.body;

  try {
    const confirmation = await stripeService.confirmPaymentIntent(
      paymentIntentId,
      paymentMethodId
    );
    logger.info("Payment confirmed successfully");
    res.status(200).json({
      success: true,
      message: "Payment confirmed successfully",
      confirmation,
    });
  } catch (error) {
    logger.error(`Error confirming payment: ${error.message}`);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Refund a payment
const refundPayment = async (req, res) => {
  const { paymentIntentId } = req.body;

  try {
    const refund = await stripeService.refundPayment(paymentIntentId);
    logger.info("Payment refunded successfully");
    res.status(200).json({
      success: true,
      message: "Payment refunded successfully",
      refund,
    });
  } catch (error) {
    logger.error(`Error refunding payment: ${error.message}`);
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { createPayment, confirmPayment, refundPayment };
