import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { registerSchema } from "../utils/validationSchemas";
import userApi from "../api/userApi";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useState } from "react";

// Updated FormData type to make role potentially undefined
type FormData = {
  name: string;
  email: string;
  password: string;
  role: string; // Keep it as string, but we'll handle it in the form
};

export default function Register() {
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<FormData>({
    resolver: yupResolver(registerSchema) as any, // Using 'as any' to bypass the TypeScript error
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: "" // Default empty value
    }
  });

  const navigate = useNavigate();

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      await userApi.post("/auth/register", data);
      toast.success("✅ OTP sent. Please verify.");
      navigate("/verify-otp");
    } catch (err: any) {
      toast.error(err?.response?.data?.error || "❌ Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4 max-w-md mx-auto mt-10 p-6 bg-white shadow-md rounded"
    >
      <h2 className="text-2xl font-semibold text-center">Register</h2>

      <div>
        <input
          {...register("name")}
          placeholder="Full Name"
          className={`input w-full ${errors.name ? "border-red-500" : ""}`}
        />
        {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
      </div>

      <div>
        <input
          {...register("email")}
          placeholder="Email"
          className={`input w-full ${errors.email ? "border-red-500" : ""}`}
        />
        {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
      </div>

      <div>
        <input
          type="password"
          {...register("password")}
          placeholder="Password"
          className={`input w-full ${errors.password ? "border-red-500" : ""}`}
        />
        {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
      </div>

      <div>
        <select
          {...register("role")}
          className={`input w-full ${errors.role ? "border-red-500" : ""}`}
        >
          <option value="">Select Role</option>
          <option value="customer">Customer</option>
          <option value="restaurantOwner">Restaurant Owner</option>
          <option value="deliveryAgent">Delivery Agent</option>
        </select>
        {errors.role && <p className="text-red-500 text-sm">{errors.role.message}</p>}
      </div>

      <button
        type="submit"
        disabled={loading}
        className={`w-full py-2 text-white rounded ${
          loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
        }`}
      >
        {loading ? "Submitting..." : "Register"}
      </button>
    </form>
  );
}