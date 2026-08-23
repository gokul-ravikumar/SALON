import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/Button";
import { LoginField } from "@/components/auth/LoginField";
import {
  ArrowRightIcon,
  EyeIcon,
  EyeOffIcon,
} from "@/components/auth/icons";
import { useAuthStore } from "@/store/authStore";
import { ApiError } from "@/lib/api";
import { resendVerification } from "@/services/auth.service";
import { loginSchema, type LoginInput } from "@/schemas/auth.validator";
import loginHero from "@/assets/login-hero.png";

export function LoginPage() {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);

  const [error, setError] = useState<string | null>(null);
  const [needsVerification, setNeedsVerification] = useState(false);
  const [resendStatus, setResendStatus] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

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
    <div className="relative grid min-h-screen grid-cols-1 bg-charcoal-950 lg:grid-cols-2">
      <div className="relative hidden overflow-hidden lg:block">
        <img
          src={loginHero}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-r from-charcoal-950/80 via-charcoal-950/0 to-charcoal-950/0" />
        <div className="absolute inset-0 bg-charcoal-950/20" />
      </div>

      <div className="flex items-center justify-center px-6 py-16">
        <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-md">
          <h1 className="font-display text-5xl text-charcoal-50">Welcome Back</h1>
          <p className="mt-2 text-base text-charcoal-100">
            Sign in to your premium dashboard
          </p>

          <div className="mt-10 space-y-8">
            <LoginField
              label="Email Address"
              type="email"
              placeholder="you@daddyom.com"
              {...register("email")}
              error={errors.email?.message}
            />
            <LoginField
              label="Password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              labelRight={
                <Link
                  to="/forgot-password"
                  className="text-xs font-medium text-gold-400 hover:text-gold-300"
                >
                  Forgot Password?
                </Link>
              }
              rightElement={
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="text-charcoal-500 hover:text-charcoal-700"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOffIcon className="h-4 w-4" />
                  ) : (
                    <EyeIcon className="h-4 w-4" />
                  )}
                </button>
              }
              {...register("password")}
              error={errors.password?.message}
            />

            {error && <p className="text-sm text-error">{error}</p>}

            {needsVerification && (
              <div>
                <button
                  type="button"
                  onClick={handleResend}
                  className="text-sm text-gold-400 underline hover:text-gold-300"
                >
                  Resend verification email
                </button>
                {resendStatus && (
                  <p className="mt-2 text-sm text-charcoal-300">{resendStatus}</p>
                )}
              </div>
            )}

            <Button
              type="submit"
              variant="gold"
              className="h-13.75 w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Signing in…" : "Sign In"}
              {!isSubmitting && <ArrowRightIcon className="h-3.5 w-3.5" />}
            </Button>
          </div>



          <p className="mt-10 text-center text-base text-charcoal-100">
            New to the experience?{" "}
            <Link
              to="/register"
              className="font-semibold text-primary-200 hover:text-primary-100"
            >
              Sign Up
            </Link>
          </p>
        </form>
      </div>


    </div>
  );
}
