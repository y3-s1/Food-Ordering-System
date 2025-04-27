import express from "express";
import { refundPayment } from "../controllers/refundController";

const router = express.Router();

router.post("/refund", refundPayment);

export default router;
