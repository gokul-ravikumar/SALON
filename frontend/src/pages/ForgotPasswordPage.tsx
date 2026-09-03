import { useEffect, useRef, useState } from "react";
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

const RESEND_COOLDOWN_SECONDS = 60;

export function ForgotPasswordPage() {
  const [error, setError] = useState<string | null>(null);
  const [sentEmail, setSentEmail] = useState(false);
  const [lastEmail, setLastEmail] = useState<string | null>(null);
  const [cooldown, setCooldown] = useState(0);
  const [isResending, setIsResending] = useState(false);
  const cooldownEndRef = useRef<number | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  // Tick the countdown once a cooldown is active; self-clears at 0.
  useEffect(() => {
    if (cooldown <= 0) return;

    const intervalId = setInterval(() => {
      const endsAt = cooldownEndRef.current;
      if (endsAt === null) return;

      const secondsLeft = Math.max(0, Math.ceil((endsAt - Date.now()) / 1000));
      setCooldown(secondsLeft);
      if (secondsLeft === 0) {
        cooldownEndRef.current = null;
      }
    }, 1000);

    return () => clearInterval(intervalId);
  }, [cooldown]);

  // Cooldown is per-page-visit only; clear any pending timer on unmount.
  useEffect(() => {
    return () => {
      cooldownEndRef.current = null;
    };
  }, []);

  const startCooldown = () => {
    cooldownEndRef.current = Date.now() + RESEND_COOLDOWN_SECONDS * 1000;
    setCooldown(RESEND_COOLDOWN_SECONDS);
  };

  const sendResetLink = async (email: string): Promise<boolean> => {
    setError(null);

    try {
      await forgotPassword(email);
      startCooldown();
      return true;
    } catch (err) {
      const message =
        err instanceof ApiError ? err.message : "Failed to send reset link";

      setError(message);
      return false;
    }
  };

  const onSubmit = async (data: ForgotPasswordInput) => {
    if (cooldown > 0 || isSubmitting) return;

    const success = await sendResetLink(data.email);

    if (success) {
      setLastEmail(data.email);
      setSentEmail(true);
    }
  };

  const handleResend = async () => {
    if (cooldown > 0 || isResending || !lastEmail) return;

    setIsResending(true);

    try {
      await sendResetLink(lastEmail);
    } finally {
      setIsResending(false);
    }
  };

  const isSendDisabled = isSubmitting || cooldown > 0;
  const isResendDisabled = isResending || cooldown > 0;
  const resendLabel = isResending
    ? "Sending…"
    : cooldown > 0
      ? `Resend in ${cooldown}s`
      : "Resend Link";

  return (
    <div className="relative flex min-h-screen flex-col bg-charcoal-950 lg:h-screen lg:overflow-hidden">
      <header className="px-6 py-8 sm:px-16 lg:py-6">
        <Link to="/" className="font-display text-2xl font-bold text-mint-glow">
          DaddyOm
        </Link>
      </header>

      <main className="flex min-h-0 flex-1 items-center justify-center px-6 py-10 lg:py-4">
        <div className="w-full max-w-md rounded-xl border border-primary-500/20 bg-charcoal-900/60 p-10 backdrop-blur-sm lg:p-8">
          {sentEmail ? (
            <div className="text-center">
              <h1 className="font-display text-4xl font-semibold tracking-[-0.48px] text-charcoal-50">
                Check your email
              </h1>
              <p className="mt-3 text-base text-charcoal-100">
                We've sent a recovery link to your email address.
              </p>

              {error && <p className="mt-4 text-sm text-error">{error}</p>}

              <Button
                type="button"
                variant="gold"
                className="mt-6 h-13.75 w-full lg:mt-4"
                onClick={handleResend}
                disabled={isResendDisabled}
                aria-live="polite"
              >
                {resendLabel}
              </Button>
              <Button
                variant="secondary"
                className="mt-4 w-full"
                onClick={() => setSentEmail(false)}
              >
                Change Email
              </Button>
              <Link
                to="/login"
                className="mt-6 inline-flex items-center gap-2 text-xs font-semibold tracking-[1px] text-gold-400 uppercase hover:text-gold-300 lg:mt-4"
              >
                <ArrowLeftIcon size={12} />
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

              <div className="mt-8 lg:mt-6">
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
                className="mt-8 h-13.75 w-full lg:mt-6"
                disabled={isSendDisabled}
                aria-live="polite"
              >
                {isSubmitting ? "Sending…" : cooldown > 0 ? `Resend in ${cooldown}s` : "Send Reset Link"}
                {!isSubmitting && cooldown === 0 && <ArrowRightIcon size={14} />}
              </Button>

              <div className="mt-6 text-center lg:mt-4">
                <Link
                  to="/login"
                  className="inline-flex items-center gap-2 text-xs font-semibold tracking-[1px] text-gold-400 uppercase hover:text-gold-300"
                >
                  <ArrowLeftIcon size={12} />
                  Back to Login
                </Link>
              </div>
            </form>
          )}
        </div>
      </main>

      <div className="px-6 py-10 lg:py-4">
        <AuthFooter />
      </div>
    </div>
  );
}
