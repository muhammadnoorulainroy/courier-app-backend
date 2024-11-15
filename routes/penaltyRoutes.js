const express = require("express");
const penaltyController = require("../controllers/penaltyController");
const router = express.Router();

router.post("/", penaltyController.createPenalty);
router.put("/:id", penaltyController.updatePenalty);
router.get("/", penaltyController.getPenalties);
router.get("/penalty-config", penaltyController.getPenaltyConfig);
router.put("/update/penalty-config", penaltyController.updatePenaltyConfig); 

module.exports = router;
