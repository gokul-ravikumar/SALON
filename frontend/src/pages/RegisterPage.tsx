import { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/Button";
import { LoginField } from "@/components/auth/LoginField";
import { ArrowRightIcon, EyeIcon, EyeOffIcon } from "@/components/auth/icons";
import { ApiError } from "@/lib/api";
import { register } from "@/services/auth.service";
import { registerSchema, type RegisterInput } from "@/schemas/auth.validator";
import registerHero from "@/assets/register-hero.png";

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

  return (
    <div className="relative grid h-screen grid-cols-1 overflow-hidden bg-charcoal-950 lg:grid-cols-2">
      <div className="relative hidden overflow-hidden lg:block">
        <img
          src={registerHero}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-r from-charcoal-950/80 via-charcoal-950/0 to-charcoal-950/0" />
        <div className="absolute inset-0 bg-charcoal-950/20" />
      </div>

      {registered ? (
        <div className="scrollbar-luxe flex h-full justify-center overflow-y-auto px-6 py-16 text-center">
          <div className="my-auto w-full max-w-md">
            <h1 className="font-display text-5xl text-charcoal-50">Check your email</h1>
            <p className="mt-4 text-base text-charcoal-100">
              Your account has been created. Please check your email to verify
              your account.
            </p>
            <Link
              to="/login"
              className="mt-8 inline-block font-semibold text-primary-200 hover:text-primary-100"
            >
              Back to login
            </Link>
          </div>
        </div>
      ) : (
        <div className="scrollbar-luxe flex h-full justify-center overflow-y-auto px-6 py-16">
          <form onSubmit={handleSubmit(onSubmit)} className="my-auto w-full max-w-md">
            <h1 className="font-display text-5xl text-charcoal-50">Create Your Account</h1>
            <p className="mt-2 text-base text-charcoal-100">
              Elevate your salon experience through our exclusive digital concierge.
            </p>

            <div className="mt-10 space-y-6">
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
                      <EyeOffIcon size={16} />
                    ) : (
                      <EyeIcon size={16} />
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
                      <EyeOffIcon size={16} />
                    ) : (
                      <EyeIcon size={16} />
                    )}
                  </button>
                }
                {...registerField("confirmPassword")}
                error={errors.confirmPassword?.message}
              />

              {error && <p className="text-sm text-error">{error}</p>}

              <Button
                type="submit"
                variant="gold"
                className="h-13.75 w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Creating Account…" : "Create Account"}
                {!isSubmitting && <ArrowRightIcon size={14} />}
              </Button>
            </div>

            <p className="mt-10 text-center text-base text-charcoal-100">
              Already part of the collective?{" "}
              <Link
                to="/login"
                className="font-semibold text-primary-200 hover:text-primary-100"
              >
                Login here
              </Link>
            </p>
          </form>
        </div>
      )}
    </div>
  );
}
