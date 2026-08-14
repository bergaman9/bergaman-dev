"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { TR_BLOG_TRANSLATIONS } from '@/data/blogTranslations.tr';

const PreferencesContext = createContext(null);

const dictionaries = {
  en: {
    home: 'Home', about: 'About', work: 'Work', writing: 'Writing', picks: 'Picks', contact: 'Contact',
    themeLight: 'Use light theme', themeDark: 'Use dark theme', language: 'Türkçe kullan',
    selectedProjects: 'Selected Projects', aboutExperience: 'About & Experience', discussProject: 'Discuss a Project',
    heroRole: 'Electrical & Electronics Engineer & Full-Stack Developer', heroElectrical: 'Electrical & Electronics Engineer', heroDeveloper: 'Full-Stack Developer', heroPower: 'High-Voltage & Power Systems',
    heroSummary: 'I build reliable web, automation, and electrical engineering solutions by combining engineering fundamentals with modern software development.',
    featuredProjects: 'Featured Projects', noFeaturedProjects: 'No featured projects found.', viewAllProjects: 'View All Projects', latestPosts: 'Latest Blog Posts', noPosts: 'No blog posts found.', viewAllPosts: 'View All Posts',
    miniAppsVaults: 'Mini Apps & Vaults', exploreAll: 'Explore all', technicalSkills: 'Technical Skills', interestsPassions: 'Interests & Passions', buildBergasoft: 'Build with Bergasoft', moreAbout: 'More About Me',
    contactCta: "Have a software project, automation need, electrical engineering opportunity, or technical product in mind? Share the scope and let's explore how I can help.",
    selectedWork: 'Selected Work', selectedWorkSubtitle: 'Software, automation and engineering projects focused on solving practical problems', selectedCaseStudies: 'Selected Case Studies', allProjects: 'All Projects', browseCapability: 'Browse by core capability.',
    filterAll: 'All', filterWeb: 'Web', filterEngineering: 'Engineering', filterAi: 'AI', tryAgain: 'Try Again', loading: 'Loading…', projectLoadError: 'Projects could not be loaded right now. Please try again shortly.', noCategoryProjects: 'No projects in this category yet', categoryExpanding: 'Explore all work while this section is being expanded.', viewAll: 'View All', filterProjects: 'Filter projects',
    myPicks: 'My Picks', picksSubtitle: 'Curated collection of movies, games, books, music, and more', movies: 'Movies', games: 'Games', books: 'Books', music: 'Music', tvSeries: 'TV Series', links: 'Links', sortBy: 'Sort by:', newest: 'Newest First', oldest: 'Oldest First', highestRated: 'Highest Rated', titleAz: 'Title A-Z', curatedPicks: 'Curated picks', noPicks: 'No picks found', picksSoon: 'New picks are added regularly — check back soon!', viewAllPicks: 'View all picks →', loadingPicks: 'Loading more picks…', gridView: 'Grid view', listView: 'List view', backTop: 'Back to top',
    contactMe: 'Contact Me', contactSubtitle: "Have a software project, electrical engineering opportunity, automation need, or collaboration in mind? Contact Bergasoft and let's discuss the work.", letsConnect: "Let's Connect", contactIntro: 'Bergasoft is open to project inquiries, engineering opportunities, technical consulting, collaborations, and product work across software, automation, and electrical systems.', emailMe: 'Email Me', portfolio: 'Portfolio', responseTime: 'Response Time', responseValue: 'Usually within 1–2 business days', sendMessage: 'Send me a Message', messageSuccess: 'Message sent successfully!', messageThanks: "Thanks for reaching out — I'll usually reply within 1–2 business days.", sendError: 'Something went wrong while sending your message. Please try again in a moment.', yourName: 'Your Name', enterName: 'Enter your name', yourEmail: 'Your Email', enterEmail: 'Enter your email', howHelp: 'How can I help?', yourMessage: 'Your Message', messagePlaceholder: 'Tell me about the goal, scope, timeline, and how I can help...', sending: 'Sending Message...', send: 'SEND MESSAGE', additionalInfo: 'Additional Information', location: 'Location:', locationValue: 'Istanbul, Turkey', timezone: 'Timezone:', timezoneValue: 'GMT+3 (Turkey Time)', languages: 'Languages:', languagesValue: 'Turkish, English, German', availability: 'Availability:', availabilityValue: 'Monday - Friday', services: 'Services:', servicesValue: 'Software, automation, electrical engineering',
    projectInquiry: 'Project inquiry', electricalOpportunity: 'Electrical engineering opportunity', softwareDevelopment: 'Software development', automationIot: 'Automation / IoT', collaboration: 'Collaboration', generalQuestion: 'General question',
    posts: 'Posts', categories: 'Categories', searchPosts: 'Search posts...', allCategories: 'All Categories', filteringTag: 'Filtering by tag:', blogPosts: 'Blog posts', previous: 'Previous', next: 'Next', clearFilters: 'Clear filters', noPostMatches: 'No posts match your filters', noLairPosts: 'No posts in the lair yet', tryDifferentFilter: 'Try a different search term or category.', newArticlesSoon: 'New articles are being forged — check back soon.',
    tags: 'Tags', views: 'views', comments: 'comments', postNotFound: 'Post Not Found', protectedPost: 'Protected Post', protectedPrompt: 'This post is password protected. Please enter the password to continue.',
    commentsDisabled: 'Comments are currently disabled for this post.', noComments: 'No comments yet. Be the first to share your thoughts!', leaveComment: 'Leave a Comment', name: 'Name', email: 'Email', message: 'Message', postComment: 'Post Comment', submitting: 'Submitting...', commentModerated: 'Comments are moderated and will be reviewed before being published.',
  },
  tr: {
    home: 'Ana Sayfa', about: 'Hakkımda', work: 'Projeler', writing: 'Yazılar', picks: 'Seçtiklerim', contact: 'İletişim',
    themeLight: 'Açık temayı kullan', themeDark: 'Koyu temayı kullan', language: 'Use English',
    selectedProjects: 'Seçili Projeler', aboutExperience: 'Hakkımda ve Deneyim', discussProject: 'Projeyi Görüşelim',
    heroRole: 'Elektrik-Elektronik Mühendisi ve Full-Stack Geliştirici', heroElectrical: 'Elektrik-Elektronik Mühendisi', heroDeveloper: 'Full-Stack Geliştirici', heroPower: 'Yüksek Gerilim ve Güç Sistemleri',
    heroSummary: 'Mühendislik temellerini modern yazılım geliştirmeyle birleştirerek güvenilir web, otomasyon ve elektrik mühendisliği çözümleri geliştiriyorum.',
    featuredProjects: 'Öne Çıkan Projeler', noFeaturedProjects: 'Öne çıkan proje bulunamadı.', viewAllProjects: 'Tüm Projeleri Gör', latestPosts: 'Son Blog Yazıları', noPosts: 'Blog yazısı bulunamadı.', viewAllPosts: 'Tüm Yazıları Gör',
    miniAppsVaults: 'Mini Uygulamalar ve Kasalar', exploreAll: 'Tümünü keşfet', technicalSkills: 'Teknik Yetkinlikler', interestsPassions: 'İlgi Alanları ve Tutkular', buildBergasoft: 'Bergasoft ile Birlikte Üretelim', moreAbout: 'Daha Fazla Bilgi',
    contactCta: 'Bir yazılım projeniz, otomasyon ihtiyacınız, elektrik mühendisliği fırsatınız veya teknik ürün fikriniz mi var? Kapsamı paylaşın, nasıl katkı sağlayabileceğimi birlikte değerlendirelim.',
    selectedWork: 'Seçili Çalışmalar', selectedWorkSubtitle: 'Gerçek problemlerin çözümüne odaklanan yazılım, otomasyon ve mühendislik projeleri', selectedCaseStudies: 'Seçili Vaka Çalışmaları', allProjects: 'Tüm Projeler', browseCapability: 'Temel yetkinlik alanına göre inceleyin.',
    filterAll: 'Tümü', filterWeb: 'Web', filterEngineering: 'Mühendislik', filterAi: 'Yapay Zekâ', tryAgain: 'Tekrar Dene', loading: 'Yükleniyor…', projectLoadError: 'Projeler şu anda yüklenemedi. Lütfen kısa süre sonra tekrar deneyin.', noCategoryProjects: 'Bu kategoride henüz proje yok', categoryExpanding: 'Bu bölüm genişletilirken tüm çalışmaları inceleyebilirsiniz.', viewAll: 'Tümünü Gör', filterProjects: 'Projeleri filtrele',
    myPicks: 'Seçtiklerim', picksSubtitle: 'Film, oyun, kitap, müzik ve daha fazlasından seçilmiş koleksiyon', movies: 'Filmler', games: 'Oyunlar', books: 'Kitaplar', music: 'Müzik', tvSeries: 'Diziler', links: 'Bağlantılar', sortBy: 'Sırala:', newest: 'En Yeniler', oldest: 'En Eskiler', highestRated: 'En Yüksek Puan', titleAz: 'Başlık A-Z', curatedPicks: 'Özenle seçilenler', noPicks: 'Seçim bulunamadı', picksSoon: 'Yeni seçimler düzenli olarak ekleniyor — yakında tekrar göz atın!', viewAllPicks: 'Tüm seçimleri gör →', loadingPicks: 'Daha fazla seçim yükleniyor…', gridView: 'Izgara görünümü', listView: 'Liste görünümü', backTop: 'Yukarı dön',
    contactMe: 'Benimle İletişime Geçin', contactSubtitle: 'Bir yazılım projesi, elektrik mühendisliği fırsatı, otomasyon ihtiyacı veya iş birliği fikriniz mi var? Bergasoft ile iletişime geçin, işi birlikte değerlendirelim.', letsConnect: 'Bağlantı Kuralım', contactIntro: 'Bergasoft; yazılım, otomasyon ve elektrik sistemlerinde proje taleplerine, mühendislik fırsatlarına, teknik danışmanlığa, iş birliklerine ve ürün çalışmalarına açıktır.', emailMe: 'E-posta Gönderin', portfolio: 'Portföy', responseTime: 'Yanıt Süresi', responseValue: 'Genellikle 1–2 iş günü içinde', sendMessage: 'Mesaj Gönderin', messageSuccess: 'Mesajınız başarıyla gönderildi!', messageThanks: 'İletişime geçtiğiniz için teşekkürler — genellikle 1–2 iş günü içinde yanıt veririm.', sendError: 'Mesajınız gönderilirken bir sorun oluştu. Lütfen biraz sonra tekrar deneyin.', yourName: 'Adınız', enterName: 'Adınızı girin', yourEmail: 'E-posta Adresiniz', enterEmail: 'E-posta adresinizi girin', howHelp: 'Nasıl yardımcı olabilirim?', yourMessage: 'Mesajınız', messagePlaceholder: 'Hedefi, kapsamı, zaman planını ve nasıl yardımcı olabileceğimi anlatın...', sending: 'Mesaj Gönderiliyor...', send: 'MESAJ GÖNDER', additionalInfo: 'Ek Bilgiler', location: 'Konum:', locationValue: 'İstanbul, Türkiye', timezone: 'Saat dilimi:', timezoneValue: 'GMT+3 (Türkiye Saati)', languages: 'Diller:', languagesValue: 'Türkçe, İngilizce, Almanca', availability: 'Uygunluk:', availabilityValue: 'Pazartesi - Cuma', services: 'Hizmetler:', servicesValue: 'Yazılım, otomasyon, elektrik mühendisliği',
    projectInquiry: 'Proje talebi', electricalOpportunity: 'Elektrik mühendisliği fırsatı', softwareDevelopment: 'Yazılım geliştirme', automationIot: 'Otomasyon / IoT', collaboration: 'İş birliği', generalQuestion: 'Genel soru',
    posts: 'Yazılar', categories: 'Kategoriler', searchPosts: 'Yazılarda ara...', allCategories: 'Tüm Kategoriler', filteringTag: 'Etikete göre filtreleniyor:', blogPosts: 'Blog yazıları', previous: 'Önceki', next: 'Sonraki', clearFilters: 'Filtreleri temizle', noPostMatches: 'Filtrelerinize uyan yazı bulunamadı', noLairPosts: 'Henüz blog yazısı yok', tryDifferentFilter: 'Farklı bir arama veya kategori deneyin.', newArticlesSoon: 'Yeni yazılar hazırlanıyor — yakında tekrar göz atın.',
    tags: 'Etiketler', views: 'görüntülenme', comments: 'yorum', postNotFound: 'Yazı Bulunamadı', protectedPost: 'Korumalı Yazı', protectedPrompt: 'Bu yazı parola ile korunuyor. Devam etmek için parolayı girin.',
    commentsDisabled: 'Bu yazıda yorumlar şu anda kapalı.', noComments: 'Henüz yorum yok. İlk düşüncenizi siz paylaşın!', leaveComment: 'Yorum Bırakın', name: 'Ad', email: 'E-posta', message: 'Mesaj', postComment: 'Yorumu Gönder', submitting: 'Gönderiliyor...', commentModerated: 'Yorumlar yayınlanmadan önce incelenir.',
  },
};

export function PreferencesProvider({ children }) {
  const [theme, setThemeState] = useState('dark');
  const [locale, setLocaleState] = useState('en');

  useEffect(() => {
    const savedTheme = localStorage.getItem('bergaman-theme');
    const savedLocale = localStorage.getItem('bergaman-locale');
    setThemeState(savedTheme === 'light' ? 'light' : 'dark');
    setLocaleState(savedLocale === 'tr' ? 'tr' : 'en');
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
    localStorage.setItem('bergaman-theme', theme);
  }, [theme]);

  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dataset.locale = locale;
    localStorage.setItem('bergaman-locale', locale);
  }, [locale]);

  const setTheme = useCallback((value) => setThemeState(value === 'light' ? 'light' : 'dark'), []);
  const setLocale = useCallback((value) => setLocaleState(value === 'tr' ? 'tr' : 'en'), []);
  const t = useCallback((key) => dictionaries[locale]?.[key] || dictionaries.en[key] || key, [locale]);
  const value = useMemo(() => ({ theme, locale, setTheme, setLocale, t }), [theme, locale, setTheme, setLocale, t]);

  return <PreferencesContext.Provider value={value}>{children}</PreferencesContext.Provider>;
}

export function usePreferences() {
  const context = useContext(PreferencesContext);
  if (!context) throw new Error('usePreferences must be used inside PreferencesProvider');
  return context;
}

export function localizePost(post, locale) {
  if (!post || locale !== 'tr') return post;
  const translation = post.translations?.tr || post.tr || {};
  const fallback = TR_BLOG_TRANSLATIONS[post.slug] || {};
  return {
    ...post,
    title: translation.title || post.titleTr || fallback.title || post.title,
    description: translation.description || translation.excerpt || post.descriptionTr || fallback.description || post.description,
    content: translation.content || post.contentTr || fallback.content || post.content,
  };
}
