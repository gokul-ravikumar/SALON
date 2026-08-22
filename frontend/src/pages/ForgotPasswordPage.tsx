import { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/Button";
import { useAuthStore } from "@/store/authStore";
import { ApiError } from "@/lib/api";
import { forgotPasswordSchema, type ForgotPasswordInput } from "@/schemas/auth.validator";

export function ForgotPasswordPage() {
  const forgotPassword = useAuthStore((state) => state.forgotPassword);

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

  if (sentEmail) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-charcoal-50 px-4 dark:bg-charcoal-950">
        <div className="w-full max-w-sm rounded-2xl border border-charcoal-200 bg-white p-6 text-center shadow-sm dark:border-charcoal-700 dark:bg-charcoal-900">
          <h1 className="font-display text-xl text-charcoal-900 dark:text-charcoal-50">
            Check your email
          </h1>
          <p className="mt-3 text-sm text-charcoal-600 dark:text-charcoal-400">
            Your account has been created. Please check your email to verify
            your account.
          </p>
          <Button variant="secondary" className="mt-3" onClick={() => setSentEmail(false)}>
            Change Email
          </Button>
        </div>
      </div>
    );
  }
  return (
    <div className="flex min-h-screen items-center justify-center bg-charcoal-50 px-4 dark:bg-charcoal-950">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-sm rounded-2xl border border-charcoal-200 bg-white p-6 shadow-sm dark:border-charcoal-700 dark:bg-charcoal-900"
      >
        <h1 className="font-display text-xl text-charcoal-900 dark:text-charcoal-50">
          Forgot Password
        </h1>

        <div className="mt-6 space-y-4">
          <div>
            <label className="text-sm text-charcoal-700 dark:text-charcoal-300">
              Email
            </label>
            <input
              type="email"
              {...register("email")}
              className="mt-1 w-full rounded-xl border border-charcoal-300 bg-transparent px-3 py-2 text-sm text-charcoal-900 focus-ring dark:border-charcoal-700 dark:text-charcoal-50"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {errors.email.message}
              </p>
            )}
          </div>
        </div>

        {error && (
          <p className="mt-4 text-sm text-red-600 dark:text-red-400">
            {error}
          </p>
        )}

        <Button type="submit" className="mt-6 w-full" disabled={isSubmitting}>
          {isSubmitting ? "Sending..." : "Send Email"}
        </Button>

        <p className="mt-4 text-center text-sm text-charcoal-600 dark:text-charcoal-400">
          Back to Login?{" "}
          <Link to="/login" className="text-primary-600 dark:text-primary-400">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}
