const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const validateRequest = require("../middlewares/validateRequest");
const { addAdminSchema, updateAdminSchema } = require("../validators/adminValidator");

router.get("/dashboard-stats", adminController.getDashboardStats);
router.post("/add", validateRequest(addAdminSchema), adminController.addAdmin);
router.get("/all", adminController.getAllAdmins);
router.put("/edit/:adminId", validateRequest(updateAdminSchema), adminController.updateAdmin);
router.delete("/delete/:adminId", adminController.deleteAdmin);

module.exports = router;
