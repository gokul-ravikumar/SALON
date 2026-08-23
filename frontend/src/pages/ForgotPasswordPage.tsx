import { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/Button";
import { AuthCard, AuthForm } from "@/components/auth/AuthCard";
import { AuthField } from "@/components/auth/AuthField";
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

  if (sentEmail) {
    return (
      <AuthCard title="Check your email" className="text-center">
        <p className="mt-3 text-sm text-charcoal-400">
          Your account has been created. Please check your email to verify
          your account.
        </p>
        <Button variant="secondary" className="mt-3" onClick={() => setSentEmail(false)}>
          Change Email
        </Button>
      </AuthCard>
    );
  }
  return (
    <AuthForm title="Forgot Password" onSubmit={handleSubmit(onSubmit)}>
      <div className="mt-6 space-y-4">
        <AuthField
          label="Email"
          type="email"
          placeholder="Enter a Email"
          {...register("email")}
          error={errors.email?.message}
        />
      </div>

      {error && <p className="mt-4 text-sm text-error">{error}</p>}

      <Button type="submit" className="mt-6 w-full" disabled={isSubmitting}>
        {isSubmitting ? "Sending..." : "Send Email"}
      </Button>

      <p className="mt-4 text-center text-sm text-charcoal-400">
        Back to Login?{" "}
        <Link to="/login" className="text-gold-400 hover:text-gold-300">
          Login
        </Link>
      </p>
    </AuthForm>
  );
}
