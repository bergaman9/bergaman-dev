"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { SITE_CONFIG, SOCIAL_LINKS, NAV_LINKS } from '@/lib/constants';
import { getAppVersion } from '@/lib/version';
import { ACTIVE_MINI_APPS, getMiniAppByPathname, getMiniAppTheme } from '@/lib/miniApps';
import { usePreferences } from './PreferencesProvider';

export default function Footer() {
  const pathname = usePathname();
  const currentYear = new Date().getFullYear();
  const appVersion = getAppVersion();
  const activeMiniApp = getMiniAppByPathname(pathname);
  const { locale } = usePreferences();

  if (activeMiniApp) {
    const miniTheme = getMiniAppTheme(activeMiniApp);
    return (
      <footer className="mini-app-chrome mt-auto w-full border-t" style={miniTheme.cssVars}>
        <div className="page-content pb-4 pt-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-start gap-3">
              <span className="mini-app-icon-box flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border"><i className={`${activeMiniApp.icon} mini-app-accent`}></i></span>
              <div><p className="text-sm font-semibold text-white">{activeMiniApp.title}</p><p className="mini-app-muted text-sm">Bergaman Labs · {appVersion}</p></div>
            </div>
            <nav className="flex flex-wrap items-center gap-2" aria-label="Mini apps">
              {ACTIVE_MINI_APPS.map((app) => <Link key={app.id} href={app.href} className={`mini-app-nav-item rounded-full px-3 py-1.5 text-sm ${pathname === app.href ? 'mini-app-nav-item-active' : ''}`}>{app.shortTitle}</Link>)}
              <Link href="/portfolio" className="mini-app-nav-item rounded-full px-3 py-1.5 text-sm">Portfolio</Link>
            </nav>
          </div>
          <div className="mt-4 flex justify-between border-t pt-4 text-xs" style={{ borderColor: 'var(--mini-border)' }}><span>© {currentYear} Ömer</span><span className="mini-app-muted">Bergaman Labs</span></div>
        </div>
      </footer>
    );
  }

  const labels = locale === 'tr'
    ? { quick: 'Hızlı Bağlantılar', resources: 'Kaynaklar', stack: 'Teknolojiler', privacy: 'Gizlilik Politikası', source: 'Kaynak Kod', legacy: 'Eski Portföy', top: 'Yukarı dön', copy: 'Tüm hakları saklıdır.', tagline: 'Ejderhanın bilgeliğiyle mühendislik ve yazılım çözümleri.' }
    : { quick: 'Quick Links', resources: 'Resources', stack: 'Tech Stack', privacy: 'Privacy Policy', source: 'Source Code', legacy: 'Legacy Portfolio', top: 'Back to top', copy: 'All rights reserved.', tagline: "Engineering and software solutions with a dragon's wisdom." };

  return (
    <footer className="site-footer relative mt-auto w-full overflow-hidden border-t border-[#3e503e]/60 bg-gradient-to-t from-[#0a1a0f] via-[#0e1b12] to-[#1a2e1a]/20">
      <div className="pointer-events-none absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at center, #e8c547 1px, transparent 1px)', backgroundSize: '56px 56px' }}></div>
      <div className="page-content relative z-10 pb-4 pt-10">
        <div className="mb-8 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div className="text-center sm:text-left">
            <Link href="/" className="mb-4 inline-flex items-center gap-3"><i className="fas fa-dragon text-3xl text-[#e8c547]"></i><span><strong className="block text-2xl text-[#e8c547]">Bergaman</strong><small className="text-gray-400">The Dragon&apos;s Domain</small></span></Link>
            <p className="mb-4 text-sm leading-relaxed text-gray-300">{labels.tagline}</p>
            <div className="flex justify-center gap-3 sm:justify-start">
              {SOCIAL_LINKS.map((social) => <a key={social.label} href={social.href} target={social.href.startsWith('mailto:') ? undefined : '_blank'} rel={social.href.startsWith('mailto:') ? undefined : 'noopener noreferrer'} aria-label={social.label} className="flex h-11 w-11 items-center justify-center rounded-lg border border-[#3e503e]/50 bg-[#2e3d29]/50 text-gray-400 transition-all hover:scale-105 hover:border-[#e8c547]/50 hover:text-[#e8c547]"><i className={social.icon}></i></a>)}
            </div>
          </div>
          <FooterColumn icon="fas fa-link" title={labels.quick}>{NAV_LINKS.filter((link) => link.href !== '/').map((link) => <Link key={link.href} href={link.href} className="footer-link"><i className={`${link.icon} w-4 text-xs`}></i>{link.label}</Link>)}</FooterColumn>
          <FooterColumn icon="fas fa-book" title={labels.resources}>
            <Link href="/privacy-policy" className="footer-link"><i className="fas fa-shield-alt w-4 text-xs"></i>{labels.privacy}</Link>
            <a href="https://github.com/bergaman9/bergaman-dev" target="_blank" rel="noopener noreferrer" className="footer-link"><i className="fab fa-github w-4 text-xs"></i>{labels.source}</a>
            <a href={SITE_CONFIG.previousVersions.v1.url} target="_blank" rel="noopener noreferrer" className="footer-link"><i className="fas fa-history w-4 text-xs"></i>{labels.legacy}</a>
          </FooterColumn>
          <FooterColumn icon="fas fa-code" title={labels.stack}>
            <div className="grid grid-cols-2 gap-3 text-sm text-gray-400">{[['fab fa-react','React'],['fas fa-bolt','Next.js'],['fas fa-database','MongoDB'],['fab fa-node-js','Node.js'],['fas fa-wind','Tailwind'],['fas fa-cloud','Vercel']].map(([icon,name]) => <span key={name} className="flex items-center gap-2"><i className={`${icon} text-[#e8c547]`}></i>{name}</span>)}</div>
          </FooterColumn>
        </div>
        <div className="flex flex-col gap-4 border-t border-[#3e503e]/40 pt-6 text-sm text-gray-400 sm:flex-row sm:items-center sm:justify-between">
          <div><p>© {currentYear} Ömer · {labels.copy} · v{appVersion}</p><p className="mt-1 text-xs text-gray-500">Made with <i className="fas fa-heart text-red-400"></i> and <i className="fas fa-dragon text-[#e8c547]"></i> by Bergaman</p></div>
          <div className="flex items-center gap-3"><a href="https://github.com/bergaman9/bergaman-dev/blob/main/LICENSE" target="_blank" rel="noopener noreferrer" className="rounded-full border border-[#3e503e]/50 px-3 py-2 text-xs hover:border-[#e8c547]/50 hover:text-[#e8c547]">MIT License</a><button type="button" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="min-h-11 rounded-lg px-3 text-sm hover:bg-[#e8c547]/10 hover:text-[#e8c547]">{labels.top} <i className="fas fa-arrow-up ml-1"></i></button></div>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({ icon, title, children }) {
  return <div className="text-center sm:text-left"><h2 className="mb-4 text-base font-semibold text-[#e8c547]"><i className={`${icon} mr-2 text-sm`}></i>{title}</h2><div className="flex flex-col items-center gap-2 sm:items-start">{children}</div></div>;
}
