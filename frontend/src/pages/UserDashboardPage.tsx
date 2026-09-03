import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/Button";
import { CardShell } from "@/components/ui/Card";
import { Pill } from "@/components/ui/Pill";
import { Placeholder } from "@/components/ui/Placeholder";
import {
  ArrowRightIcon,
  PlusIcon,
  ScissorsIcon,
  UserIcon,
} from "@/components/ui/icons";
import loginHero from "@/assets/login-hero.png";
import registerHero from "@/assets/register-hero.png";

/** Swap these for real photography as it lands; unset slots fall back to a gradient. */
const IMAGES: { hero?: string; featuredService?: string } = {
  hero: loginHero,
  featuredService: registerHero,
};

const hero = {
  overline: "Exclusivity Redefined",
  title: "Artistry for the Modern Icon",
  cta: "Book Your Experience",
};

type Service = {
  name: string;
  description: string;
  price: number;
  tag?: string;
  image?: string;
};

const featuredService: Service = {
  name: "Signature Balayage",
  description:
    "Hand-painted brilliance tailored to your natural movement and bone structure.",
  price: 350,
  tag: "Signature",
  image: IMAGES.featuredService,
};

const iconService: Service = {
  name: "Precision Cutting",
  description:
    "Architectural shapes that evolve with your lifestyle. Master-level craft.",
  price: 120,
};

const serviceRows: Service[] = [
  {
    name: "Restorative Therapy",
    description: "Molecular repair for compromised hair.",
    price: 95,
  },
  {
    name: "Gloss & Tone",
    description: "Luminous shine with semi-permanent depth.",
    price: 140,
  },
];

const artisans = [
  { name: "Julian Thorne", title: "Creative Director" },
  { name: "Sophia Laurent", title: "Master Colorist" },
  { name: "David Kane", title: "Texture Specialist" },
  { name: "Isabel Nunez", title: "Senior Stylist" },
];

export function UserDashboardPage() {
  return (
    <AppShell>
      <Hero />

      <section className="section-container py-14 md:py-20 lg:py-24">
        <h2 className="font-display text-3xl text-charcoal-50 md:text-4xl">
          Curated Services
        </h2>
        <p className="mt-3 max-w-xl text-sm text-charcoal-300 md:mt-4 md:text-base">
          Precision meets passion. Discover our signature treatments designed for
          distinction.
        </p>

        <div className="mt-8 space-y-6 md:mt-12">
          <FeaturedServiceCard {...featuredService} />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
            <IconServiceCard {...iconService} />
            {serviceRows.map((service) => (
              <ServiceListRow key={service.name} {...service} />
            ))}
          </div>
        </div>
      </section>

      <section className="section-container py-14 md:py-20 lg:py-24">
        <div className="text-center">
          <h2 className="font-display text-3xl text-charcoal-50 md:text-4xl">
            Master Artisans
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-charcoal-300 md:text-base">
            A collective of specialists, each an authority in their craft.
          </p>
        </div>
        <div className="scrollbar-hide mt-8 flex snap-x gap-4 overflow-x-auto pb-2 md:mt-12 md:grid md:grid-cols-3 md:gap-6 md:overflow-visible lg:grid-cols-4">
          {artisans.map((artisan) => (
            <ArtisanCard key={artisan.name} {...artisan} />
          ))}
        </div>
      </section>

      <section className="section-container py-14 md:py-20 lg:py-24">
        <CardShell className="mx-auto max-w-5xl p-8 text-center md:flex md:items-center md:gap-12 md:p-12 md:text-left">
          <div className="md:flex-1">
            <h2 className="font-display text-3xl text-charcoal-50 md:text-4xl">
              The DaddyOm Circle
            </h2>
            <p className="mx-auto mt-3 max-w-md text-sm text-charcoal-300 md:mx-0 md:text-base">
              Join our inner circle for priority access to seasonal collections and
              private events.
            </p>
          </div>
          <form
            className="mx-auto mt-6 flex w-full max-w-md flex-col gap-3 sm:flex-row md:mt-0 md:w-auto md:shrink-0"
            onSubmit={(event) => event.preventDefault()}
          >
            <input
              type="email"
              required
              placeholder="Your email address"
              aria-label="Email address"
              className="focus-ring h-12 w-full rounded-lg border border-charcoal-800 bg-charcoal-950/60 px-4 text-sm text-charcoal-50 placeholder:text-charcoal-400 md:w-64"
            />
            <Button type="submit" variant="gold" className="h-12 shrink-0 sm:w-32">
              Join
            </Button>
          </form>
        </CardShell>
      </section>
    </AppShell>
  );
}

function HeroCopy({ className }: { className?: string }) {
  return (
    <div className={className}>
      <p className="text-xs font-semibold tracking-widest text-gold-400 uppercase">
        {hero.overline}
      </p>
      <h1 className="mt-3 font-display text-4xl leading-tight text-charcoal-50 sm:text-5xl lg:text-6xl xl:text-7xl">
        {hero.title}
      </h1>
      <Button variant="primary" size="lg" className="mt-6 lg:mt-8">
        {hero.cta}
        <ArrowRightIcon size={16} />
      </Button>
    </div>
  );
}

function Hero() {
  return (
    <section className="relative lg:mx-auto lg:grid lg:max-w-7xl lg:grid-cols-2 lg:items-stretch lg:gap-10 lg:px-8">
      <div className="relative h-[70vh] min-h-130 w-full lg:order-2 lg:my-12 lg:h-auto lg:min-h-0 lg:overflow-hidden lg:rounded-xl">
        <Placeholder
          src={IMAGES.hero}
          alt="Luxury salon interior"
          className="absolute inset-0 h-full w-full"
        />
        <div className="absolute inset-0 bg-linear-to-t from-charcoal-950 via-charcoal-950/50 to-charcoal-950/10 lg:bg-linear-to-r lg:from-charcoal-950/70 lg:via-charcoal-950/10 lg:to-transparent" />
      </div>

      <div className="absolute inset-x-0 bottom-0 lg:hidden">
        <div className="section-container">
          <HeroCopy className="max-w-xl pb-12" />
        </div>
      </div>

      <div className="hidden lg:order-1 lg:flex lg:min-h-144 lg:flex-col lg:justify-center lg:py-24 lg:pr-8">
        <HeroCopy className="max-w-lg" />
      </div>
    </section>
  );
}

function FeaturedServiceCard({ name, description, price, tag, image }: Service) {
  return (
    <article className="overflow-hidden rounded-xl border border-primary-500/15 bg-charcoal-900 lg:flex lg:items-stretch">
      <div className="relative lg:w-1/2">
        <Placeholder
          src={image}
          alt={name}
          className="h-56 w-full sm:h-72 lg:h-full lg:min-h-85"
        />
        {tag && (
          <div className="absolute bottom-3 left-3">
            <Pill>{tag}</Pill>
          </div>
        )}
      </div>
      <div className="p-5 md:p-6 lg:flex lg:w-1/2 lg:flex-col lg:justify-center lg:p-10">
        <h3 className="font-display text-2xl text-charcoal-50 lg:text-3xl">{name}</h3>
        <p className="mt-2 text-sm text-charcoal-300 lg:mt-4 lg:text-base">
          {description}
        </p>
        <p className="mt-4 text-sm font-semibold tracking-widest text-gold-400 uppercase lg:mt-6">
          From ${price}
        </p>
        <div className="mt-5 hidden lg:block">
          <Button variant="primary">Book This Service</Button>
        </div>
      </div>
    </article>
  );
}

function IconServiceCard({ name, description, price }: Service) {
  return (
    <CardShell className="p-5">
      <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary-900/40 text-primary-300">
        <ScissorsIcon size={20} />
      </span>
      <h3 className="mt-4 font-display text-xl text-charcoal-50">{name}</h3>
      <p className="mt-2 text-sm text-charcoal-300">{description}</p>
      <div className="mt-4 flex items-center justify-between border-t border-charcoal-800 pt-4">
        <span className="text-sm font-semibold tracking-widest text-gold-400 uppercase">
          From ${price}
        </span>
        <button
          type="button"
          aria-label={`Add ${name}`}
          className="focus-ring flex h-9 w-9 items-center justify-center rounded-full border border-primary-500/30 text-primary-300 hover:bg-primary-900/30"
        >
          <PlusIcon size={16} />
        </button>
      </div>
    </CardShell>
  );
}

function ServiceListRow({ name, description, price, image }: Service) {
  return (
    <article className="flex h-full items-center gap-4 rounded-xl border border-primary-500/15 bg-charcoal-900 p-3 sm:p-4">
      <Placeholder
        src={image}
        alt={name}
        className="h-16 w-16 shrink-0 rounded-lg sm:h-20 sm:w-20"
      />
      <div className="min-w-0 flex-1">
        <h3 className="font-display text-base text-charcoal-50">{name}</h3>
        <p className="mt-0.5 line-clamp-2 text-xs text-charcoal-400">
          {description}
        </p>
      </div>
      <span className="text-sm font-semibold text-gold-400">${price}</span>
    </article>
  );
}

function ArtisanCard({ name, title }: { name: string; title: string }) {
  return (
    <article className="w-60 shrink-0 snap-start md:w-auto">
      <div className="group overflow-hidden rounded-xl border border-primary-500/15">
        <Placeholder
          alt={name}
          icon={<UserIcon size={40} />}
          className="h-80 w-full transition-transform duration-500 group-hover:scale-105 md:h-72 lg:h-80"
        />
      </div>
      <h3 className="mt-4 text-center font-display text-xl text-charcoal-50">
        {name}
      </h3>
      <p className="mt-1 text-center text-xs font-semibold tracking-widest text-gold-400 uppercase">
        {title}
      </p>
    </article>
  );
}
