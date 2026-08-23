import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/Button";
import { AuthForm } from "@/components/auth/AuthCard";
import { AuthField } from "@/components/auth/AuthField";
import { ApiError } from "@/lib/api";
import { resetPassword } from "@/services/auth.service";
import { resetPasswordSchema, type ResetPasswordInput } from "@/schemas/auth.validator";
import { toast } from "react-toastify";


export function ResetPasswordPage() {
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token");

    const navigate = useNavigate();

    const [error, setError] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<ResetPasswordInput>({
        resolver: zodResolver(resetPasswordSchema),
    });

    const onSubmit = async (data: ResetPasswordInput) => {
        setError(null);
        try {
            if (token === null) {
                setError("Password reset token is missing.")
            } else {
                await resetPassword(data.password, token);
                toast.success("Password reset successfully!");
                setTimeout(() => {
                    navigate("/login");
                }, 1500);
            }
        } catch (err) {
            const message = err instanceof ApiError ? err.message : "Send Link failed";
            setError(message);
        }
    };


    return (
        <AuthForm title="Reset Password" onSubmit={handleSubmit(onSubmit)}>
            <div className="mt-6 space-y-4">
                <AuthField
                    label="Password"
                    type="password"
                    placeholder="New Password"
                    {...register("password")}
                    error={errors.password?.message}
                />
                <AuthField
                    label="Confirm Password"
                    type="password"
                    placeholder="Confirm Password"
                    {...register("confirmPassword")}
                    error={errors.confirmPassword?.message}
                />
            </div>

            {error && <p className="mt-4 text-sm text-error">{error}</p>}

            <Button type="submit" className="mt-6 w-full" disabled={isSubmitting}>
                {isSubmitting ? "Resetting..." : "Reset"}
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
