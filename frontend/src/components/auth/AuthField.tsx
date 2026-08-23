import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export interface AuthFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

/** Bottom-border-only auth input per DESIGN.md's "boutique" input style. */
export const AuthField = forwardRef<HTMLInputElement, AuthFieldProps>(
  ({ label, error, className, ...props }, ref) => {
    return (
      <div>
        <label className="text-sm text-charcoal-300">{label}</label>
        <input
          ref={ref}
          className={cn(
            "focus-ring mt-1 w-full border-0 border-b border-charcoal-50/20 bg-transparent px-0.5 py-2 text-sm text-charcoal-50 transition-colors focus:border-gold-400",
            className,
          )}
          {...props}
        />
        {error && <p className="mt-1 text-sm text-error">{error}</p>}
      </div>
    );
  },
);

AuthField.displayName = "AuthField";
