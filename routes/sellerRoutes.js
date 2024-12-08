const express = require("express");
const router = express.Router();
const sellerController = require("../controllers/sellerController");
const addressController = require("../controllers/addressController");
const validateRequest = require("../middlewares/validateRequest");
const {
  requestOtpSchema,
  verifyOtpSchema,
  personalInfoSchema,
  editSellerSchema,
} = require("../validators/sellerValidator");

router.post(
  "/sign-up",
  validateRequest(personalInfoSchema),
  sellerController.signUp
);
router.post(
  "/sign-in/request-otp",
  validateRequest(requestOtpSchema),
  sellerController.requestOtp
);
router.post(
  "/sign-in/verify-otp",
  validateRequest(verifyOtpSchema),
  sellerController.verifyOtp
);

router.get("/", sellerController.viewSellers);

router.put("/:userId", validateRequest(editSellerSchema), sellerController.editSeller);

router.delete("/:userId", sellerController.deleteSeller);

router.post('/:sellerId/addresses', addressController.addAddressToSeller);  // Create a new address
router.get('/:sellerId/addresses', addressController.getSellerAddresses);   // Get all addresses for a seller
router.put('/:sellerId/addresses/:addressId', addressController.updateSellerAddress);  // Update an address
router.delete('/:sellerId/addresses/:addressId', addressController.deleteSellerAddress); // Delete an address


module.exports = router;
