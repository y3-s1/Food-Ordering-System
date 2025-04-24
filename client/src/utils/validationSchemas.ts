import * as yup from 'yup';

export const registerSchema = yup.object({
  name: yup.string().required("Name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
  role: yup.string()
    .oneOf(["customer", "restaurantOwner", "deliveryAgent"], "Role must be selected")
    .required("Role is required"), //  ensure it's required
});

export const loginSchema = yup.object({
  email: yup.string().email().required(),
  password: yup.string().required(),
});

export const otpSchema = yup.object({
  userId: yup.string().required(),
  otp: yup.string().length(6).required(),
});
