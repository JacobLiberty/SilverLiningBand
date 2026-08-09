import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How Silver Lining Band collects, uses, and protects your information.",
  alternates: {
    canonical: "https://silverliningband.ca/privacy",
  },
};

export default function PrivacyPage() {
  return (
    <div className="relative min-h-screen bg-midnight px-6 pt-28 pb-20">
      <div className="mx-auto max-w-2xl">
        <p className="text-center font-body text-xs font-medium uppercase tracking-[0.35em] text-amber">
          Legal
        </p>
        <h1 className="mt-4 text-center font-display text-4xl font-light italic tracking-tight text-cream sm:text-5xl">
          Privacy Policy
        </h1>
        <p className="mt-4 text-center font-body text-xs text-silver-dim">
          Effective August 9, 2026
        </p>

        <div className="mx-auto mt-8 flex max-w-xs items-center gap-4">
          <span className="h-px flex-1 bg-gradient-to-r from-transparent to-amber/30" />
          <span className="text-amber/60" aria-hidden="true">
            &#9830;
          </span>
          <span className="h-px flex-1 bg-gradient-to-l from-transparent to-amber/30" />
        </div>

        <div className="mt-12 space-y-10 font-body text-sm leading-relaxed text-silver">
          <p>
            Silver Lining Band (&ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;) operates
            silverliningband.ca. This page explains what personal information we collect through
            this site, why we collect it, and how you can control it.
          </p>

          <section>
            <h2 className="font-body text-xs font-semibold uppercase tracking-[0.2em] text-amber">
              Information We Collect
            </h2>
            <p className="mt-3">We collect information you give us directly, when you:</p>
            <ul className="mt-3 list-disc space-y-1.5 pl-5 text-cream-dim">
              <li>Sign up for our mailing list (your email address).</li>
              <li>
                Suggest a song for an upcoming or past show (your email address, and optionally
                your name, the song/artist, and any message you include).
              </li>
              <li>Contact us or submit a booking inquiry (your name, email, and message).</li>
            </ul>
            <p className="mt-3">
              Like most websites, our hosting provider may automatically log basic technical
              information (such as IP address and browser type) for security and performance
              purposes. We don&apos;t use cookies or analytics tools to track you across this
              site.
            </p>
          </section>

          <section>
            <h2 className="font-body text-xs font-semibold uppercase tracking-[0.2em] text-amber">
              How We Use Your Information
            </h2>
            <p className="mt-3">We use the information you provide to:</p>
            <ul className="mt-3 list-disc space-y-1.5 pl-5 text-cream-dim">
              <li>Send occasional updates about upcoming shows, if you&apos;ve signed up for them.</li>
              <li>Consider song suggestions and reply to you about them if needed.</li>
              <li>Respond to questions and booking inquiries.</li>
            </ul>
            <p className="mt-3">
              We don&apos;t sell, rent, or share your information with third parties for
              marketing purposes.
            </p>
          </section>

          <section>
            <h2 className="font-body text-xs font-semibold uppercase tracking-[0.2em] text-amber">
              Where Your Information Is Stored
            </h2>
            <p className="mt-3">
              Mailing list and song-suggestion information is stored in{" "}
              <a
                href="https://www.sanity.io/legal/privacy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-amber underline decoration-amber/40 underline-offset-2 hover:text-amber-light"
              >
                Sanity
              </a>
              , the content platform that powers this site. Contact, booking, and song-suggestion
              notification emails are sent through{" "}
              <a
                href="https://web3forms.com/privacy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-amber underline decoration-amber/40 underline-offset-2 hover:text-amber-light"
              >
                Web3Forms
              </a>
              . Both providers only receive the information needed to perform these services.
            </p>
          </section>

          <section>
            <h2 className="font-body text-xs font-semibold uppercase tracking-[0.2em] text-amber">
              Your Choices
            </h2>
            <p className="mt-3">
              You can ask us to remove your email from our mailing list, or delete any
              information you&apos;ve submitted, at any time — just{" "}
              <Link
                href="/contact"
                className="text-amber underline decoration-amber/40 underline-offset-2 hover:text-amber-light"
              >
                contact us
              </Link>{" "}
              and we&apos;ll take care of it.
            </p>
          </section>

          <section>
            <h2 className="font-body text-xs font-semibold uppercase tracking-[0.2em] text-amber">
              Children&apos;s Privacy
            </h2>
            <p className="mt-3">
              This site isn&apos;t directed at children, and we don&apos;t knowingly collect
              information from anyone under 13.
            </p>
          </section>

          <section>
            <h2 className="font-body text-xs font-semibold uppercase tracking-[0.2em] text-amber">
              Changes to This Policy
            </h2>
            <p className="mt-3">
              We may update this policy from time to time. Changes will be posted on this page
              with an updated effective date.
            </p>
          </section>

          <section>
            <h2 className="font-body text-xs font-semibold uppercase tracking-[0.2em] text-amber">
              Contact Us
            </h2>
            <p className="mt-3">
              Questions about this policy or your information?{" "}
              <Link
                href="/contact"
                className="text-amber underline decoration-amber/40 underline-offset-2 hover:text-amber-light"
              >
                Reach out to us
              </Link>{" "}
              any time.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
