import { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/Button";
import { AuthFooter } from "@/components/auth/AuthFooter";
import { LoginField } from "@/components/auth/LoginField";
import { ArrowLeftIcon, ArrowRightIcon } from "@/components/auth/icons";
import { ApiError } from "@/lib/api";
import { forgotPassword } from "@/services/auth.service";
import { forgotPasswordSchema, type ForgotPasswordInput } from "@/schemas/auth.validator";

export function ForgotPasswordPage() {
  const [error, setError] = useState<string | null>(null);
  const [sentEmail, setSentEmail] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordInput) => {
    setError(null);
    try {
      await forgotPassword(data.email);
      setSentEmail(true)
    } catch (err) {
      const message = err instanceof ApiError ? err.message : "Send Link failed";
      setError(message);
    }
  };

  return (
    <div className="relative flex min-h-screen flex-col bg-charcoal-950">
      <header className="px-6 py-8 sm:px-16">
        <Link to="/" className="font-display text-2xl font-bold text-mint-glow">
          SalonFlow
        </Link>
      </header>

      <main className="flex flex-1 items-center justify-center px-6 py-10">
        <div className="w-full max-w-md rounded-xl border border-primary-500/20 bg-charcoal-900/60 p-10 backdrop-blur-sm">
          {sentEmail ? (
            <div className="text-center">
              <h1 className="font-display text-4xl font-semibold tracking-[-0.48px] text-charcoal-50">
                Check your email
              </h1>
              <p className="mt-3 text-base text-charcoal-100">
                We've sent a recovery link to your email address.
              </p>
              <Button
                variant="secondary"
                className="mt-6 w-full"
                onClick={() => setSentEmail(false)}
              >
                Change Email
              </Button>
              <Link
                to="/login"
                className="mt-6 inline-flex items-center gap-2 text-xs font-semibold tracking-[1px] text-gold-400 uppercase hover:text-gold-300"
              >
                <ArrowLeftIcon className="h-3 w-3" />
                Back to Login
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)}>
              <h1 className="font-display text-4xl font-semibold tracking-[-0.48px] text-charcoal-50">
                Reset Password
              </h1>
              <p className="mt-3 text-base text-charcoal-100">
                Enter your email to receive a recovery link
              </p>

              <div className="mt-8">
                <LoginField
                  label="Email Address"
                  type="email"
                  placeholder="yourname@luxe.com"
                  {...register("email")}
                  error={errors.email?.message}
                />
              </div>

              {error && <p className="mt-4 text-sm text-error">{error}</p>}

              <Button
                type="submit"
                variant="gold"
                className="mt-8 h-13.75 w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Sending…" : "Send Reset Link"}
                {!isSubmitting && <ArrowRightIcon className="h-3.5 w-3.5" />}
              </Button>

              <div className="mt-6 text-center">
                <Link
                  to="/login"
                  className="inline-flex items-center gap-2 text-xs font-semibold tracking-[1px] text-gold-400 uppercase hover:text-gold-300"
                >
                  <ArrowLeftIcon className="h-3 w-3" />
                  Back to Login
                </Link>
              </div>
            </form>
          )}
        </div>
      </main>

      <div className="px-6 py-10">
        <AuthFooter />
      </div>
    </div>
  );
}
