import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/Button";
import { AuthForm } from "@/components/auth/AuthCard";
import { AuthField } from "@/components/auth/AuthField";
import { useAuthStore } from "@/store/authStore";
import { ApiError } from "@/lib/api";
import { resendVerification } from "@/services/auth.service";
import { loginSchema, type LoginInput } from "@/schemas/auth.validator";

export function LoginPage() {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);

  const [error, setError] = useState<string | null>(null);
  const [needsVerification, setNeedsVerification] = useState(false);
  const [resendStatus, setResendStatus] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginInput) => {
    setError(null);
    setNeedsVerification(false);
    setResendStatus(null);
    try {
      await login(data);
      navigate("/");
    } catch (err) {
      const message = err instanceof ApiError ? err.message : "Login failed";
      setError(message);
      setNeedsVerification(
        err instanceof ApiError &&
        err.status === 403 &&
        message.toLowerCase().includes("verify your email"),
      );
    }
  };

  const handleResend = async () => {
    setResendStatus(null);
    try {
      const result = await resendVerification(getValues("email"));
      setResendStatus(result.message);
    } catch (err) {
      setResendStatus(
        err instanceof ApiError ? err.message : "Could not resend email",
      );
    }
  };

  return (
    <AuthForm title="Log in" onSubmit={handleSubmit(onSubmit)}>
      <div className="mt-6 space-y-4">
        <AuthField
          label="Email"
          type="email"
          {...register("email")}
          error={errors.email?.message}
        />
        <AuthField
          label="Password"
          type="password"
          {...register("password")}
          error={errors.password?.message}
        />
      </div>

      {error && <p className="mt-1 text-sm text-error">{error}</p>}

      <Link to="/forgot-password" className="mt-3 float-right text-right text-sm text-gold-400 hover:text-gold-300">
        Forgot password?
      </Link>

      {needsVerification && (
        <div className="mt-2">
          <button
            type="button"
            onClick={handleResend}
            className="mt-8 text-sm text-gold-400 underline hover:text-gold-300"
          >
            Resend verification email
          </button>
          {resendStatus && (
            <p className="mt-2 text-sm text-charcoal-400">{resendStatus}</p>
          )}
        </div>
      )}

      <Button type="submit" className="mt-6 w-full" disabled={isSubmitting}>
        {isSubmitting ? "Logging in…" : "Log in"}
      </Button>

      <p className="mt-4 text-center text-sm text-charcoal-400">
        Don't have an account?{" "}
        <Link to="/register" className="text-gold-400 hover:text-gold-300">
          Register
        </Link>
      </p>
    </AuthForm>
  );
}
