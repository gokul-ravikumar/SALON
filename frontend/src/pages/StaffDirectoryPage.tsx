import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Button } from "@/components/ui/Button";
import { CardShell } from "@/components/ui/Card";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { Placeholder } from "@/components/ui/Placeholder";
import { ClockIcon, PlusIcon, SearchIcon } from "@/components/ui/icons";
import { StaffFormModal } from "@/components/services/StaffFormModal";
import { ApiError } from "@/lib/api";
import {
  createStaff,
  deleteStaff,
  listStaffs,
  updateStaff,
  type Staff,
} from "@/services/staff.service";
import type { StaffInput } from "@/schemas/staff.validator";

type SortKey = "name" | "price" | "duration";


export function StaffDirectoryPage() {
  const [items, setItems] = useState<Staff[]>([]);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [loadError, setLoadError] = useState("");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortKey>("name");
  const [addOpen, setAddOpen] = useState(false);
  const [editing, setEditing] = useState<Staff | null>(null);
  const [deleting, setDeleting] = useState<Staff | null>(null);


  const load = useCallback(() => {
    setStatus("loading");
    return listStaffs()
      .then((data) => {
        setItems(data);
        setStatus("ready");
      })
      .catch((err) => {
        console.log("new error",err)
        setLoadError(
          err instanceof ApiError ? err.message : "Could not load staffs.",
        );
        setStatus("error");
      });
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const handleCreate = async (data: StaffInput) => {
    const created = await createStaff(data);
    setItems((prev) => [created, ...prev]);
  };

  const handleUpdate = async (id: string, data: StaffInput) => {
    const updated = await updateStaff(id, data);
    setItems((prev) => prev.map((s) => (s.id === id ? updated : s)));
  };

  const handleDelete = async (id: string) => {
    await deleteStaff(id);
    setItems((prev) => prev.filter((s) => s.id !== id));
    toast.success("Staff deleted.");
  };

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const rows = items.filter((staff) => {
      const matchesQuery =
        !q ||
        staff.name.toLowerCase().includes(q) ||
        staff.email.toLowerCase().includes(q) ||
        staff.phone.includes(q);
      return matchesQuery;
    });
    return [...rows].sort((a, b) => {
      if (sort === "name") {
        return a.experience - b.experience;
      }
      return a.name.localeCompare(b.name);
    });
  }, [items, query, status, sort]);

  const controlClass =
    "focus-ring h-11 rounded-lg border border-charcoal-800 bg-charcoal-950/60 text-sm text-charcoal-50";

  return (
    <AdminLayout>
      <section>
        <h1 className="font-display text-3xl text-charcoal-50 sm:text-4xl">
          Staff <span className="text-gold-400">Directory</span>
        </h1>
        <p className="mt-2 text-sm text-charcoal-300 sm:text-base">
          Browse every staff member, their specialties, schedules, and contact information.
        </p>
      </section>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
        <div className="relative w-full sm:w-64">
          <SearchIcon size={16} className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-charcoal-400" />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search staffs..."
            aria-label="Search staffs"
            className={`${controlClass} w-full pr-4 pl-11 placeholder:text-charcoal-400`}
          />
        </div>

        <label className="sr-only" htmlFor="staff-sort">
          Sort staffs
        </label>
        <select
          id="staff-sort"
          value={sort}
          onChange={(event) => setSort(event.target.value as SortKey)}
          className={`${controlClass} px-3`}
        >
          <option value="name">Sort: Name A–Z</option>
          <option value="price">Sort: Price (low–high)</option>
          <option value="duration">Sort: Duration</option>
        </select>

        <Button
          variant="gold"
          className="w-full sm:ml-auto sm:w-auto"
          onClick={() => setAddOpen(true)}
        >
          <PlusIcon size={16} />
          Add New Staff
        </Button>
      </div>

      {status === "loading" && (
        <p className="mt-10 text-sm text-charcoal-400">Loading staffs…</p>
      )}

      {status === "error" && (
        <CardShell className="mt-6 p-8 text-center">
          <p className="font-display text-xl text-charcoal-50">
            Couldn’t load staffs
          </p>
          <p className="mx-auto mt-2 max-w-sm text-sm text-charcoal-300">
            {loadError}
          </p>
          <Button variant="outline" className="mt-5" onClick={() => void load()}>
            Try again
          </Button>
        </CardShell>
      )}

      {status === "ready" && (
        <>
          <p className="mt-6 text-xs font-medium tracking-widest text-charcoal-400 uppercase">
            {filtered.length} {filtered.length === 1 ? "Staff" : "Staffs"}
          </p>

          {filtered.length === 0 ? (
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
              <CardShell className="p-8 text-center sm:col-span-2 lg:col-span-2">
                <p className="font-display text-xl text-charcoal-50">
                  {items.length === 0 ? "No staffs yet" : "No staffs found"}
                </p>
                <p className="mx-auto mt-2 max-w-sm text-sm text-charcoal-300">
                  {items.length === 0
                    ? "Add your first service to start building the directory."
                    : "Nothing matches your search and filters. Try a different term or clear the category filter."}
                </p>
              </CardShell>
              <AddStaffCard onClick={() => setAddOpen(true)} />
            </div>
          ) : (
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
              {filtered.map((staff) => (
                <StaffCard
                  key={staff.id}
                  staff={staff}
                  onEdit={setEditing}
                  onDelete={setDeleting}
                />
              ))}
              <AddStaffCard onClick={() => setAddOpen(true)} />
            </div>
          )}
        </>
      )}

      <StaffFormModal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        onSave={handleCreate}
        serviceOptions={[]}
      />

      <StaffFormModal
        open={editing !== null}
        onClose={() => setEditing(null)}
        onSave={(data) => handleUpdate(editing!.id, data)}
        serviceOptions={[]}
        staff={editing ?? undefined}
      />

      <ConfirmDialog
        open={deleting !== null}
        onClose={() => setDeleting(null)}
        onConfirm={() => handleDelete(deleting!.id)}
        title="Delete service"
        message={
          deleting
            ? `"${deleting.name}" will be permanently removed. This can't be undone.`
            : ""
        }
        confirmLabel="Delete"
      />
    </AdminLayout>
  );
}

function StaffCard({
  staff,
  onEdit,
  onDelete,
}: {
  staff: Staff;
  onEdit: (staff: Staff) => void;
  onDelete: (staff: Staff) => void;
}) {
  const { name, experience  } = staff;
  return (
    <article className="flex h-full flex-col overflow-hidden rounded-xl border border-primary-500/15 bg-linear-to-b from-charcoal-900 to-charcoal-950">
      <div className="relative">
        <Placeholder alt={name} className="aspect-16/10 w-full" />
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-display text-xl text-charcoal-50">{name}</h3>
        <p className="mt-2 line-clamp-2 text-sm text-charcoal-300">{experience}</p>

        <div className="mt-auto pt-4">
          <div className="flex items-center justify-between gap-3 border-t border-charcoal-800 pt-4">
            <span className="inline-flex min-w-0 items-center gap-1.5 text-sm text-charcoal-200">
              <ClockIcon size={16} className="shrink-0 text-charcoal-400" />
              {/* <span className="truncate">{duration}</span> */}
            </span>
            <span className="shrink-0 text-sm font-semibold tracking-widest text-gold-400 uppercase">
              {/* ${price} */}
            </span>
          </div>
          <div className="mt-4 flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={() => onEdit(staff)}
            >
              Edit
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex-1 border-error/40 text-error hover:bg-error/10 hover:text-error"
              onClick={() => onDelete(staff)}
            >
              Delete
            </Button>
          </div>
        </div>
      </div>
    </article>
  );
}

function AddStaffCard({ onClick }: { onClick?: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="focus-ring flex min-h-full flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-primary-500/25 p-8 text-center transition-colors hover:border-primary-500/50 hover:bg-charcoal-900/40"
    >
      <span className="flex h-12 w-12 items-center justify-center rounded-full border border-primary-500/30 text-primary-300">
        <PlusIcon size={20} />
      </span>
      <span className="font-display text-lg text-charcoal-50">Add New Staff</span>
      <span className="text-xs text-charcoal-400">Grow your catalog</span>
    </button>
  );
}
