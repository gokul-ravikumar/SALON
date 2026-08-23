import type { SVGProps } from "react";


export function ArrowRightIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 15 15" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M3 7.5h9M8.5 3.5 12.5 7.5 8.5 11.5" />
    </svg>
  );
}

export function ArrowLeftIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 15 15" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M12 7.5H3M6.5 3.5 2.5 7.5 6.5 11.5" />
    </svg>
  );
}

export function EyeIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 17 12" fill="none" stroke="currentColor" strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M1 6s2.8-5 7.5-5S16 6 16 6s-2.8 5-7.5 5S1 6 1 6Z" />
      <circle cx="8.5" cy="6" r="2" />
    </svg>
  );
}

export function EyeOffIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 17 12" fill="none" stroke="currentColor" strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M1 6s2.8-5 7.5-5S16 6 16 6s-2.8 5-7.5 5S1 6 1 6Z" />
      <circle cx="8.5" cy="6" r="2" />
      <path d="M1.5 0.5 15.5 11.5" />
    </svg>
  );
}
