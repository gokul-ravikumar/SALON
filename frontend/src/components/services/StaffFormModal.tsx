import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { FormField, FormSelect } from "@/components/ui/FormField";
import { ImageIcon } from "@/components/ui/icons";
import { ApiError } from "@/lib/api";
import type { Staff } from "@/services/staff.service";
import { staffSchema, type StaffInput } from "@/schemas/staff.validator";

export interface StaffFormModalProps {
    open: boolean;
    onClose: () => void;
    /** Persists the values. Throw to keep the modal open with an error. */
    onSave: (data: StaffInput) => Promise<void>;
    serviceOptions: string[];
    /** When provided, the modal is in edit mode and pre-fills these values. */
    staff?: Staff;
}

const emptyValues = {
    name: "",
    email: "",
    phone: "",
    experience: undefined,
    services: undefined,
    workingDays: undefined,
    workingHours: undefined,
    status: "active",

} as const;

function 
valuesFrom(staff?: Staff) {
    if (!staff) return emptyValues;
    return {
        name: staff.name,
        email: staff.email,
        phone: staff.phone,
        experience: staff.experience,
        services: staff.services,
        workingDays: staff.workingDays,
        workingHours: staff.workingHours,
        status: staff.status
    };
}

export function StaffFormModal({
    open,
    onClose,
    onSave,
    serviceOptions,
    staff,
}: StaffFormModalProps) {
    const isEdit = Boolean(staff);
    const [submitError, setSubmitError] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<StaffInput>({
        resolver: zodResolver(staffSchema),
        defaultValues: emptyValues,
    });

    // Load the right values (and clear errors) each time the modal is (re)opened.
    useEffect(() => {
        if (open) {
            reset(valuesFrom(staff));
            setSubmitError(null);
        }
    }, [open, staff, reset]);

    const onSubmit = async (data: StaffInput) => {
        setSubmitError(null);
        try {
            await onSave(data);
            toast.success(isEdit ? "Staff updated." : "Staff added.");
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
                    <div className="mt-2 flex aspect-16/10 w-full flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-primary-500/25 bg-charcoal-950/40 px-4 text-center">
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
                    label="Staff Name"
                    placeholder="e.g. Signature Balayage"
                    {...register("name")}
                    error={errors.name?.message}
                />

                <FormField
                    label="Email"
                    placeholder="Enter Email"
                    {...register("email")}
                    error={errors.email?.message}
                />

                <FormField
                    label="Phone"
                    placeholder="Phone Number"
                    {...register("phone")}
                    error={errors.phone?.message}
                />

                <FormField
                    label="Experience"
                    placeholder=""
                    {...register("experience")}
                    error={errors.experience?.message}
                />

                <FormSelect
                    label="Services"
                    placeholder="Choose a service"
                    options={serviceOptions}
                    {...register("services")}
                    error={errors.services?.message}
                />

                <FormSelect
                    label="Working Days"
                    placeholder="Choose Working Days"
                    options={[]}
                    {...register("workingDays")}
                    error={errors.workingDays?.message}
                />

                <FormSelect
                    label="Working Hours"
                    placeholder="Choose Working Days"
                    options={[]}
                    {...register("workingHours")}
                    error={errors.workingHours?.message}
                />

                <FormSelect
                    label="Status"
                    placeholder="Choose Status"
                    options={[]}
                    {...register("status")}
                    error={errors.status?.message}
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
                        {isSubmitting ? "Saving…" : isEdit ? "Save Changes" : "Add Service"}
                    </Button>
                </div>
            </form>
        </Modal>
    );
}
