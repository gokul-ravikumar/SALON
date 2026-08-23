import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import { AuthCard } from "@/components/auth/AuthCard";
import { AuthField } from "@/components/auth/AuthField";
import { apiFetch, ApiError } from "@/lib/api";
import { resendVerification } from "@/services/auth.service";

type Status = "verifying" | "success" | "expired" | "invalid" | "existing";

export function VerifyEmailPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

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

  if (status === "verifying") {
    return (
      <AuthCard title="Verifying" className="text-center">
        <p className="mt-3 text-sm text-charcoal-400">Verifying your email…</p>
      </AuthCard>
    );
  }

  if (status === "success" || status === "existing") {
    return (
      <AuthCard
        title={
          status === "success"
            ? "Email verified successfully."
            : "Email already verified"
        }
        className="text-center"
      >
        <p className="mt-3 text-sm text-charcoal-400">You can now log in.</p>
        <Link to="/login">
          <Button className="mt-6 w-full">Log in</Button>
        </Link>
      </AuthCard>
    );
  }

  return (
    <AuthCard
      title={
        status === "expired"
          ? "Your verification link has expired."
          : "Invalid verification link"
      }
      className="text-center"
    >
      <p className="mt-3 text-sm text-charcoal-400">
        Enter your email to get a new verification link.
      </p>
      <div className="mt-4 text-left">
        <AuthField
          label="Email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
        />
      </div>
      <Button className="mt-4 w-full" onClick={handleResend} disabled={!email}>
        Resend Verification Email
      </Button>
      {resendStatus && (
        <p className="mt-3 text-sm text-charcoal-400">{resendStatus}</p>
      )}
    </AuthCard>
  );
}
