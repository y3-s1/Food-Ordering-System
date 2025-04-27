import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { loginSchema } from "../utils/validationSchemas";
import userApi from "../api/userApi";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { toast } from "react-hot-toast";

type LoginForm = {
  email: string;
  password: string;
};

export default function Login() {
  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>({
    resolver: yupResolver(loginSchema),
  });

  const navigate = useNavigate();
  const { login } = useAuth();

  const onSubmit = async (data: LoginForm) => {
    try {
      const res = await userApi.post('/auth/login', data);
      const user = res.data.user;
      
      login(user); // Save user in context
      toast.success("Login successful");

      // Redirect based on user role
      if (user.isAdmin) {
        navigate('/admin'); // Admin Dashboard
      } else {
        switch (user.role) {
          case 'customer':
            navigate('/customer-dashboard');
            break;
          case 'restaurantOwner':
            navigate('/restaurant-dashboard');
            break;
          case 'deliveryAgent':
            navigate('/delivery-dashboard');
            break;
          default:
            navigate('/dashboard'); // fallback if no role matches
            break;
        }
      }
      
    } catch (err: any) {
      toast.error(err?.response?.data?.error || "Login failed");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
        <h2 className="text-3xl font-bold text-center text-blue-600 mb-6">Login to Your Account</h2>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email address
            </label>
            <input
              id="email"
              type="email"
              {...register('email')}
              className={`w-full border px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.email ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter your email"
            />
            {errors.email && (
              <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              id="password"
              type="password"
              {...register('password')}
              className={`w-full border px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.password ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="••••••••"
            />
            {errors.password && (
              <p className="text-sm text-red-500 mt-1">{errors.password.message}</p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition duration-200"
          >
            Sign In
          </button>
        </form>

        {/* Google Sign-In */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500 mb-2">or continue with</p>
          <a
            href="http://localhost:5004/api/auth/google"
            className="inline-flex items-center justify-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition"
          >
            <svg className="w-5 h-5 mr-2" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
              <path
                fill="#fff"
                d="M24 9.5c3.5 0 6.5 1.3 8.9 3.4l6.6-6.6C35.1 2.3 29.9 0 24 0 14.8 0 6.9 5.7 3 13.9l7.7 6c2.2-6.5 8.3-10.4 13.3-10.4z"
              />
              <path
                fill="#fff"
                d="M46.1 24.5c0-1.5-.1-3-.3-4.5H24v9h12.4c-.5 3-2.2 5.5-4.6 7.2l7.2 5.6c4.2-3.9 6.6-9.7 6.6-17.3z"
              />
              <path
                fill="#fff"
                d="M10.7 28.4C9.9 26.2 9.5 23.7 9.5 21s.4-5.2 1.2-7.4L3 7.7C1.1 11.1 0 15.3 0 20c0 4.6 1.1 8.9 3.1 12.3l7.6-5.9z"
              />
              <path
                fill="#fff"
                d="M24 48c6.5 0 12-2.1 16-5.8l-7.6-5.9c-2.1 1.5-4.8 2.3-8.4 2.3-5 0-10.7-3.8-13.1-10.4l-7.7 6C6.9 42.3 14.8 48 24 48z"
              />
            </svg>
            Continue with Google
          </a>
        </div>

        <p className="text-sm text-center text-gray-500 mt-6">
          Don’t have an account?{" "}
          <a href="/register" className="text-blue-600 hover:underline">Register</a>
        </p>
      </div>
    </div>
  );
}
