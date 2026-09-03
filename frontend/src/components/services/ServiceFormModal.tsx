import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { FormField, FormSelect, FormTextarea } from "@/components/ui/FormField";
import { ImageIcon } from "@/components/ui/icons";
import { ApiError } from "@/lib/api";
import type { Service } from "@/services/service.service";
import { serviceSchema, type ServiceInput } from "@/schemas/service.validator";

export interface ServiceFormModalProps {
  open: boolean;
  onClose: () => void;
  /** Persists the values. Throw to keep the modal open with an error. */
  onSave: (data: ServiceInput) => Promise<void>;
  categoryOptions: string[];
  /** When provided, the modal is in edit mode and pre-fills these values. */
  service?: Service;
}

const emptyValues = {
  title: "",
  description: "",
  category: "",
  duration: "",
  price: undefined,
} as const;

function valuesFrom(service?: Service) {
  if (!service) return emptyValues;
  return {
    title: service.title,
    description: service.description,
    category: service.category,
    duration: service.duration,
    price: service.price,
  };
}

export function ServiceFormModal({
  open,
  onClose,
  onSave,
  categoryOptions,
  service,
}: ServiceFormModalProps) {
  const isEdit = Boolean(service);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ServiceInput>({
    resolver: zodResolver(serviceSchema),
    defaultValues: emptyValues,
  });

  // Load the right values (and clear errors) each time the modal is (re)opened.
  useEffect(() => {
    if (open) {
      reset(valuesFrom(service));
      setSubmitError(null);
    }
  }, [open, service, reset]);

  const onSubmit = async (data: ServiceInput) => {
    setSubmitError(null);
    try {
      await onSave(data);
      toast.success(isEdit ? "Service updated." : "Service added.");
      reset(emptyValues);
      onClose();
    } catch (err) {
      setSubmitError(
        err instanceof ApiError
          ? err.message
          : "Could not save the service. Please try again.",
      );
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEdit ? "Edit Service" : "Add Service"}
      description={
        isEdit
          ? "Update this treatment's details."
          : "Create a new treatment for the directory."
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
        <div>
          <span className="text-xs font-medium tracking-[0.075em] text-charcoal-100 uppercase">
            Service Image
          </span>
          <div className="mt-2 flex aspect-[16/10] w-full flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-primary-500/25 bg-charcoal-950/40 px-4 text-center">
            <ImageIcon size={32} className="text-charcoal-600" />
            <span className="text-sm text-charcoal-400">
              Image upload coming soon
            </span>
            <span className="text-xs text-charcoal-500">
              You can add a photo after saving
            </span>
          </div>
        </div>

        <FormField
          label="Service Title"
          placeholder="e.g. Signature Balayage"
          autoComplete="off"
          {...register("title")}
          error={errors.title?.message}
        />

        <FormTextarea
          label="Description"
          rows={3}
          placeholder="What the service includes…"
          {...register("description")}
          error={errors.description?.message}
        />

        <FormSelect
          label="Category"
          placeholder="Choose a category"
          options={categoryOptions}
          {...register("category")}
          error={errors.category?.message}
        />

        <div className="grid gap-5 sm:grid-cols-2">
          <FormField
            label="Duration"
            placeholder="e.g. 1h 30m"
            hint="Format: 45 min or 1h 30m"
            autoComplete="off"
            {...register("duration")}
            error={errors.duration?.message}
          />
          <FormField
            label="Price (USD)"
            type="number"
            inputMode="decimal"
            min="0"
            step="1"
            placeholder="120"
            {...register("price", { valueAsNumber: true })}
            error={errors.price?.message}
          />
        </div>

        {submitError && (
          <p role="alert" className="text-sm text-error">
            {submitError}
          </p>
        )}

        <div className="flex flex-col-reverse gap-3 border-t border-charcoal-800 pt-5 sm:flex-row sm:justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isSubmitting}
            className="w-full sm:w-auto"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="gold"
            disabled={isSubmitting}
            className="w-full sm:w-auto"
          >
            {isSubmitting ? "Saving…" : isEdit ? "Save Changes" : "Add Service"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
