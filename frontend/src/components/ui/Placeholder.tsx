import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { ImageIcon } from "./icons";

export interface PlaceholderProps {
  /** Real image URL. When omitted, a gradient placeholder block is rendered. */
  src?: string;
  alt: string;
  className?: string;
  /** Icon shown in the placeholder block; defaults to a generic image glyph. */
  icon?: ReactNode;
}

/**
 * Image slot with a built-in fallback. The Figma is photo-heavy but the project
 * has no photography yet — pass `src` once real assets land, until then this
 * renders an on-brand charcoal→gold gradient block.
 */
export function Placeholder({ src, alt, className, icon }: PlaceholderProps) {
  if (src) {
    return <img src={src} alt={alt} className={cn("object-cover", className)} />;
  }

  return (
    <div
      role="img"
      aria-label={alt}
      className={cn(
        "flex items-center justify-center bg-linear-to-br from-charcoal-800 to-charcoal-950 text-charcoal-600",
        className,
      )}
    >
      {icon ?? <ImageIcon size={32} />}
    </div>
  );
}
