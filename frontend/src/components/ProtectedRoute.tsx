import { useEffect, useState, type ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const token = useAuthStore((state) => state.token);
  const logout = useAuthStore((state) => state.logout);
  const fetchMe = useAuthStore((state) => state.fetchMe);
  const [isValid, setIsValid] = useState(!!token);
  const [isChecking, setIsChecking] = useState(!!token);

  useEffect(() => {
    if (!token) return;

    fetchMe()
      .then(() => setIsValid(true))
      .catch(() => {
        logout();
        setIsValid(false);
      })
      .finally(() => setIsChecking(false));
  }, [token, fetchMe, logout]);

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (isChecking) {
    return null;
  }

  if (!isValid) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
