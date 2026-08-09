import Link from "next/link";
import { FooterNewsletterForm } from "./footer-newsletter-form";

interface FooterProps {
  socialLinks?: {
    instagram?: string;
    facebook?: string;
    youtube?: string;
  };
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

function YoutubeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
      <path d="m10 15 5-3-5-3z" />
    </svg>
  );
}

const socialIcons = [
  { key: "instagram" as const, icon: InstagramIcon, label: "Instagram" },
  { key: "facebook" as const, icon: FacebookIcon, label: "Facebook" },
  { key: "youtube" as const, icon: YoutubeIcon, label: "YouTube" },
];

const footerLinks = [
  { label: "Shows", href: "/shows" },
  { label: "Contact", href: "/contact" },
  { label: "Privacy", href: "/privacy" },
];

export function Footer({ socialLinks }: FooterProps) {
  return (
    <footer className="relative border-t border-border-warm bg-midnight">
      {/* Ambient glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[200px] bg-amber/[0.03] blur-[100px] rounded-full" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 py-16 lg:px-10">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-3 md:gap-8">
          {/* Brand */}
          <div>
            <span className="font-display text-2xl font-semibold tracking-[0.15em] text-cream uppercase">
              Silver Lining
            </span>
            <span className="block text-[0.55rem] tracking-[0.4em] text-amber uppercase font-body font-light mt-0.5">
              Band
            </span>
            <p className="mt-4 text-sm text-cream-dim leading-relaxed max-w-[280px]">
              Classic rock covers from the golden era. Bringing Fleetwood Mac, Eagles,
              Beatles & more to stages near you.
            </p>
          </div>

          {/* Mailing List */}
          <div className="flex flex-col items-start md:items-center">
            <h4 className="text-xs font-body font-medium tracking-[0.2em] uppercase text-amber mb-4">
              Stay in the Loop
            </h4>
            <p className="text-sm text-cream-dim leading-relaxed mb-4 text-center max-w-[220px]">
              Get new show announcements first — no spam, just music.
            </p>
            <FooterNewsletterForm />
          </div>

          {/* Social + Links */}
          <div className="flex flex-col items-start md:items-end">
            <h4 className="text-xs font-body font-medium tracking-[0.2em] uppercase text-amber mb-4">
              Follow Us
            </h4>
            <div className="flex gap-5 mb-6">
              {socialIcons.map(({ key, icon: Icon, label }) => {
                const defaults: Record<string, string> = {
                  instagram: "https://www.instagram.com/therealsilverliningband/",
                  facebook: "https://www.facebook.com/therealsilverliningband/",
                  youtube: "https://www.youtube.com/@SilverLining-Ottawa/featured",
                };
                const url = socialLinks?.[key] || defaults[key] || "#";
                return (
                  <a
                    key={key}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-12 w-12 items-center justify-center rounded-full border border-border-warm text-cream-dim transition-all duration-300 hover:text-amber hover:border-amber hover:glow-amber-sm"
                    aria-label={label}
                  >
                    <Icon className="h-5 w-5" />
                  </a>
                );
              })}
            </div>
            <div className="flex gap-6">
              {footerLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-cream-dim hover:text-cream transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-border-cool flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-silver-dim tracking-wider">
            &copy; {new Date().getFullYear()} Silver Lining Band. All rights reserved.
          </p>
          <p className="text-xs text-silver-dim/50 tracking-wider">
            Made with love for the music
          </p>
        </div>
      </div>
    </footer>
  );
}
