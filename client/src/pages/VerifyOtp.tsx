import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { otpSchema } from "../utils/validationSchemas";
import userApi from "../api/userApi";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useState } from "react";

type OtpForm = {
  userId: string;
  otp: string;
};

export default function VerifyOtp() {
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm<OtpForm>({
    resolver: yupResolver(otpSchema),
  });

  const navigate = useNavigate();

  const onSubmit = async (data: OtpForm) => {
    setLoading(true);
    try {
      await userApi.post("/auth/verify-otp", data);
      toast.success("🎉 OTP verified. You may now login.");
      navigate("/");
    } catch (err: any) {
      toast.error(err?.response?.data?.error || "Invalid or expired OTP.");
    } finally {
      setLoading(false);
    }
  };

  const resendOtp = async () => {
    try {
      const userId = (document.getElementById("userId") as HTMLInputElement)?.value;
      if (!userId) {
        toast.error("Enter User ID to resend OTP");
        return;
      }
      await userApi.post("/auth/resend-otp", { userId });
      toast.success("📨 OTP resent successfully.");
    } catch (err: any) {
      toast.error(err?.response?.data?.error || "Failed to resend OTP.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white shadow-md rounded-lg p-8">
        <h2 className="text-2xl font-semibold text-center text-blue-600 mb-6">Verify OTP</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">User ID</label>
            <input
              id="userId"
              {...register("userId")}
              placeholder="Paste user ID from register response"
              className={`input w-full border px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 ${
                errors.userId ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.userId && <p className="text-sm text-red-500">{errors.userId.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">OTP Code</label>
            <input
              {...register("otp")}
              placeholder="6-digit code"
              className={`input w-full border px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 ${
                errors.otp ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.otp && <p className="text-sm text-red-500">{errors.otp.message}</p>}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition duration-200"
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </button>

          <button
            type="button"
            onClick={resendOtp}
            className="w-full mt-2 bg-gray-100 hover:bg-gray-200 text-blue-600 py-2 rounded-lg transition"
          >
            Resend OTP
          </button>
        </form>

        <p className="text-sm text-center text-gray-500 mt-4">
          Already verified? <a href="/" className="text-blue-600 hover:underline">Login</a>
        </p>
      </div>
    </div>
  );
}
