import { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/Button";
import { AuthCard, AuthForm } from "@/components/auth/AuthCard";
import { AuthField } from "@/components/auth/AuthField";
import { ApiError } from "@/lib/api";
import { register } from "@/services/auth.service";
import { registerSchema, type RegisterInput } from "@/schemas/auth.validator";

export function RegisterPage() {
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
    <AuthForm title="Create an account" onSubmit={handleSubmit(onSubmit)}>
      <div className="mt-6 space-y-4">
        <AuthField
          label="Name"
          placeholder="Enter your Name"
          {...registerField("name")}
          error={errors.name?.message}
        />
        <AuthField
          label="Email"
          type="email"
          placeholder="Enter your Email"
          {...registerField("email")}
          error={errors.email?.message}
        />
        <AuthField
          label="Phone"
          placeholder="Enter Phone number"
          {...registerField("phone")}
          error={errors.phone?.message}
        />
        <AuthField
          label="Password"
          type="password"
          placeholder="Password"
          {...registerField("password")}
          error={errors.password?.message}
        />
        <AuthField
          label="Confirm password"
          type="password"
          placeholder="Confirm Password"
          {...registerField("confirmPassword")}
          error={errors.confirmPassword?.message}
        />
      </div>

      {error && <p className="mt-4 text-sm text-error">{error}</p>}

      <Button type="submit" className="mt-6 w-full" disabled={isSubmitting}>
        {isSubmitting ? "Creating account…" : "Create account"}
      </Button>

      <p className="mt-4 text-center text-sm text-charcoal-400">
        Already have an account?{" "}
        <Link to="/login" className="text-gold-400 hover:text-gold-300">
          Log in
        </Link>
      </p>
    </AuthForm>
  );
}
