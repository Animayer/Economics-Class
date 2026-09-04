import type { BranchId } from "../types";

interface IconProps {
  className?: string;
}

export function CapitolIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 64 64" aria-hidden="true">
      <path
        fill="currentColor"
        d="M8 50h48v4H8zm6-4h36v3H14zM18 28h4v18h-4zm8 0h4v18h-4zm8 0h4v18h-4zm8 0h4v18h-4zm8 0h4v18h-4z"
      />
      <path fill="currentColor" d="M14 25h36v4H14z" opacity="0.85" />
      <path
        fill="currentColor"
        d="M32 8c5 0 10 4 10 10v4H22v-4c0-6 5-10 10-10zm0 3.2c-1.4 0-2.4 1-2.4 2.3s1 2.3 2.4 2.3 2.4-1 2.4-2.3-1-2.3-2.4-2.3z"
      />
    </svg>
  );
}

export function EagleIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 64 64" aria-hidden="true">
      <path
        fill="currentColor"
        d="M32 7l5.1 10.4 11.5 1.7-8.3 8.1 2 11.4L32 32.8l-10.3 5.8 2-11.4-8.3-8.1 11.5-1.7z"
      />
      <path
        fill="currentColor"
        d="M18 38h28l7 19H11z"
        opacity="0.92"
      />
    </svg>
  );
}

export function ScalesIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 64 64" aria-hidden="true">
      <path
        fill="currentColor"
        d="M30 10h4v36h-4zM18 50h28v4H18zM12 22h40v3H12z"
      />
      <path
        fill="currentColor"
        d="M16 25c0 8 5 13 10 13s10-5 10-13H16zm12 0c0 8 5 13 10 13s10-5 10-13H28z"
        opacity="0.85"
      />
    </svg>
  );
}

export function BranchIcon({
  id,
  className,
}: {
  id: BranchId;
  className?: string;
}) {
  if (id === "legislative") return <CapitolIcon className={className} />;
  if (id === "executive") return <EagleIcon className={className} />;
  return <ScalesIcon className={className} />;
}
