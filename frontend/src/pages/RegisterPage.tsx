import { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/Button";
import { AuthCard } from "@/components/auth/AuthCard";
import { AuthFooter } from "@/components/auth/AuthFooter";
import { LoginField } from "@/components/auth/LoginField";
import { EyeIcon, EyeOffIcon } from "@/components/auth/icons";
import { ApiError } from "@/lib/api";
import { register } from "@/services/auth.service";
import { registerSchema, type RegisterInput } from "@/schemas/auth.validator";

export function RegisterPage() {
  const [error, setError] = useState<string | null>(null);
  const [registered, setRegistered] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register: registerField,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterInput) => {
    setError(null);
    try {
      await register(data);
      setRegistered(true);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Registration failed");
    }
  };

  if (registered) {
    return (
      <AuthCard title="Check your email" className="text-center">
        <p className="mt-3 text-sm text-charcoal-400">
          Your account has been created. Please check your email to verify
          your account.
        </p>
        <Link to="/login" className="mt-6 inline-block text-sm text-gold-400 hover:text-gold-300">
          Back to login
        </Link>
      </AuthCard>
    );
  }

  return (
    <div className="min-h-screen bg-charcoal-950 px-6 py-16 sm:py-20">
      <div className="flex flex-col items-center text-center">
        <span className="font-display text-[32px] font-bold tracking-[-0.8px] text-mint-glow">
          SalonFlow
        </span>
        <p className="mt-2 text-xs font-medium tracking-[3.6px] text-charcoal-100/60 uppercase">
          Midnight Luxe Excellence
        </p>
      </div>

      <div className="mx-auto mt-10 max-w-md text-center">
        <h1 className="font-display text-5xl font-semibold tracking-[-0.48px] text-charcoal-50">
          Create Your Account
        </h1>
        <p className="mt-4 text-lg tracking-[0.18px] text-charcoal-100">
          Elevate your salon experience through our exclusive digital concierge.
        </p>
      </div>

      <div className="mx-auto mt-10 max-w-2xl">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="rounded-xl border border-primary-500/20 bg-charcoal-900/60 pt-14 px-12 pb-12 backdrop-blur-sm"
        >
          <div className="space-y-8">
            <LoginField
              label="Full Name"
              placeholder="Alexander Sterling"
              {...registerField("name")}
              error={errors.name?.message}
            />
            <LoginField
              label="Email Address"
              type="email"
              placeholder="alexander@prestige.com"
              {...registerField("email")}
              error={errors.email?.message}
            />
            <LoginField
              label="Phone"
              placeholder="+91 98765 43210"
              {...registerField("phone")}
              error={errors.phone?.message}
            />
            <LoginField
              label="Secure Password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
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
              {...registerField("password")}
              error={errors.password?.message}
            />
            <LoginField
              label="Confirm Password"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="••••••••"
              rightElement={
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((v) => !v)}
                  className="text-charcoal-500 hover:text-charcoal-700"
                  aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                >
                  {showConfirmPassword ? (
                    <EyeOffIcon className="h-4 w-4" />
                  ) : (
                    <EyeIcon className="h-4 w-4" />
                  )}
                </button>
              }
              {...registerField("confirmPassword")}
              error={errors.confirmPassword?.message}
            />
          </div>

          {error && <p className="mt-4 text-sm text-error">{error}</p>}

          <Button
            type="submit"
            variant="primary"
            className="mt-8 h-[54px] w-full tracking-[1.4px] shadow-mint-glow"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Creating Account…" : "Create Account"}
          </Button>

          <div className="mt-8 border-t border-mint-glow/10 pt-8 text-center">
            <p className="text-base text-charcoal-100">
              Already part of the collective?{" "}
              <Link to="/login" className="font-semibold text-[#e9c349] hover:text-gold-300">
                Login here
              </Link>
            </p>
          </div>
        </form>
      </div>

      <div className="mt-20">
        <AuthFooter />
      </div>
    </div>
  );
}
