import { useEffect, useState } from "react";
import userApi from "../../api/paymentApi";

type Payment = {
  _id: string;
  email: string;
  amount: number;
  status: string;
  createdAt: string;
};

export default function AdminPayments() {
  const [payments, setPayments] = useState<Payment[]>([]);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const res = await userApi.get("/payments/all");
        setPayments(res.data);
      } catch (err) {
        console.error("Failed to fetch payments:", err);
      }
    };

    fetchPayments();
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">All Payments (Admin)</h1>
      <div className="space-y-4">
        {payments.map((p) => (
          <div key={p._id} className="p-4 bg-white shadow rounded flex justify-between">
            <div>
              <p><strong>User:</strong> {p.email}</p>
              <p><strong>Amount:</strong> ${p.amount}</p>
              <p><strong>Status:</strong> {p.status}</p>
            </div>
            <p className="text-gray-500">{new Date(p.createdAt).toLocaleDateString()}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
