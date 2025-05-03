import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { registerSchema } from "../utils/validationSchemas";
import userApi from "../api/userApi";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useState } from "react";

type FormData = {
  name: string;
  email: string;
  password: string;
  role: "customer" | "restaurantOwner" | "deliveryAgent" | "";
};

export default function Register() {
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: yupResolver(registerSchema) as any,
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: ""
    }
  });

  const navigate = useNavigate();

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      const response = await userApi.post("/auth/register", data);
      
      //  Store EMAIL not ID
      if (response.data && response.data.email) {
        localStorage.setItem("pendingEmail", response.data.email);
      }
      
      toast.success(" OTP sent. Please verify.");
      navigate("/verify-otp");
    } catch (err: any) {
      toast.error(err?.response?.data?.error || " Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
      <div className="w-full max-w-lg p-8 bg-white shadow-md rounded-lg">
        <h2 className="text-3xl font-bold text-center text-blue-600 mb-6">Create Your Account</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Name Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input
              {...register("name")}
              placeholder="John Doe"
              className={`w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 ${
                errors.name ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>}
          </div>

          {/* Email Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              {...register("email")}
              placeholder="example@mail.com"
              className={`w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 ${
                errors.email ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>}
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              {...register("password")}
              placeholder="••••••••"
              className={`w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 ${
                errors.password ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.password && <p className="text-sm text-red-500 mt-1">{errors.password.message}</p>}
          </div>

          {/* Role Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Select Role</label>
            <select
              {...register("role")}
              className={`w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 ${
                errors.role ? "border-red-500" : "border-gray-300"
              }`}
            >
              <option value="">-- Select Role --</option>
              <option value="customer">Customer</option>
              <option value="restaurantOwner">Restaurant Owner</option>
              <option value="deliveryAgent">Delivery Agent</option>
            </select>
            {errors.role && <p className="text-sm text-red-500 mt-1">{errors.role.message}</p>}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition duration-200"
          >
            {loading ? (
              <div className="flex justify-center items-center">
                <span className="animate-spin inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"></span>
                Registering...
              </div>
            ) : (
              "Register"
            )}
          </button>
        </form>

        <p className="text-sm text-center text-gray-500 mt-4">
          Already have an account?{" "}
          <a href="/login" className="text-blue-600 hover:underline">Login here</a>
        </p>
      </div>
    </div>
  );
}
