import { useThemeStore } from "@/store/themeStore";
import { Button } from "@/components/ui/Button";

export function Header() {
  const theme = useThemeStore((state) => state.theme);
  const toggleTheme = useThemeStore((state) => state.toggleTheme);

  return (
    <header className="flex h-16 items-center justify-between border-b border-charcoal-200 bg-white px-4 sm:px-6 dark:border-charcoal-800 dark:bg-charcoal-900">
      <h1 className="font-display text-lg text-charcoal-900 dark:text-charcoal-50">
        Dashboard
      </h1>
      <Button
        variant="ghost"
        size="sm"
        aria-label="Toggle dark mode"
        onClick={toggleTheme}
      >
        {theme === "dark" ? "Light mode" : "Dark mode"}
      </Button>
    </header>
  );
}
