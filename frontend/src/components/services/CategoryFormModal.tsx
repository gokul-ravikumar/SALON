import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { FormField, FormTextarea } from "@/components/ui/FormField";
import { ApiError } from "@/lib/api";
import type { Category } from "@/services/category.service";
import { categorySchema, type CategoryInput } from "@/schemas/category.validator";

export interface CategoryFormModalProps {
    open: boolean;
    onClose: () => void;
    /** Persists the values. Throw to keep the modal open with an error. */
    onSave: (data: CategoryInput) => Promise<void>;
    /** When provided, the modal is in edit mode and pre-fills these values. */
    category?: Category;
}

const emptyValues = {
    name: "",
    description: ""
} as const;

function
    valuesFrom(category?: Category) {
    if (!category) return emptyValues;
    return {
        name: category.name,
        description: category.description
    };
}

export function CategoryFormModal({
    open,
    onClose,
    onSave,
    category,
}: CategoryFormModalProps) {
    const isEdit = Boolean(category);
    const [submitError, setSubmitError] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<CategoryInput>({
        resolver: zodResolver(categorySchema),
        defaultValues: emptyValues,
    });

    // Load the right values (and clear errors) each time the modal is (re)opened.
    useEffect(() => {
        if (open) {
            reset(valuesFrom(category));
            setSubmitError(null);
        }
    }, [open, category, reset]);

    const onSubmit = async (data: CategoryInput) => {
        setSubmitError(null);
        try {
            await onSave(data);
            toast.success(isEdit ? "Category updated." : "Category added.");
            reset(emptyValues);
            onClose();
        } catch (err) {
            setSubmitError(
                err instanceof ApiError
                    ? err.message
                    : "Could not save the category. Please try again.",
            );
        }
    };

    return (
        <Modal
            open={open}
            onClose={onClose}
            title={isEdit ? "Edit Category" : "Add Category"}
            description={
                isEdit
                    ? "Update this category's details."
                    : "Create a new category for the directory."
            }
        >
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>

                <FormField
                    label="Name"
                    placeholder="e.g. Signature Balayage"
                    {...register("name")}
                    error={errors.name?.message}
                />
                <FormTextarea
                    label="Description"
                    placeholder=""
                    {...register("description")}
                    error={errors.description?.message}
                />


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
                        {isSubmitting ? "Saving…" : isEdit ? "Save Changes" : "Add Category"}
                    </Button>
                </div>
            </form>
        </Modal>
    );
}
