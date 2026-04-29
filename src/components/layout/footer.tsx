import { Instagram, Facebook, Youtube } from "lucide-react";

interface FooterProps {
  socialLinks?: {
    instagram?: string;
    facebook?: string;
    youtube?: string;
  };
}

const socialIcons = [
  { key: "instagram" as const, icon: Instagram, label: "Instagram" },
  { key: "facebook" as const, icon: Facebook, label: "Facebook" },
  { key: "youtube" as const, icon: Youtube, label: "YouTube" },
];

export function Footer({ socialLinks }: FooterProps) {
  return (
    <footer className="border-t border-border-accent bg-[#050508] px-6 py-12">
      <div className="mx-auto max-w-6xl text-center">
        {/* Social links */}
        <div className="mb-6 flex justify-center gap-6">
          {socialIcons.map(({ key, icon: Icon, label }) => {
            const url = socialLinks?.[key];
            if (!url) return null;
            return (
              <a
                key={key}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted transition-colors hover:text-silver"
                aria-label={label}
              >
                <Icon className="h-5 w-5" />
              </a>
            );
          })}
        </div>

        {/* Copyright */}
        <p className="text-xs text-muted">
          &copy; {new Date().getFullYear()} The Real Silver Lining Band. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
