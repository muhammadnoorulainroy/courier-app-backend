const express = require("express");
const recipientController = require("../controllers/recipientController");

const router = express.Router();

router.get("/", recipientController.getAllRecipients);

router.delete("/:id", recipientController.deleteRecipient);

module.exports = router;
