require("dotenv").config();
const express = require("express");
const logger = require("./config/logger");
const routes = require("./routes");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
app.use(cors());

// Initialize socket.io
const io = new Server(server, {
  cors: {
    origin: "*", // Adjust the allowed origin for your frontend domain
    methods: ["GET", "POST"],
  },
});

// Listen for client connections
io.on("connection", (socket) => {
  console.log(`New client connected: ${socket.id}`);

  socket.on("disconnect", () => {
    console.log(`Client disconnected: ${socket.id}`);
  });
});

// Expose the `io` instance for other modules
app.set("socketio", io);

server.listen(3002, () => {
  console.log("Socket.IO server running on http://localhost:3002");
});

// Stripe Webhook Route
app.post("/webhook", express.raw({ type: "application/json" }), (req, res) => {
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.error("Webhook signature verification failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Extract event type and data
  const eventType = event.type;
  const eventData = event.data.object;
  const amount = eventData.amount ? eventData.amount / 100 : "N/A";

  // Handle Stripe events and notify frontend via socket.io
  switch (eventType) {
    case "payment_intent.succeeded":
      console.log(
        `Payment Intent Succeeded: ${eventData.id}, Amount=${amount}`
      );
      io.emit("payment_intent_succeeded", {
        message: "Payment succeeded",
        paymentId: eventData.id,
        amount,
      });
      break;

    case "payment_intent.created":
      console.log(`Payment Intent Created: ${eventData.id}, Amount=${amount}`);
      io.emit("payment_intent_created", {
        message: "Payment intent created",
        paymentId: eventData.id,
        amount,
      });
      break;

    case "payment_intent.payment_failed":
      console.log(`Payment Intent Failed: ${eventData.id}, Amount=${amount}`);
      io.emit("payment_intent_failed", {
        message: "Payment failed",
        paymentId: eventData.id,
        amount,
      });
      break;

    case "charge.succeeded":
      console.log(`Charge Succeeded: ${eventData.id}, Amount=${amount}`);
      io.emit("charge_succeeded", {
        message: "Charge succeeded",
        chargeId: eventData.id,
        amount,
      });
      break;

    case "charge.failed":
      console.log(`Charge Failed: ${eventData.id}, Amount=${amount}`);
      io.emit("charge_failed", {
        message: "Charge failed",
        chargeId: eventData.id,
        amount,
      });
      break;

    case "charge.refunded":
      console.log(`Charge Refunded: ${eventData.id}, Refunded=${amount}`);
      io.emit("charge_refunded", {
        message: "Charge refunded",
        chargeId: eventData.id,
        refundedAmount: amount,
      });
      break;

    case "refund.created":
      console.log(`Refund Created: ${eventData.id}, Refunded=${amount}`);
      io.emit("refund_created", {
        message: "Refund created",
        refundId: eventData.id,
        refundedAmount: amount,
      });
      break;

    case "charge.updated":
      console.log(`Charge Updated: ${eventData.id}, Amount=${amount}`);
      io.emit("charge_updated", {
        message: "Charge updated",
        chargeId: eventData.id,
        amount,
      });
      break;
      
    case "refund.updated":
      console.log(`Refund Updated: ${eventData.id}, Amount Refunded=${amount}`);
      io.emit("refund_updated", {
        message: "Refund updated",
        refundId: eventData.id,
        refundedAmount: amount,
      });
      break;

    case "charge.refund.updated":
      console.log(
        `Charge Refund Updated: ${eventData.id}, Amount Refunded=${amount}`
      );
      io.emit("charge_refund_updated", {
        message: "Charge refund updated",
        chargeId: eventData.id,
        refundedAmount: amount,
      });
      break;

    default:
      console.log(`Unhandled event type: ${eventType}`);
      io.emit("unhandled_event", {
        message: "Unhandled event type",
        eventType,
        eventData,
      });
      break;
  }

  res.json({ received: true });
});

// Middleware
app.use(express.json());

// Request logging
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.url}`);
  next();
});

// Routes
app.use("/api", routes);

module.exports = app;
