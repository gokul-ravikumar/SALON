import { toast } from "react-toastify";

export function AuthFooter() {
  return (
    <footer className="mx-auto flex w-full max-w-6xl flex-col items-center gap-4 px-6 text-center sm:flex-row sm:justify-between sm:text-left">
      <p className="text-xs font-medium tracking-[0.6px] text-charcoal-100">
        © {new Date().getFullYear()} SalonFlow. Midnight Luxe Excellence.
      </p>
      <nav className="flex gap-8">
        <button
          type="button"
          onClick={() => toast.info("Coming soon")}
          className="text-xs font-medium tracking-[0.6px] text-charcoal-100/60 hover:text-charcoal-100"
        >
          Privacy Policy
        </button>
        <button
          type="button"
          onClick={() => toast.info("Coming soon")}
          className="text-xs font-medium tracking-[0.6px] text-charcoal-100/60 hover:text-charcoal-100"
        >
          Terms of Service
        </button>
        <button
          type="button"
          onClick={() => toast.info("Coming soon")}
          className="text-xs font-medium tracking-[0.6px] text-charcoal-100/60 hover:text-charcoal-100"
        >
          Contact Support
        </button>
      </nav>
    </footer>
  );
}
