import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    email: { type: String, required: true },
    amount: { type: Number, required: true },
    status: { type: String, enum: ["succeeded", "failed"], required: true },
    stripePaymentIntentId: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model("Payment", paymentSchema);
