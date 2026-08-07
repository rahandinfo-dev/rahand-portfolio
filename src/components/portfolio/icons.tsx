import type { SocialIcon as SocialIconName } from "@/content/portfolio";

type IconProps = {
  className?: string;
};

const commonProps = {
  viewBox: "0 0 24 24",
  fill: "none",
  xmlns: "http://www.w3.org/2000/svg",
  "aria-hidden": true,
} as const;

export function ArrowIcon({ className }: IconProps) {
  return (
    <svg {...commonProps} className={className}>
      <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function CloseIcon({ className }: IconProps) {
  return (
    <svg {...commonProps} className={className}>
      <path d="M6 6l12 12M18 6 6 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export function PlusIcon({ className }: IconProps) {
  return (
    <svg {...commonProps} className={className}>
      <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export function ExternalIcon({ className }: IconProps) {
  return (
    <svg {...commonProps} className={className}>
      <path d="M14 5h5v5M19 5l-8 8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M18 13v5a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export function SocialIcon({ name, className }: IconProps & { name: SocialIconName }) {
  if (name === "instagram") {
    return (
      <svg {...commonProps} className={className}>
        <rect x="3.5" y="3.5" width="17" height="17" rx="5" stroke="currentColor" strokeWidth="1.7" />
        <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.7" />
        <circle cx="17.4" cy="6.8" r="1" fill="currentColor" />
      </svg>
    );
  }

  if (name === "facebook") {
    return (
      <svg {...commonProps} className={className}>
        <path d="M14 21v-8h2.8l.4-3H14V8.1c0-.9.3-1.6 1.7-1.6H17V3.8c-.5-.1-1.3-.2-2.4-.2-2.5 0-4.2 1.5-4.2 4.3V10H8v3h2.4v8H14Z" fill="currentColor" />
      </svg>
    );
  }

  if (name === "whatsapp") {
    return (
      <svg {...commonProps} className={className}>
        <path d="M20 11.7a8 8 0 0 1-11.8 7L4 20l1.3-4A8 8 0 1 1 20 11.7Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
        <path d="M9 8.1c.2-.4.4-.4.7-.4h.5c.2 0 .3.1.4.4l.8 1.9c.1.2 0 .4-.1.6l-.6.7c-.2.2-.1.4 0 .6.6 1.1 1.5 1.9 2.6 2.5.2.1.4.1.6-.1l.8-1c.2-.2.4-.2.6-.1l1.8.9c.3.1.4.3.3.6-.2.8-1.2 1.7-2 1.9-.5.1-1.2.2-3.4-.8-2.8-1.2-4.6-4.1-4.7-4.3-.1-.2-1.1-1.5-1.1-2.8 0-1.3.7-2 1-2.3" fill="currentColor" />
      </svg>
    );
  }

  if (name === "phone") {
    return (
      <svg {...commonProps} className={className}>
        <path d="M7.2 3.8 9.5 8c.3.5.2 1.1-.2 1.5l-1.1 1.1c1.1 2.2 2.9 4 5.1 5.1l1.1-1.1c.4-.4 1-.5 1.5-.2l4.2 2.3c.5.3.7.8.6 1.3l-.5 2.2c-.1.5-.6.9-1.1.9C10.2 21.1 3 13.9 3 5c0-.5.4-1 .9-1.1l2.2-.5c.5-.1.9.1 1.1.4Z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }

  return (
    <svg {...commonProps} className={className}>
      <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.7" />
      <path d="m4 7 8 6 8-6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

