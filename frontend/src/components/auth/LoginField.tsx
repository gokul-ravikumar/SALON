import { forwardRef, type InputHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface LoginFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  labelRight?: ReactNode;
  rightElement?: ReactNode;
}

/**
 * White-background input for the "Midnight Luxe" light-input redesign.
 * Shared by LoginPage, RegisterPage, ForgotPasswordPage, and ResetPasswordPage.
 */
export const LoginField = forwardRef<HTMLInputElement, LoginFieldProps>(
  ({ label, error, labelRight, rightElement, className, ...props }, ref) => {
    return (
      <div>
        <div className="flex items-center justify-between">
          <label className="text-xs font-medium tracking-[0.075em] text-charcoal-100 uppercase">
            {label}
          </label>
          {labelRight}
        </div>
        <div className="relative mt-2">
          <input
            ref={ref}
            className={cn(
              "focus-ring h-12.5 w-full border border-[#6b7280] bg-white px-3.5 text-base text-charcoal-800 placeholder:text-charcoal-500 2xl:h-14.75",
              rightElement && "pr-11",
              className,
            )}
            {...props}
          />
          {rightElement && (
            <div className="absolute inset-y-0 right-3.5 flex items-center">
              {rightElement}
            </div>
          )}
        </div>
        {error && <p className="mt-1 text-sm text-error">{error}</p>}
      </div>
    );
  },
);

LoginField.displayName = "LoginField";
