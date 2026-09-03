import { useMemo, useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/Button";
import { CardShell } from "@/components/ui/Card";
import { Pill } from "@/components/ui/Pill";
import { Placeholder } from "@/components/ui/Placeholder";
import { ClockIcon, PlusIcon, SearchIcon } from "@/components/ui/icons";

type Service = {
  id: string;
  title: string;
  description: string;
  /** Human-readable, e.g. "45 min" or "1h 30m". */
  duration: string;
  price: number;
  category: string;
  /** Real image URL — omitted until photography lands; falls back to a placeholder. */
  image?: string;
};

/** Swap for a real data source when the services API lands. */
const services: Service[] = [
  {
    id: "signature-balayage",
    title: "Signature Balayage",
    description:
      "Hand-painted brilliance tailored to your natural movement and bone structure for a sun-kissed, lived-in finish.",
    duration: "2h 30m",
    price: 350,
    category: "Colour",
  },
  {
    id: "precision-cut",
    title: "Precision Cut & Style",
    description:
      "Architectural shapes that evolve with your lifestyle. Consultation, cut, and a finished blow-dry.",
    duration: "1h 15m",
    price: 120,
    category: "Cut & Style",
  },
  {
    id: "gloss-tone",
    title: "Gloss & Tone",
    description:
      "Luminous shine with semi-permanent depth. The perfect refresh between full-colour appointments.",
    duration: "45 min",
    price: 90,
    category: "Colour",
  },
  {
    id: "restorative-therapy",
    title: "Restorative Bond Therapy",
    description:
      "Molecular repair for compromised hair — rebuilds strength, elasticity, and softness from within.",
    duration: "1h",
    price: 95,
    category: "Treatment",
  },
  {
    id: "silk-press",
    title: "Silk Press",
    description:
      "A sleek, mirror-smooth press with lightweight body and movement that lasts, without chemical relaxers.",
    duration: "1h 45m",
    price: 130,
    category: "Cut & Style",
  },
  {
    id: "scalp-ritual",
    title: "Scalp Renewal Ritual",
    description:
      "Exfoliating cleanse, lymphatic massage, and a nourishing mask to reset the scalp and encourage growth.",
    duration: "50 min",
    price: 75,
    category: "Treatment",
  },
  {
    id: "bridal-styling",
    title: "Bridal & Event Styling",
    description:
      "A bespoke upstyle or blow-out for your occasion, with an optional trial session beforehand.",
    duration: "2h",
    price: 210,
    category: "Occasion",
  },
  {
    id: "colour-correction",
    title: "Colour Correction",
    description:
      "Specialist multi-step work to undo previous colour and rebuild a healthy, even base. Priced from.",
    duration: "3h 30m",
    price: 420,
    category: "Colour",
  },
];

type SortKey = "name" | "price" | "duration";

/** Minutes from a "1h 30m" / "45 min" style label, for sorting only. */
function durationMinutes(label: string): number {
  const hours = /(\d+)\s*h/.exec(label);
  const mins = /(\d+)\s*m(?:in)?/.exec(label);
  return (hours ? Number(hours[1]) * 60 : 0) + (mins ? Number(mins[1]) : 0);
}

const categories = ["All Categories", ...Array.from(new Set(services.map((s) => s.category)))];

export function ServiceDirectoryPage() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All Categories");
  const [sort, setSort] = useState<SortKey>("name");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const rows = services.filter((service) => {
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
  }, [query, category, sort]);

  const controlClass =
    "focus-ring h-11 rounded-lg border border-charcoal-800 bg-charcoal-950/60 text-sm text-charcoal-50";

  return (
    <DashboardLayout>
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
          <SearchIcon className="pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-charcoal-400" />
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

        <Button variant="gold" className="w-full sm:ml-auto sm:w-auto">
          <PlusIcon className="h-4 w-4" />
          Add New Service
        </Button>
      </div>

      <p className="mt-6 text-xs font-medium tracking-widest text-charcoal-400 uppercase">
        {filtered.length} {filtered.length === 1 ? "Service" : "Services"}
      </p>

      {filtered.length === 0 ? (
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          <CardShell className="p-8 text-center sm:col-span-2 lg:col-span-2">
            <p className="font-display text-xl text-charcoal-50">No services found</p>
            <p className="mx-auto mt-2 max-w-sm text-sm text-charcoal-300">
              Nothing matches your search and filters. Try a different term or clear the
              category filter.
            </p>
          </CardShell>
          <AddServiceCard />
        </div>
      ) : (
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {filtered.map((service) => (
            <ServiceCard key={service.id} {...service} />
          ))}
          <AddServiceCard />
        </div>
      )}
    </DashboardLayout>
  );
}

function ServiceCard({ title, description, duration, price, category, image }: Service) {
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
              <ClockIcon className="h-4 w-4 shrink-0 text-charcoal-400" />
              <span className="truncate">{duration}</span>
            </span>
            <span className="shrink-0 text-sm font-semibold tracking-widest text-gold-400 uppercase">
              ${price}
            </span>
          </div>
          <Button variant="outline" size="sm" className="mt-4 w-full">
            View Details
          </Button>
        </div>
      </div>
    </article>
  );
}

function AddServiceCard() {
  return (
    <button
      type="button"
      className="focus-ring flex min-h-full flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-primary-500/25 p-8 text-center transition-colors hover:border-primary-500/50 hover:bg-charcoal-900/40"
    >
      <span className="flex h-12 w-12 items-center justify-center rounded-full border border-primary-500/30 text-primary-300">
        <PlusIcon className="h-5 w-5" />
      </span>
      <span className="font-display text-lg text-charcoal-50">Add New Service</span>
      <span className="text-xs text-charcoal-400">Grow your catalog</span>
    </button>
  );
}
