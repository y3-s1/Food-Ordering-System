import { useEffect, useState } from "react";
import {
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import paymentApi from "../../api/paymentApi"; 
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
          amount: 1000, // This means ₨10.00 if currency is LKR
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
        card: elements.getElement(CardNumberElement)!,
      },
    });

    if (result.error) {
      console.error(result.error);
      toast.error(result.error.message || "Payment failed");
      navigate("/payment-failure");
    } else if (result.paymentIntent && result.paymentIntent.status === "succeeded") {
      toast.success("🎉 Payment Successful!");
      navigate("/payment-success");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white p-8 shadow rounded">
        <h2 className="text-2xl font-bold mb-6 text-center text-blue-600">Complete Payment</h2>

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Card Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Card Number</label>
            <div className="border p-3 rounded-lg">
              <CardNumberElement
                options={{
                  style: { base: { fontSize: "16px", color: "#32325d" } },
                }}
              />
            </div>
          </div>

          {/* Card Expiry */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Expiry Date</label>
            <div className="border p-3 rounded-lg">
              <CardExpiryElement
                options={{
                  style: { base: { fontSize: "16px", color: "#32325d" } },
                }}
              />
            </div>
          </div>

          {/* Card CVC */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">CVC</label>
            <div className="border p-3 rounded-lg">
              <CardCvcElement
                options={{
                  style: { base: { fontSize: "16px", color: "#32325d" } },
                }}
              />
            </div>
          </div>

          {/* Submit Button */}
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
