import express from "express";
import { createPaymentIntent, savePayment, getUserPayments, getAllPayments } from "../controllers/paymentController";

const router = express.Router();

router.post("/create-payment-intent", createPaymentIntent);
router.post("/save-payment", savePayment);
router.get("/user/:userId", getUserPayments);
router.get("/all", getAllPayments);

export default router;
