"use client";

import Link from 'next/link';
import { SITE_CONFIG } from '@/lib/constants';
import { usePreferences } from '../components/PreferencesProvider';

const CONTENT = {
  en: {
    title: 'Privacy Policy', updated: 'Last updated: 2026-08-14',
    sections: [
      ['Introduction', [`${SITE_CONFIG.name} is committed to protecting your privacy. This policy explains how information is collected, used, disclosed, and safeguarded when you visit ${SITE_CONFIG.url}.`, 'Please do not use the site if you do not agree with this policy.']],
      ['Information We Collect', ['Contact submissions may include your name, email address, inquiry type, message, submission time, a keyed non-reversible HMAC of the IP address, a length-limited browser user-agent, and a length-limited referring page.', 'Newsletter subscriptions, blog comments, and email correspondence contain only the information you voluntarily provide. Cookies or local storage may be used for essential preferences and site functionality.']],
      ['How We Use Your Information', ['Information is used to operate and improve the site, answer inquiries, deliver requested communications, prevent spam and abuse, troubleshoot technical issues, and comply with legal obligations.']],
      ['Data Retention', ['Contact submissions are scheduled for automatic deletion after 365 days unless longer retention is required for an active project, legal obligation, dispute resolution, or a requested business relationship. You may request earlier deletion.']],
      ['Data Disclosure', ['Information may be shared with trusted service providers required to operate the site, when legally required, or when necessary to protect rights, property, and safety. Personal information is not sold.']],
      ['Third-Party Services', ['The site may use Vercel Analytics for privacy-oriented aggregate metrics, MongoDB Atlas for application data storage, and Gmail/SMTP for requested email notifications. These providers maintain their own privacy policies.']],
      ['Your Data Protection Rights', ['Depending on your location, you may request access, correction, deletion, restriction, objection, or portability of your personal data. California residents may also exercise applicable CCPA rights, including the right to know, delete, opt out, and receive non-discriminatory treatment.']],
      ["Children's Privacy", ['The site is not intended for children under 13, and personal information from children under 13 is not knowingly collected.']],
      ['Changes to This Policy', ['This policy may be updated when services or legal requirements change. The effective date shown above will be updated when a revision is published.']],
    ],
    contactTitle: 'Contact Us', contactText: 'For privacy questions or requests, contact us:', contactLink: 'contact page', emailPrefix: 'By email', pagePrefix: 'By visiting our'
  },
  tr: {
    title: 'Gizlilik Politikası', updated: 'Son güncelleme: 14 Ağustos 2026',
    sections: [
      ['Giriş', [`${SITE_CONFIG.name}, gizliliğinizi korumayı taahhüt eder. Bu politika, ${SITE_CONFIG.url} adresini ziyaret ettiğinizde bilgilerin nasıl toplandığını, kullanıldığını, açıklandığını ve korunduğunu açıklar.`, 'Bu politikayı kabul etmiyorsanız lütfen siteyi kullanmayın.']],
      ['Topladığımız Bilgiler', ['İletişim gönderileri; adınızı, e-posta adresinizi, talep türünü, mesajınızı, gönderim zamanını, IP adresinin anahtarlı ve geri döndürülemez HMAC değerini, uzunluğu sınırlandırılmış tarayıcı bilgisini ve yönlendiren sayfayı içerebilir.', 'Bülten abonelikleri, blog yorumları ve e-posta yazışmaları yalnızca gönüllü olarak verdiğiniz bilgileri içerir. Temel tercihler ve site işlevleri için çerezler veya yerel depolama kullanılabilir.']],
      ['Bilgilerinizi Nasıl Kullanıyoruz', ['Bilgiler; siteyi işletmek ve geliştirmek, talepleri yanıtlamak, istediğiniz bildirimleri iletmek, spam ve kötüye kullanımı önlemek, teknik sorunları gidermek ve yasal yükümlülüklere uymak için kullanılır.']],
      ['Veri Saklama', ['İletişim gönderileri; aktif bir proje, yasal yükümlülük, uyuşmazlık çözümü veya talep ettiğiniz iş ilişkisi için daha uzun süre tutulması gerekmedikçe 365 gün sonra otomatik silinmek üzere planlanır. Daha erken silme talep edebilirsiniz.']],
      ['Verilerin Açıklanması', ['Bilgiler; sitenin çalışması için gereken güvenilir hizmet sağlayıcılarla, yasal zorunluluk hâlinde veya hakları, mülkiyeti ve güvenliği korumak için gerekli olduğunda paylaşılabilir. Kişisel bilgiler satılmaz.']],
      ['Üçüncü Taraf Hizmetleri', ['Site; gizlilik odaklı toplu ölçümler için Vercel Analytics, uygulama verilerinin saklanması için MongoDB Atlas ve talep edilen e-posta bildirimleri için Gmail/SMTP kullanabilir. Bu sağlayıcıların kendi gizlilik politikaları vardır.']],
      ['Veri Koruma Haklarınız', ['Bulunduğunuz yere göre kişisel verilerinize erişme, düzeltme, silme, işlemeyi kısıtlama, işlemeye itiraz etme veya verileri taşıma talebinde bulunabilirsiniz. Kaliforniya sakinleri ayrıca bilgi edinme, silme, satıştan vazgeçme ve ayrımcılığa uğramama dâhil geçerli CCPA haklarını kullanabilir.']],
      ['Çocukların Gizliliği', ['Site 13 yaşın altındaki çocuklara yönelik değildir ve 13 yaşın altındaki çocuklardan bilerek kişisel bilgi toplanmaz.']],
      ['Bu Politikadaki Değişiklikler', ['Hizmetler veya yasal gereklilikler değiştiğinde bu politika güncellenebilir. Yeni bir sürüm yayımlandığında yukarıdaki yürürlük tarihi de güncellenir.']],
    ],
    contactTitle: 'İletişim', contactText: 'Gizlilik soruları veya talepleri için bize ulaşın:', contactLink: 'iletişim sayfamızı', emailPrefix: 'E-posta ile', pagePrefix: 'Şurayı ziyaret ederek'
  }
};

export default function PrivacyPolicyClient() {
  const { locale } = usePreferences();
  const copy = CONTENT[locale] || CONTENT.en;
  return (
    <div className="px-4 pb-16 pt-8">
      <header className="mx-auto mb-10 max-w-5xl border-b border-[#3e503e]/40 pb-6">
        <div className="flex items-center gap-3"><i className="fas fa-shield-alt text-2xl text-[#e8c547]"></i><div><h1 className="text-3xl font-bold text-white sm:text-4xl">{copy.title}</h1><p className="mt-1 text-sm text-gray-400">{copy.updated}</p></div></div>
      </header>
      <div className="privacy-copy prose prose-lg prose-invert mx-auto max-w-5xl">
        {copy.sections.map(([title, paragraphs]) => (
          <section className="mb-8" key={title}>
            <h2 className="mb-4 text-2xl font-semibold text-[#e8c547]">{title}</h2>
            {paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
          </section>
        ))}
        <section className="mb-8">
          <h2 className="mb-4 text-2xl font-semibold text-[#e8c547]">{copy.contactTitle}</h2>
          <p>{copy.contactText}</p>
          <ul className="mt-2 list-disc pl-6">
            <li>{copy.emailPrefix}: {SITE_CONFIG.author.email}</li>
            <li>{copy.pagePrefix} <Link href="/contact" className="text-[#e8c547] hover:underline">{copy.contactLink}</Link></li>
          </ul>
        </section>
      </div>
    </div>
  );
}
