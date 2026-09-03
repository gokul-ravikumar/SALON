import { useEffect, useId, useRef, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";
import { CloseIcon } from "./icons";

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: ReactNode;
  /** Extra classes for the panel (e.g. a wider `max-w-*`). */
  className?: string;
}

const FOCUSABLE =
  'a[href],button:not([disabled]),textarea:not([disabled]),input:not([disabled]),select:not([disabled]),[tabindex]:not([tabindex="-1"])';

/**
 * App-wide modal dialog: a portalled backdrop + a `CardShell`-styled panel.
 * Dismisses on Escape, backdrop click, or the close button. Locks body scroll
 * and keeps focus inside the panel while open, restoring it on close.
 */
export function Modal({
  open,
  onClose,
  title,
  description,
  children,
  className,
}: ModalProps) {
  const titleId = useId();
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const previouslyFocused = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    panelRef.current?.focus();

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
        return;
      }
      if (event.key !== "Tab" || !panelRef.current) return;

      const items = Array.from(
        panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE),
      ).filter((el) => el.offsetParent !== null);
      if (items.length === 0) {
        event.preventDefault();
        panelRef.current.focus();
        return;
      }

      const first = items[0]!;
      const last = items[items.length - 1]!;
      const active = document.activeElement;

      if (event.shiftKey && (active === first || active === panelRef.current)) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
      previouslyFocused?.focus?.();
    };
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-charcoal-950/70 p-4 backdrop-blur-sm sm:items-center"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className={cn(
          "relative my-auto flex max-h-[calc(100dvh-2rem)] w-full max-w-lg flex-col overflow-hidden rounded-xl border border-primary-500/15 bg-linear-to-b from-charcoal-900 to-charcoal-950 shadow-gold-glow focus:outline-none",
          className,
        )}
      >
        <div className="flex items-start justify-between gap-4 border-b border-charcoal-800 p-5 sm:p-6">
          <div>
            <h2 id={titleId} className="font-display text-2xl text-charcoal-50">
              {title}
            </h2>
            {description && (
              <p className="mt-1 text-sm text-charcoal-300">{description}</p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="focus-ring -m-1 shrink-0 rounded-md p-1 text-charcoal-400 transition-colors hover:text-charcoal-50"
          >
            <CloseIcon className="h-5 w-5" />
          </button>
        </div>

        <div className="scrollbar-luxe flex-1 overflow-y-auto p-5 sm:p-6">
          {children}
        </div>
      </div>
    </div>,
    document.body,
  );
}
