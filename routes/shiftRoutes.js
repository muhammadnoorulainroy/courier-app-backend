const express = require("express");
const router = express.Router();
const shiftController = require("../controllers/shiftController");

router.post("/start-shift", shiftController.startShift);
router.post("/end-shift", shiftController.endShift);

module.exports = router;
