import {
  forwardRef,
  useId,
  type InputHTMLAttributes,
  type ReactNode,
  type SelectHTMLAttributes,
  type TextareaHTMLAttributes,
} from "react";
import { cn } from "@/lib/utils";

/**
 * Dashboard form controls — the same surface as the Service Directory filter
 * bar (`rounded-lg border bg-charcoal-950/60`). `forwardRef` + `{...props}`
 * spread so they drop straight into `react-hook-form`'s `register()`.
 */
const controlBase =
  "focus-ring w-full rounded-lg border bg-charcoal-950/60 px-3 text-sm text-charcoal-50 placeholder:text-charcoal-500 transition-colors disabled:opacity-50";

function borderTone(error?: string) {
  return error ? "border-error" : "border-charcoal-800";
}

const labelClass =
  "text-xs font-medium tracking-[0.075em] text-charcoal-100 uppercase";

interface FieldFrameProps {
  id: string;
  label: string;
  error?: string;
  hint?: string;
  children: ReactNode;
}

function FieldFrame({ id, label, error, hint, children }: FieldFrameProps) {
  return (
    <div>
      <label htmlFor={id} className={labelClass}>
        {label}
      </label>
      <div className="mt-2">{children}</div>
      {hint && !error && (
        <p className="mt-1 text-xs text-charcoal-400">{hint}</p>
      )}
      {error && (
        <p id={`${id}-error`} role="alert" className="mt-1 text-sm text-error">
          {error}
        </p>
      )}
    </div>
  );
}

export interface FormFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  hint?: string;
}

export const FormField = forwardRef<HTMLInputElement, FormFieldProps>(
  ({ label, error, hint, className, ...props }, ref) => {
    const id = useId();
    return (
      <FieldFrame id={id} label={label} error={error} hint={hint}>
        <input
          ref={ref}
          id={id}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${id}-error` : undefined}
          className={cn(controlBase, "h-11", borderTone(error), className)}
          {...props}
        />
      </FieldFrame>
    );
  },
);
FormField.displayName = "FormField";

export interface FormTextareaProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
  hint?: string;
}

export const FormTextarea = forwardRef<HTMLTextAreaElement, FormTextareaProps>(
  ({ label, error, hint, className, ...props }, ref) => {
    const id = useId();
    return (
      <FieldFrame id={id} label={label} error={error} hint={hint}>
        <textarea
          ref={ref}
          id={id}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${id}-error` : undefined}
          className={cn(
            controlBase,
            "min-h-24 resize-y py-2",
            borderTone(error),
            className,
          )}
          {...props}
        />
      </FieldFrame>
    );
  },
);
FormTextarea.displayName = "FormTextarea";

export interface FormSelectProps
  extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  error?: string;
  hint?: string;
  options: string[];
  /** Text for the leading disabled placeholder option. */
  placeholder?: string;
}

export const FormSelect = forwardRef<HTMLSelectElement, FormSelectProps>(
  (
    { label, error, hint, options, placeholder = "Select…", className, ...props },
    ref,
  ) => {
    const id = useId();
    return (
      <FieldFrame id={id} label={label} error={error} hint={hint}>
        <select
          ref={ref}
          id={id}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${id}-error` : undefined}
          className={cn(controlBase, "h-11", borderTone(error), className)}
          {...props}
        >
          <option value="" disabled>
            {placeholder}
          </option>
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </FieldFrame>
    );
  },
);
FormSelect.displayName = "FormSelect";
