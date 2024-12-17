const express = require("express");
const router = express.Router();
const stripeController = require("../controllers/stripeController");

// Create a payment intent
router.post("/create-payment", stripeController.createPayment);

// Confirm a payment (if needed for 3D Secure flows)
router.post("/confirm-payment", stripeController.confirmPayment);

// Refund a payment
router.post("/refund", stripeController.refundPayment);

// router.post(
//     "/webhook",
//     express.raw({ type: "application/json" }),
//     (req, res) => {
//       const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
//       const sig = req.headers["stripe-signature"];
//       let event;
  
//       console.log("webhook triggered")
//       try {
//         // Use the raw body for Stripe signature verification
//         event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
//       } catch (err) {
//         console.error("Webhook signature verification failed:", err.message);
//         return res.status(400).send(`Webhook Error: ${err.message}`);
//       }
  
//       // Handle webhook event types
//       switch (event.type) {
//         case "payment_intent.succeeded":
//           console.log("Payment succeeded:", event.data.object.id);
//           break;
//         case "payment_intent.payment_failed":
//           console.log("Payment failed:", event.data.object.id);
//           break;
//         default:
//           console.log(`Unhandled event type: ${event.type}`);
//       }
  
//       // Send response to acknowledge receipt
//       res.json({ received: true });
//     }
//   );

module.exports = router;
