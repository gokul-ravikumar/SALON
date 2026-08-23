import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/Button";
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
        <div className="flex min-h-screen items-center justify-center bg-charcoal-50 px-4 dark:bg-charcoal-950">
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="w-full max-w-sm rounded-2xl border border-charcoal-200 bg-white p-6 shadow-sm dark:border-charcoal-700 dark:bg-charcoal-900"
            >
                <h1 className="font-display text-xl text-charcoal-900 dark:text-charcoal-50">
                    Reset Password
                </h1>

                <div className="mt-6 space-y-4">
                    <div>
                        <label className="text-sm text-charcoal-700 dark:text-charcoal-300">
                            Password
                        </label>
                        <input
                            type="password"
                            {...register("password")}
                            placeholder="New Password"
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
                            Confirm Password
                        </label>
                        <input
                            type="password"
                            {...register("confirmPassword")}
                            placeholder="Confirm Password"
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
                    {isSubmitting ? "Resetting..." : "Reset"}
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
