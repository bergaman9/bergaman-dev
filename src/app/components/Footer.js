"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { NAV_LINKS, SOCIAL_LINKS } from '@/lib/constants';
import { getMiniAppByPathname, getMiniAppTheme } from '@/lib/miniApps';

export default function Footer() {
  const pathname = usePathname();
  const currentYear = new Date().getFullYear();
  const activeMiniApp = getMiniAppByPathname(pathname);

  if (activeMiniApp) {
    const miniTheme = getMiniAppTheme(activeMiniApp);
    return (
      <footer className="mini-app-chrome mt-auto w-full border-t" style={miniTheme.cssVars}>
        <div className="page-content flex flex-col gap-2 py-5 text-sm sm:flex-row sm:items-center sm:justify-between">
          <span className="font-semibold text-white">{activeMiniApp.title} · Bergaman Labs</span>
          <div className="flex items-center gap-4">
            <Link href="/portfolio" className="mini-app-accent">Work</Link>
            <Link href="/contact" className="mini-app-accent">Contact</Link>
            <span className="mini-app-muted">© {currentYear} Ömer</span>
          </div>
        </div>
      </footer>
    );
  }

  return (
    <footer className="mt-auto w-full border-t border-[#3e503e]/60 bg-[#0a140d]/90">
      <div className="page-content py-8">
        <div className="flex flex-col gap-7 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <Link href="/" className="inline-flex items-center gap-3 text-xl font-bold text-[#e8c547]">
              <i className="fas fa-dragon" aria-hidden="true"></i>
              Bergaman
            </Link>
            <p className="mt-2 max-w-md text-sm text-gray-400">
              Engineering, automation and full-stack software by Ömer.
            </p>
          </div>

          <nav aria-label="Footer navigation" className="flex flex-wrap gap-x-5 gap-y-3 text-sm">
            {NAV_LINKS.filter((link) => ['/portfolio', '/about', '/blog', '/contact'].includes(link.href)).map((link) => (
              <Link key={link.href} href={link.href} className="min-h-11 inline-flex items-center text-gray-300 transition-colors hover:text-[#e8c547]">
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex gap-2">
            {SOCIAL_LINKS.filter((social) => ['GitHub', 'LinkedIn', 'Email'].includes(social.label)).map((social) => (
              <a
                key={social.label}
                href={social.href}
                target={social.href.startsWith('mailto:') ? undefined : '_blank'}
                rel={social.href.startsWith('mailto:') ? undefined : 'noopener noreferrer'}
                aria-label={social.label}
                className="flex h-11 w-11 items-center justify-center rounded-lg border border-[#3e503e]/60 text-gray-300 transition-colors hover:border-[#e8c547]/60 hover:text-[#e8c547]"
              >
                <i className={social.icon} aria-hidden="true"></i>
              </a>
            ))}
          </div>
        </div>

        <div className="mt-7 flex flex-col gap-2 border-t border-[#3e503e]/40 pt-5 text-xs text-gray-500 sm:flex-row sm:items-center sm:justify-between">
          <span>© {currentYear} Ömer. All rights reserved.</span>
          <Link href="/privacy-policy" className="min-h-11 inline-flex items-center hover:text-[#e8c547]">Privacy Policy</Link>
        </div>
      </div>
    </footer>
  );
}
