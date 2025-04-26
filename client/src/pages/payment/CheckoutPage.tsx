import { useEffect, useState } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import paymentApi from "../../api/paymentApi"; // Should point to Payment API!
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function CheckoutPage() {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();

  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const createPaymentIntent = async () => {
      try {
        const res = await paymentApi.post("/payments/create-payment-intent", {
          amount: 1000, // Amount in cents ($10.00) ✅
        });
        setClientSecret(res.data.clientSecret);
      } catch (err) {
        console.error("Payment Intent Error:", err);
        toast.error("Failed to create payment intent");
      }
    };

    createPaymentIntent();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements || !clientSecret) return;

    setLoading(true);

    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement)!,
      },
    });

    if (result.error) {
      console.error(result.error);
      toast.error(result.error.message || "Payment failed");
      navigate("/payment-failure"); // 🚀 Redirect to failure page
    } else if (result.paymentIntent && result.paymentIntent.status === "succeeded") {
      toast.success("🎉 Payment Successful!");
      navigate("/payment-success"); // 🚀 Redirect to success page
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white p-8 shadow rounded">
        <h2 className="text-2xl font-bold mb-6 text-center text-blue-600">Complete Payment</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <CardElement
            className="border p-3 rounded-lg"
            options={{
              style: { base: { fontSize: "16px", color: "#32325d" } },
            }}
          />

          <button
            type="submit"
            disabled={!stripe || loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition"
          >
            {loading ? "Processing..." : "Pay Now"}
          </button>
        </form>
      </div>
    </div>
  );
}
