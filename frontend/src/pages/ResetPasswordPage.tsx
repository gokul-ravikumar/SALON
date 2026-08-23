import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/Button";
import { AuthFooter } from "@/components/auth/AuthFooter";
import { LoginField } from "@/components/auth/LoginField";
import { ArrowLeftIcon, EyeIcon, EyeOffIcon } from "@/components/auth/icons";
import { ApiError } from "@/lib/api";
import { resetPassword } from "@/services/auth.service";
import { resetPasswordSchema, type ResetPasswordInput } from "@/schemas/auth.validator";
import { toast } from "react-toastify";


export function ResetPasswordPage() {
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token");

    const navigate = useNavigate();

    const [error, setError] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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
        <div className="relative flex min-h-screen flex-col bg-charcoal-950">
            <header className="px-6 py-8 sm:px-16">
                <Link to="/" className="font-display text-2xl font-bold text-mint-glow">
                    SalonFlow
                </Link>
            </header>

            <main className="flex flex-1 items-center justify-center px-6 py-10">
                <div className="w-full max-w-md rounded-xl border border-primary-500/20 bg-charcoal-900/60 p-10 backdrop-blur-sm">
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <h1 className="font-display text-4xl font-semibold tracking-[-0.48px] text-charcoal-50">
                            Reset Password
                        </h1>
                        <p className="mt-3 text-base text-charcoal-100">
                            Enter your new password below
                        </p>

                        <div className="mt-8 space-y-6">
                            <LoginField
                                label="New Password"
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
                                {...register("password")}
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
                                {...register("confirmPassword")}
                                error={errors.confirmPassword?.message}
                            />
                        </div>

                        {error && <p className="mt-4 text-sm text-error">{error}</p>}

                        <Button
                            type="submit"
                            variant="gold"
                            className="mt-8 h-13.75 w-full"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? "Resetting…" : "Reset Password"}
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
                </div>
            </main>

            <div className="px-6 py-10">
                <AuthFooter />
            </div>
        </div>
    );
}
