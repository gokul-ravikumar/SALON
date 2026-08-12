import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import { useAuthStore } from "@/store/authStore";
import { ApiError } from "@/lib/api";

export function LoginPage() {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);

  const resendVerification = useAuthStore((state) => state.resendVerification);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [needsVerification, setNeedsVerification] = useState(false);
  const [resendStatus, setResendStatus] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setNeedsVerification(false);
    setResendStatus(null);
    setIsSubmitting(true);
    try {
      await login({ email, password });
      navigate("/");
    } catch (err) {
      const message = err instanceof ApiError ? err.message : "Login failed";
      setError(message);
      setNeedsVerification(
        err instanceof ApiError &&
          err.status === 403 &&
          message.toLowerCase().includes("verify your email"),
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResend = async () => {
    setResendStatus(null);
    try {
      const result = await resendVerification(email);
      setResendStatus(result.message);
    } catch (err) {
      setResendStatus(
        err instanceof ApiError ? err.message : "Could not resend email",
      );
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-charcoal-50 px-4 dark:bg-charcoal-950">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-2xl border border-charcoal-200 bg-white p-6 shadow-sm dark:border-charcoal-700 dark:bg-charcoal-900"
      >
        <h1 className="font-display text-xl text-charcoal-900 dark:text-charcoal-50">
          Log in
        </h1>

        <div className="mt-6 space-y-4">
          <div>
            <label className="text-sm text-charcoal-700 dark:text-charcoal-300">
              Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full rounded-xl border border-charcoal-300 bg-transparent px-3 py-2 text-sm text-charcoal-900 focus-ring dark:border-charcoal-700 dark:text-charcoal-50"
            />
          </div>
          <div>
            <label className="text-sm text-charcoal-700 dark:text-charcoal-300">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full rounded-xl border border-charcoal-300 bg-transparent px-3 py-2 text-sm text-charcoal-900 focus-ring dark:border-charcoal-700 dark:text-charcoal-50"
            />
          </div>
        </div>

        {error && (
          <p className="mt-4 text-sm text-red-600 dark:text-red-400">
            {error}
          </p>
        )}

        {needsVerification && (
          <div className="mt-2">
            <button
              type="button"
              onClick={handleResend}
              className="text-sm text-primary-600 underline dark:text-primary-400"
            >
              Resend verification email
            </button>
            {resendStatus && (
              <p className="mt-2 text-sm text-charcoal-600 dark:text-charcoal-400">
                {resendStatus}
              </p>
            )}
          </div>
        )}

        <Button type="submit" className="mt-6 w-full" disabled={isSubmitting}>
          {isSubmitting ? "Logging in…" : "Log in"}
        </Button>

        <p className="mt-4 text-center text-sm text-charcoal-600 dark:text-charcoal-400">
          Don't have an account?{" "}
          <Link to="/register" className="text-primary-600 dark:text-primary-400">
            Register
          </Link>
        </p>
      </form>
    </div>
  );
}
