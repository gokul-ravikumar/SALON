import { useEffect, useState, type ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";

export function PublicRoute({ children }: { children: ReactNode }) {
  const token = useAuthStore((state) => state.token);
  const fetchMe = useAuthStore((state) => state.fetchMe);
  const logout = useAuthStore((state) => state.logout);

  const [isChecking, setIsChecking] = useState(!!token);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    if (!token) {
      setIsChecking(false);
      return;
    }

    fetchMe()
      .then(() => setIsAuthenticated(true))
      .catch(() => {
        logout();
        setIsAuthenticated(false);
      })
      .finally(() => setIsChecking(false));
  }, [token, fetchMe, logout]);

  if (isChecking) {
    return null; // or <LoadingSpinner />
  }

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}