import { Navigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { ReactNode } from "react";

export default function PrivateRoute({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  return user ? <>{children}</> : <Navigate to="/" />;
}
