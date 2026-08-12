const express = require("express");
const router = express.Router();
const PaymentController = require("../controllers/paymentController");
const authentication = require("../middlewares/authentication");

router.post("/initiate", authentication, PaymentController.initiatePayment);

router.post("/notification", PaymentController.midtransNotification);

module.exports = router;
