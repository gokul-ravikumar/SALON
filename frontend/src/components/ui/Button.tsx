import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "focus-ring inline-flex items-center justify-center gap-2 rounded-[0.25rem] font-semibold uppercase tracking-[1px] transition-colors disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary: "bg-primary-500 text-white hover:bg-primary-600",
        secondary:
          "border border-gold-400 bg-transparent text-gold-400 hover:bg-gold-400/10",
        outline:
          "border border-charcoal-700 bg-transparent text-charcoal-50 hover:bg-charcoal-800",
        ghost: "bg-transparent text-charcoal-50 hover:bg-charcoal-800",
        destructive: "bg-error text-charcoal-950 hover:bg-error/90",
        gold: "rounded-sm shadow-gold-glow bg-linear-to-br from-[#e9c349] to-[#af8d11] text-[#3c2f00] hover:brightness-105",
      },
      size: {
        sm: "h-8 px-3 text-sm",
        md: "h-10 px-4 text-sm",
        lg: "h-12 px-6 text-base",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  },
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(buttonVariants({ variant, size }), className)}
        {...props}
      />
    );
  },
);

Button.displayName = "Button";
