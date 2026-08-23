import type { FormHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

const cardClass =
  "w-full max-w-sm rounded-xl border border-primary-500/15 bg-charcoal-900 p-6";

interface AuthCardProps {
  title: string;
  children: ReactNode;
  className?: string;
}

/** Non-form auth card shell — status/confirmation screens (verify email, sent-link, etc). */
export function AuthCard({ title, children, className }: AuthCardProps) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-charcoal-950 px-4">
      <div className={cn(cardClass, className)}>
        <h1 className="font-display text-xl text-charcoal-50">{title}</h1>
        {children}
      </div>
    </div>
  );
}

interface AuthFormProps extends FormHTMLAttributes<HTMLFormElement> {
  title: string;
}

/** Form-backed auth card shell — login, register, forgot/reset password. */
export function AuthForm({
  title,
  children,
  className,
  ...props
}: AuthFormProps) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-charcoal-950 px-4">
      <form {...props} className={cn(cardClass, className)}>
        <h1 className="font-display text-xl text-charcoal-50">{title}</h1>
        {children}
      </form>
    </div>
  );
}
