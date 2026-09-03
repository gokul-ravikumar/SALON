import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { ApiError } from "@/lib/api";

export interface ConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  /** Runs the confirmed action. Throw to keep the dialog open with an error. */
  onConfirm: () => Promise<void>;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
}

/**
 * Destructive-action confirmation built on `Modal`. Owns its own pending/error
 * state; closes itself when `onConfirm` resolves.
 */
export function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
}: ConfirmDialogProps) {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setPending(false);
      setError(null);
    }
  }, [open]);

  const run = async () => {
    setPending(true);
    setError(null);
    try {
      await onConfirm();
      onClose();
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : "Something went wrong. Please try again.",
      );
      setPending(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title={title}>
      <p className="text-sm text-charcoal-300">{message}</p>

      {error && (
        <p role="alert" className="mt-3 text-sm text-error">
          {error}
        </p>
      )}

      <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
          disabled={pending}
          className="w-full sm:w-auto"
        >
          {cancelLabel}
        </Button>
        <Button
          type="button"
          variant="destructive"
          onClick={run}
          disabled={pending}
          className="w-full sm:w-auto"
        >
          {pending ? "Working…" : confirmLabel}
        </Button>
      </div>
    </Modal>
  );
}
