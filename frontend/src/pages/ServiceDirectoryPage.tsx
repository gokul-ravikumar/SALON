import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { ServiceDirectoryLayout } from "@/components/layout/ServiceDirectoryLayout";
import { Button } from "@/components/ui/Button";
import { CardShell } from "@/components/ui/Card";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { Pill } from "@/components/ui/Pill";
import { Placeholder } from "@/components/ui/Placeholder";
import { ClockIcon, PlusIcon, SearchIcon } from "@/components/ui/icons";
import { ServiceFormModal } from "@/components/services/ServiceFormModal";
import { ApiError } from "@/lib/api";
import {
  createService,
  deleteService,
  listServices,
  updateService,
  type Service,
} from "@/services/service.service";
import type { ServiceInput } from "@/schemas/service.validator";

type SortKey = "name" | "price" | "duration";

/** Minutes from a "1h 30m" / "45 min" style label, for sorting only. */
function durationMinutes(label: string): number {
  const hours = /(\d+)\s*h/.exec(label);
  const mins = /(\d+)\s*m(?:in)?/.exec(label);
  return (hours ? Number(hours[1]) * 60 : 0) + (mins ? Number(mins[1]) : 0);
}

export function ServiceDirectoryPage() {
  const [items, setItems] = useState<Service[]>([]);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [loadError, setLoadError] = useState("");
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All Categories");
  const [sort, setSort] = useState<SortKey>("name");
  const [addOpen, setAddOpen] = useState(false);
  const [editing, setEditing] = useState<Service | null>(null);
  const [deleting, setDeleting] = useState<Service | null>(null);

  const load = useCallback(() => {
    setStatus("loading");
    return listServices()
      .then((data) => { 
        setItems(data);
        setStatus("ready");
      })
      .catch((err) => {
        setLoadError(
          err instanceof ApiError ? err.message : "Could not load services.",
        );
        setStatus("error");
      });
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const categoryOptions = useMemo(
    () => Array.from(new Set(items.map((s) => s.category))),
    [items],
  );
  const categories = ["All Categories", ...categoryOptions];

  const handleCreate = async (data: ServiceInput) => {
    const created = await createService(data);
    setItems((prev) => [created, ...prev]);
  };

  const handleUpdate = async (id: string, data: ServiceInput) => {
    const updated = await updateService(id, data);
    setItems((prev) => prev.map((s) => (s.id === id ? updated : s)));
  };

  const handleDelete = async (id: string) => {
    await deleteService(id);
    setItems((prev) => prev.filter((s) => s.id !== id));
    toast.success("Service deleted.");
  };

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const rows = items.filter((service) => {
      const matchesQuery =
        !q ||
        service.title.toLowerCase().includes(q) ||
        service.description.toLowerCase().includes(q);
      const matchesCategory =
        category === "All Categories" || service.category === category;
      return matchesQuery && matchesCategory;
    });

    return [...rows].sort((a, b) => {
      if (sort === "price") return a.price - b.price;
      if (sort === "duration") return durationMinutes(a.duration) - durationMinutes(b.duration);
      return a.title.localeCompare(b.title);
    });
  }, [items, query, category, sort]);

  const controlClass =
    "focus-ring h-11 rounded-lg border border-charcoal-800 bg-charcoal-950/60 text-sm text-charcoal-50";

  return (
    <ServiceDirectoryLayout>
      <section>
        <h1 className="font-display text-3xl text-charcoal-50 sm:text-4xl">
          Service <span className="text-gold-400">Directory</span>
        </h1>
        <p className="mt-2 text-sm text-charcoal-300 sm:text-base">
          Every treatment on the menu — durations, pricing, and imagery in one place.
        </p>
      </section>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
        <div className="relative w-full sm:w-64">
          <SearchIcon size={16} className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-charcoal-400" />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search services..."
            aria-label="Search services"
            className={`${controlClass} w-full pr-4 pl-11 placeholder:text-charcoal-400`}
          />
        </div>

        <label className="sr-only" htmlFor="service-category">
          Filter by category
        </label>
        <select
          id="service-category"
          value={category}
          onChange={(event) => setCategory(event.target.value)}
          className={`${controlClass} px-3`}
        >
          {categories.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>

        <label className="sr-only" htmlFor="service-sort">
          Sort services
        </label>
        <select
          id="service-sort"
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
          Add New Service
        </Button>
      </div>

      {status === "loading" && (
        <p className="mt-10 text-sm text-charcoal-400">Loading services…</p>
      )}

      {status === "error" && (
        <CardShell className="mt-6 p-8 text-center">
          <p className="font-display text-xl text-charcoal-50">
            Couldn’t load services
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
            {filtered.length} {filtered.length === 1 ? "Service" : "Services"}
          </p>

          {filtered.length === 0 ? (
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
              <CardShell className="p-8 text-center sm:col-span-2 lg:col-span-2">
                <p className="font-display text-xl text-charcoal-50">
                  {items.length === 0 ? "No services yet" : "No services found"}
                </p>
                <p className="mx-auto mt-2 max-w-sm text-sm text-charcoal-300">
                  {items.length === 0
                    ? "Add your first service to start building the directory."
                    : "Nothing matches your search and filters. Try a different term or clear the category filter."}
                </p>
              </CardShell>
              <AddServiceCard onClick={() => setAddOpen(true)} />
            </div>
          ) : (
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
              {filtered.map((service) => (
                <ServiceCard
                  key={service.id}
                  service={service}
                  onEdit={setEditing}
                  onDelete={setDeleting}
                />
              ))}
              <AddServiceCard onClick={() => setAddOpen(true)} />
            </div>
          )}
        </>
      )}

      <ServiceFormModal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        onSave={handleCreate}
        categoryOptions={categoryOptions}
      />

      <ServiceFormModal
        open={editing !== null}
        onClose={() => setEditing(null)}
        onSave={(data) => handleUpdate(editing!.id, data)}
        categoryOptions={categoryOptions}
        service={editing ?? undefined}
      />

      <ConfirmDialog
        open={deleting !== null}
        onClose={() => setDeleting(null)}
        onConfirm={() => handleDelete(deleting!.id)}
        title="Delete service"
        message={
          deleting
            ? `"${deleting.title}" will be permanently removed. This can't be undone.`
            : ""
        }
        confirmLabel="Delete"
      />
    </ServiceDirectoryLayout>
  );
}

function ServiceCard({
  service,
  onEdit,
  onDelete,
}: {
  service: Service;
  onEdit: (service: Service) => void;
  onDelete: (service: Service) => void;
}) {
  const { title, description, duration, price, category, image } = service;
  return (
    <article className="flex h-full flex-col overflow-hidden rounded-xl border border-primary-500/15 bg-linear-to-b from-charcoal-900 to-charcoal-950">
      <div className="relative">
        <Placeholder src={image} alt={title} className="aspect-[16/10] w-full" />
        <div className="absolute bottom-3 left-3">
          <Pill tone="muted">{category}</Pill>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-display text-xl text-charcoal-50">{title}</h3>
        <p className="mt-2 line-clamp-2 text-sm text-charcoal-300">{description}</p>

        <div className="mt-auto pt-4">
          <div className="flex items-center justify-between gap-3 border-t border-charcoal-800 pt-4">
            <span className="inline-flex min-w-0 items-center gap-1.5 text-sm text-charcoal-200">
              <ClockIcon size={16} className="shrink-0 text-charcoal-400" />
              <span className="truncate">{duration}</span>
            </span>
            <span className="shrink-0 text-sm font-semibold tracking-widest text-gold-400 uppercase">
              ${price}
            </span>
          </div>
          <div className="mt-4 flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={() => onEdit(service)}
            >
              Edit
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex-1 border-error/40 text-error hover:bg-error/10 hover:text-error"
              onClick={() => onDelete(service)}
            >
              Delete
            </Button>
          </div>
        </div>
      </div>
    </article>
  );
}

function AddServiceCard({ onClick }: { onClick?: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="focus-ring flex min-h-full flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-primary-500/25 p-8 text-center transition-colors hover:border-primary-500/50 hover:bg-charcoal-900/40"
    >
      <span className="flex h-12 w-12 items-center justify-center rounded-full border border-primary-500/30 text-primary-300">
        <PlusIcon size={20} />
      </span>
      <span className="font-display text-lg text-charcoal-50">Add New Service</span>
      <span className="text-xs text-charcoal-400">Grow your catalog</span>
    </button>
  );
}
