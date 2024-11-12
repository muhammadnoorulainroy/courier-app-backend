const express = require("express");
const router = express.Router();
const promoCodeController = require("../controllers/promocodeController");
const { promoCodeSchema } = require("../validators/promoCodeValidator");
const validateRequest = require("../middlewares/validateRequest");

router.post(
    "/",
    validateRequest(promoCodeSchema),
    promoCodeController.createPromoCode
  );
router.get("/", promoCodeController.getAllPromoCodes);
router.get("/:id", promoCodeController.getPromoCodeById);
router.put("/:id", promoCodeController.updatePromoCode);
router.delete("/:id", promoCodeController.deletePromoCode);

module.exports = router;
