import { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/Button";
import { useAuthStore } from "@/store/authStore";
import { ApiError } from "@/lib/api";
import { registerSchema, type RegisterInput } from "@/schemas/auth.validator";

export function RegisterPage() {
  const register = useAuthStore((state) => state.register);

  const [error, setError] = useState<string | null>(null);
  const [registered, setRegistered] = useState(false);

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
      <div className="flex min-h-screen items-center justify-center bg-charcoal-50 px-4 dark:bg-charcoal-950">
        <div className="w-full max-w-sm rounded-2xl border border-charcoal-200 bg-white p-6 text-center shadow-sm dark:border-charcoal-700 dark:bg-charcoal-900">
          <h1 className="font-display text-xl text-charcoal-900 dark:text-charcoal-50">
            Check your email
          </h1>
          <p className="mt-3 text-sm text-charcoal-600 dark:text-charcoal-400">
            Your account has been created. Please check your email to verify
            your account.
          </p>
          <Link
            to="/login"
            className="mt-6 inline-block text-sm text-primary-600 dark:text-primary-400"
          >
            Back to login
          </Link>
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
          Create an account
        </h1>

        <div className="mt-6 space-y-4">
          <div>
            <label className="text-sm text-charcoal-700 dark:text-charcoal-300">
              Name
            </label>
            <input
              {...registerField("name")}
              className="mt-1 w-full rounded-xl border border-charcoal-300 bg-transparent px-3 py-2 text-sm text-charcoal-900 focus-ring dark:border-charcoal-700 dark:text-charcoal-50"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {errors.name.message}
              </p>
            )}
          </div>
          <div>
            <label className="text-sm text-charcoal-700 dark:text-charcoal-300">
              Email
            </label>
            <input
              type="email"
              {...registerField("email")}
              className="mt-1 w-full rounded-xl border border-charcoal-300 bg-transparent px-3 py-2 text-sm text-charcoal-900 focus-ring dark:border-charcoal-700 dark:text-charcoal-50"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {errors.email.message}
              </p>
            )}
          </div>
          <div>
            <label className="text-sm text-charcoal-700 dark:text-charcoal-300">
              Phone
            </label>
            <input
              {...registerField("phone")}
              className="mt-1 w-full rounded-xl border border-charcoal-300 bg-transparent px-3 py-2 text-sm text-charcoal-900 focus-ring dark:border-charcoal-700 dark:text-charcoal-50"
            />
            {errors.phone && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {errors.phone.message}
              </p>
            )}
          </div>
          <div>
            <label className="text-sm text-charcoal-700 dark:text-charcoal-300">
              Password
            </label>
            <input
              type="password"
              {...registerField("password")}
              className="mt-1 w-full rounded-xl border border-charcoal-300 bg-transparent px-3 py-2 text-sm text-charcoal-900 focus-ring dark:border-charcoal-700 dark:text-charcoal-50"
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {errors.password.message}
              </p>
            )}
          </div>
          <div>
            <label className="text-sm text-charcoal-700 dark:text-charcoal-300">
              Confirm password
            </label>
            <input
              type="password"
              {...registerField("confirmPassword")}
              className="mt-1 w-full rounded-xl border border-charcoal-300 bg-transparent px-3 py-2 text-sm text-charcoal-900 focus-ring dark:border-charcoal-700 dark:text-charcoal-50"
            />
            {errors.confirmPassword && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {errors.confirmPassword.message}
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
          {isSubmitting ? "Creating account…" : "Create account"}
        </Button>

        <p className="mt-4 text-center text-sm text-charcoal-600 dark:text-charcoal-400">
          Already have an account?{" "}
          <Link to="/login" className="text-primary-600 dark:text-primary-400">
            Log in
          </Link>
        </p>
      </form>
    </div>
  );
}
