const express = require('express');
const router = express.Router();
const addressController = require('../controllers/addressController');
const validateRequest = require('../middlewares/validateRequest');
const { createAddressSchema } = require('../validators/addressValidator');

router.post('/add', validateRequest(createAddressSchema), addressController.addAddress);
router.get('/book', addressController.getAddressBook);
router.get('/:id', addressController.getAddressById);
router.delete('/:id', addressController.deleteAddress);

module.exports = router;
