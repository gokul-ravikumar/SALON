import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import { useAuthStore } from "@/store/authStore";
import { apiFetch, ApiError } from "@/lib/api";

type Status = "verifying" | "success" | "expired" | "invalid" | "existing";

export function VerifyEmailPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const resendVerification = useAuthStore((state) => state.resendVerification);

  const [status, setStatus] = useState<Status>("verifying");
  const [email, setEmail] = useState("");
  const [resendStatus, setResendStatus] = useState<string | null>(null);

  useEffect(() => {
    if (!token) {
      setStatus("invalid");
      return;
    }

    apiFetch(`/auth/verify-email?token=${encodeURIComponent(token)}`)
      .then(() => setStatus("success"))
      .catch((err: unknown) => {
        if (err instanceof ApiError && err.message.toLowerCase().includes("expired")) {
          setStatus("expired");
        } else if (err instanceof ApiError && err.message.toLowerCase().includes("already")) {
          setStatus("existing")
        } else {
          setStatus("invalid");
        }
      });
  }, [token]);

  const handleResend = async () => {
    setResendStatus(null);
    try {
      const result = await resendVerification(email);
      setResendStatus(result.message);
    } catch (err) {
      if (err instanceof ApiError && err.message === "Validation failed") {
        setResendStatus(
          "Please enter a valid email address"
        );
      } else {
        setResendStatus(
          err instanceof ApiError ? err.message : "Could not resend email",
        );
      }
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-charcoal-50 px-4 dark:bg-charcoal-950">
      <div className="w-full max-w-sm rounded-2xl border border-charcoal-200 bg-white p-6 text-center shadow-sm dark:border-charcoal-700 dark:bg-charcoal-900">
        {status === "verifying" && (
          <p className="text-sm text-charcoal-600 dark:text-charcoal-400">
            Verifying your email…
          </p>
        )}

        {(status === "success" || status === "existing") && (
          <>
            <h1 className="font-display text-xl text-charcoal-900 dark:text-charcoal-50">
              {status === "success"
                ? "Email verified successfully."
                : "Email already verified"}
            </h1>
            <p className="mt-3 text-sm text-charcoal-600 dark:text-charcoal-400">
              You can now log in.
            </p>
            <Link to="/login">
              <Button className="mt-6 w-full">Log in</Button>
            </Link>
          </>
        )}

        {(status === "expired" || status === "invalid") && (
          <>
            <h1 className="font-display text-xl text-charcoal-900 dark:text-charcoal-50">
              {status === "expired"
                ? "Your verification link has expired."
                : "Invalid verification link"}
            </h1>
            <p className="mt-3 text-sm text-charcoal-600 dark:text-charcoal-400">
              Enter your email to get a new verification link.
            </p>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="mt-4 w-full rounded-xl border border-charcoal-300 bg-transparent px-3 py-2 text-sm text-charcoal-900 focus-ring dark:border-charcoal-700 dark:text-charcoal-50"
            />
            <Button className="mt-4 w-full" onClick={handleResend} disabled={!email}>
              Resend Verification Email
            </Button>
            {resendStatus && (
              <p className="mt-3 text-sm text-charcoal-600 dark:text-charcoal-400">
                {resendStatus}
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
}
