# Bergaman.dev — UI/UX, Performans, Güvenlik ve SEO TODO Listesi

> Denetim tarihi: 14 Ağustos 2026  
> Kapsam: canlı üretim sitesi (`www.bergaman.dev`) + yerel kaynak kodu  
> Uygulama durumu: P0 düzeltmeleri ve ana P1/P2 uygulama dalgası production'a alındı. Bu dosya artık denetim planı ve kalan optimizasyon backlog'u olarak birlikte kullanılıyor.

## 14 Ağustos 2026 uygulama özeti

- Blog, Work ve Picks içerikleri Server Component + ISR/cache ile ilk HTML içinde render ediliyor; admin mutation'ları cache tag invalid ediyor.
- Blog detail tek server veri akışına taşındı; `BlogPosting` JSON-LD, canonical ve DB sitemap kapsamı eklendi.
- Eski profil fotoğrafı kaldırıldı; high-voltage yazısı, kapak görseli ve profesyonel skill içeriği production'da yayında.
- Picks 24 kayıtlık pagination/load-more akışına geçti; Spotify metadata server cache'e taşındı; eksik görseller ve Music kaydı düzeltildi.
- Admin parola/JWT rotation yapıldı; yalnızca bcrypt hash kabul ediliyor. Protected blog parolaları server-side hash/cookie akışına, rate limiting MongoDB ortak store'a taşındı.
- Contact verisinde ham IP yerine HMAC, 365 günlük TTL ve alan sınırları uygulanıyor. Bergasoft iş/proje inquiry akışı ve kayıt ID'si eklendi.
- Font Awesome CDN kaldırıldı; kullanılan ikonlardan üretilen yerel alt küme toplam yükü yaklaşık 295 KB'den 43 KB'ye indirildi.
- Next.js 16.3.1, Node 24.x ve güvenli minor bağımlılık dalgası uygulandı; production audit sonucu 0 açık.
- Analytics, Speed Insights, structured loglar, CI audit/typecheck/test/build ve Lighthouse CI bütçesi eklendi.
- Fixed header korundu; tek yükseklik değişkeni, skip-link, mobil scroll lock ve focus trap eklendi.
- Debug/test/seed/migrate/reset route'ları ve kullanılmayan Express CORS/Helmet/rate-limit bağımlılıkları kaldırıldı.

### Production sonrası temiz Lighthouse medianı (3 koşum)

| Sayfa | Performance | Accessibility | Best Practices | SEO | LCP | TBT | CLS |
|---|---:|---:|---:|---:|---:|---:|---:|
| Home | 70 | 100 | 100 | 100 | 5,67 sn | 58 ms | 0 |
| Writing | 75 | 100 | 100 | 100 | 4,81 sn | 18 ms | 0 |
| Work | 74 | 100 | 100 | 100 | 4,95 sn | 30 ms | 0 |
| Picks | 70 | 100 | 96 | 100 | 5,75 sn | 17 ms | 0 |
| Contact | 81 | 100 | 100 | 100 | 4,17 sn | 33 ms | 0,002 |
| About | 75 | 100 | 100 | 100 | 4,72 sn | 37 ms | 0 |

Tam rapor: `reports/lighthouse/2026-08-14-mobile.json`. Accessibility, CLS ve SEO hedefleri karşılandı; LCP/Performance bütçesi henüz karşılanmadığı için aşağıdaki ilgili maddeler açık kalır.

## Kısa karar: fixed header iyi mi?

Fixed header bu site için yanlış bir tercih değil. Uzun Blog, About, Portfolio ve Picks sayfalarında ana navigasyona sürekli erişim yararlı. Ancak mevcut header yaklaşık **81 px** yüksekliğinde, kalıcı `backdrop-blur` kullanıyor ve içerik `pt-20` (80 px) ile elle aşağı itiliyor.

Şimdilik fixed kalabilir; sekme geçişlerindeki 2–3 saniyelik gecikmenin ana nedeni header değil. Öncelik veri/render mimarisi olmalı. Daha sonra header şu hedeflerle iyileştirilmeli:

- Masaüstünde fixed veya sticky, mobilde 56–64 px kompakt yükseklik.
- Aşağı kaydırmada tamamen kaybolmamalı; gerekirse yalnızca kompaktlaşmalı.
- `scroll-margin-top`, skip link ve klavye focus davranışı eklenmeli.
- Fixed kalırsa header yüksekliği ile ana içerik offset'i tek CSS değişkeninden gelmeli.
- Sticky tercih edilirse header normal akışta kalacağı için elle `pt-20` verme ihtiyacı kaldırılmalı.
- Blur ve şeffaflık mobilde azaltılarak paint/compositor maliyeti yeniden ölçülmeli.

## Ölçüm özeti

Lighthouse 13.4.1, mobil profil, her route için bir üretim koşumu:

| Sayfa | Performance | Accessibility | Best Practices | SEO | FCP | LCP | TBT | Transfer |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| Home | 66 | 91 | 100 | 100 | 3,2 sn | 8,9 sn | 40 ms | 1.469 KiB |
| Writing | 69 | 98 | 100 | 100 | 3,2 sn | 7,9 sn | 30 ms | 1.796 KiB |
| Work | 66 | 91 | 100 | 100 | 3,1 sn | 8,4 sn | 20 ms | 1.421 KiB |
| Picks | 64 | 98 | 100 | 100 | 3,2 sn | 8,9 sn | 130 ms | 1.544 KiB |
| Contact | 71 | 100 | 100 | 100 | 3,0 sn | 6,3 sn | 40 ms | 1.175 KiB |
| About | 69 | 100 | 100 | 100 | 3,3 sn | 8,0 sn | 20 ms | 1.238 KiB |

Önemli notlar:

- Bunlar tek koşum sentetik laboratuvar ölçümleridir; gerçek kullanıcı p75 verisi değildir.
- Test ortamındaki Kaspersky eklentisi Lighthouse oturumuna yaklaşık 214 KB üçüncü taraf kaynak enjekte etti. Bu nedenle skorlar yön gösterir; temiz CI koşumuyla baseline tekrar alınmalıdır.
- Lighthouse raporları başarıyla üretildi; test sonundaki geçici klasör temizleme uyarısı site kaynaklı değildir.
- HTML TTFB/total süreleri üç sıcak ölçümde genel olarak **0,18–0,28 sn** aralığında ve sayfalar `X-Vercel-Cache: HIT` döndürüyor.
- `/api/posts` ilk ölçümde **0,69 sn**, sonraki ölçümlerde yaklaşık **0,19 sn** sürdü. MongoDB soğuk bağlantısı görünür bir değişken.
- Canlı tarayıcıda Home → Writing geçişinin URL/content aşaması yaklaşık **2,7 sn** sürdü.
- Writing ilk anda 5 statik yazı gösteriyor; API tamamlanınca 12 yazıya sıçrıyor. İlk içerikte bazı tarihler `Invalid Date`.
- Canlı üretim fonksiyonları `iad1`, statik sayfa yanıtı testte `fra1` üzerinden geldi. MongoDB bölgesi bilinmeden fonksiyon bölgesi değiştirilmemeli; önce uçtan uca gecikme ölçülmeli.
- Son 24 saatin Vercel error/warning loglarında hata yok. Mevcut info logları bağlantı durumunu gösteriyor fakat route süresi, request ID ve sorgu süresi vermiyor.
- Vercel Observability Plus sorgusu mevcut planda kullanılamıyor. Temel Speed Insights/Web Analytics kurulumu ve ücretsiz runtime logları yine kullanılabilir.

## Başarı hedefleri

- Mobil p75 LCP: **< 2,5 sn**
- Mobil p75 INP: **< 200 ms**
- CLS: **< 0,1**
- Sıcak istemci route geçişi: görünür ana içeriğe **< 500 ms**
- Soğuk route geçişi: görünür ana içeriğe **< 1,5 sn**
- Public sayfalarda ilk HTML içinde temel içerik bulunması; yalnızca skeleton HTML olmaması
- Sayfa açıldıktan sonra kart sayısı/tarihlerin değişmemesi
- Lighthouse Accessibility: **100**
- Production dependency audit: **0 high / 0 critical**
- Tek bir canonical hostname, sitemap'te bütün public sayfalar

---

## P0 — Önce yapılacaklar

### PERF-01 — Blog, Portfolio ve Picks verisini Server Component'te hazırla

- [ ] `/blog`, `/portfolio` ve `/picks` sayfalarını Server Component kabuğuna taşı.
- [ ] MongoDB/public veri okumasını route açıldıktan sonraki `useEffect` yerine sunucuda yap.
- [ ] Filtre, arama, sıralama ve modal gibi etkileşimleri küçük Client Component adalarına ayır.
- [ ] Sunucudan gelen `initialData` ile ilk HTML'i doldur; API hatasında statik fallback kullan.
- [ ] `revalidate`/cache tag belirle; admin kaydetme/silme işlemlerinde ilgili tag'i invalid et.
- [ ] Aynı veriyi almak için Server Component → kendi `/api/*` endpoint'i şeklinde ek HTTP turu atma; ortak server-only repository fonksiyonu kullan.
- [ ] `/blog` üzerindeki anlamsız `force-dynamic` kullanımını kaldır veya gerçek ihtiyacı belgeleyerek sınırla.

Kabul kriterleri:

- JavaScript kapalıyken Blog/Work/Picks temel kartları HTML'de görünür.
- Home → Writing sıcak geçişinde kartlar 500 ms içinde görünür.
- Blog açılırken 5 → 12 kart sıçraması ve `Invalid Date` görünmez.
- API veya MongoDB erişilemezken seçilmiş içerik ve kullanıcı dostu uyarı görünür.

### PERF-02 — Global client JavaScript yükünü küçült

- [ ] `VocabularyProvider` bütün siteyi sarmalamamalı; yalnızca `/vocabulary` route layout'una taşınmalı.
- [ ] Global `ImageWithFallback` MutationObserver kaldırılmalı; fallback davranışı kart/görsel bileşeninde yerel olarak ele alınmalı.
- [ ] `LayoutWrapper` yalnızca gerçekten interaktif küçük parçalara ayrılmalı; statik layout, footer ve içerik server tarafında kalmalı.
- [ ] Header'ın aktif route/mobil menü davranışı ayrı küçük client island olmalı.
- [ ] Kullanılmayan `next/head` import'u ve gereksiz effect/state kodu temizlenmeli.
- [ ] Bundle analyzer ile route bazında başlangıç JS bütçesi tanımlanmalı.

Kanıt: Lighthouse her ana route için yaklaşık **138–139 KiB kullanılmayan JavaScript** tasarrufu raporladı.

Kabul kriterleri:

- Home/Blog/Contact route'larında Vocabulary kodu ve Axios bundle'a girmez.
- Public route başlangıç JS'i baseline'a göre en az %25 azalır.
- Global MutationObserver bulunmaz.

### PERF-03 — Blog detayında metadata ve içeriği tek server fetch ile çöz

- [ ] DB yazılarında `generateMetadata` ve page içeriğinin kullandığı ortak `getPostBySlug()` fonksiyonunu React `cache()`/Next cache ile dedupe et.
- [ ] DB yazısını Server Component'te alıp `initialPost` olarak geçir; client mount sonrası ikinci `/api/posts?slug=...` çağrısını kaldır.
- [ ] Static ve DB yazıları için aynı normalleştirilmiş veri tipini kullan.
- [ ] `likes`, yorumlar ve admin etkileşimlerini ana yazı render'ından bağımsız yükle/stream et.

Kanıt: Runtime loglarında DB yazısı route'u ve `/api/posts` ayrı fonksiyon çağrıları oluşturuyor; DB yazılarının ilk HTML'i client fetch'e bağımlı.

### UI-01 — Blogdaki eski profil fotoğrafını tekilleştir

- [ ] Blog author kartındaki `/images/profile/profile.png` referansını yeni görselle değiştir.
- [ ] `SEO_DEFAULTS.openGraph`, admin profile/settings varsayılanları ve bütün author avatar fallback'lerini aynı kaynağa bağla.
- [ ] Profil verisini `SITE_CONFIG` veya ayrı bir canonical profile dosyasında tekilleştir.
- [ ] Eski dosya kaldırılacaksa önce tüm referansları temizle; CDN cache için yeni dosya adı/hash kullan.

Kanıt:

- Ana sayfa: `profile.jpg` — 10 Haziran 2026, 187 KB.
- Blog detay author kartı: `profile.png` — 14 Haziran 2025, 361 KB.
- Canlı high-voltage yazısında kapak doğru, eski kalan görsel author profil fotoğrafı.

Kabul kriteri: Home, About, blog author kartı, Open Graph/Twitter preview ve admin önizlemesi aynı güncel fotoğrafı kullanır.

### UI-02 — Blog ilk render ve tarih veri modelini düzelt

- [ ] `BlogPostCard` tarih için yalnızca `post.createdAt` kullanmamalı; normalize edilmiş tek `publishedAt` alanı kullan.
- [ ] Static yazıların `_id`, `createdAt`, `updatedAt`, `visibility`, `published` alanlarını eksiksiz hale getir veya normalize katmanında tamamla.
- [ ] Aynı slug hem DB hem static kaynakta varsa açık bir öncelik ve senkronizasyon kuralı tanımla.
- [ ] İlk render ile hydrate/API sonrası içerik sırası ve sayısı aynı olmalı.

### SEO-01 — Canonical hostname'i düzelt

- [ ] Tek bir ana hostname seç: mevcut Vercel davranışına göre öneri `https://www.bergaman.dev`.
- [ ] `SITE_CONFIG.url`, `metadataBase`, route canonical'ları, sitemap, robots, JSON-LD, e-posta linkleri ve OG URL'lerini aynı hostname'e taşı.
- [ ] Alternatif olarak apex ana domain seçilecekse Vercel redirect yönünü tersine çevir; iki yönlü/karışık sinyal bırakma.

Kanıt: `https://bergaman.dev` şu anda 308 ile `https://www.bergaman.dev` adresine gidiyor; canonical ve sitemap ise apex adreslerini yayımlıyor.

### SEO-02 — Sitemap'e bütün public DB yazılarını ekle

- [ ] Sitemap üretiminde yalnızca `src/data/blogPosts.js` kullanma; public/published DB yazılarını cache'li server sorgusuyla ekle.
- [ ] Private, members ve password içerikleri sitemap'e alma.
- [ ] Statik sayfalarda her build için `new Date()` yerine gerçek son değişiklik tarihini kullan.
- [ ] Sitemap'te duplicate slug ve redirect olan URL bırakma.
- [ ] Deploy sonrası Search Console'da sitemap'i yeniden gönder ve URL Inspection ile öncelikli sayfaları iste.

Kanıt: Canlı sitemap **11 URL** içeriyor; yalnızca 5 blog yazısı var. Canlı Blog 12 yazı gösterdiği için 7 DB yazısı sitemap dışında.

### SEO-03 — DB blog yazılarını taranabilir HTML yap

- [ ] DB yazı içeriği ve author bilgisi ilk server HTML'inde bulunmalı.
- [ ] Her yazıda Article/BlogPosting JSON-LD ekle: headline, image, datePublished, dateModified, author, canonical.
- [ ] Her yazı için benzersiz title, description ve OG image doğrula.
- [ ] Search Console'da rendered HTML ve canonical seçimini kontrol et.

### SEC-01 — Görselde ifşa olan admin parolasını döndür ve oturumları geçersiz kıl

- [ ] Daha önce ekran görüntüsünde görünen admin parolasını Vercel Production/Preview/Development ortamlarında yeni, benzersiz bir parola ile değiştir.
- [ ] Yeni parolayı yalnızca güvenli hash olarak sakla; düz metin env fallback kullanma.
- [ ] `JWT_SECRET` değerini de kontrollü biçimde döndürerek mevcut admin oturumlarını geçersiz kıl.
- [ ] Eski/yanlış env değişkenlerini kaldır; redeploy sonrası eski parola ve eski session cookie ile giriş yapılamadığını doğrula.
- [ ] Parolayı issue, commit, log, screenshot veya TODO içine yazma.

### SEC-02 — Admin parola doğrulamasını yalnızca güçlü hash'e indir

- [ ] `ADMIN_PASSWORD` ve bcrypt olmayan `ADMIN_PASSWORD_HASH` düz metin fallback'lerini kaldır.
- [ ] Tek desteklenen formatı bcrypt/Argon2id veya güncel güvenlik parametreli PBKDF2 olarak belirle.
- [ ] Uygulama başlangıcında güvenli hash yoksa fail closed davran.
- [ ] Secret rotation ve recovery prosedürünü kısa bir operasyon dokümanına yaz.

### SEC-03 — Password-protected blog tasarımını server-side yap

- [ ] Blog parolasını DB'de düz metin tutma; hash sakla.
- [ ] Public API response'una `password` veya hash alanını hiçbir koşulda ekleme.
- [ ] Parola kontrolünü server route/action üzerinde yap; kısa ömürlü, HttpOnly ve scoped erişim cookie/token üret.
- [ ] `sessionStorage` içinde düz metin parola saklama ve client'ta `post.password` karşılaştırmasını kaldır.
- [ ] Private/members/password içeriklerin liste, sitemap, RSC payload ve API'den sızmadığını test et.

Kanıt: Mevcut client kodu `passwordInput === post.password` karşılaştırması yapıyor; model de parolayı düz metin alan olarak tanımlıyor. Public API ise yalnızca public yazıları döndürdüğünden özellik aynı zamanda tutarsız/çalışmaz durumda.

### SEC-04 — Dağıtık rate limiting kullan

- [ ] Login, contact, comments, newsletter ve webhook limitlerini serverless instance belleğindeki `Map` yerine Upstash/Redis/Vercel Firewall gibi paylaşılan store'a taşı.
- [ ] IP + kullanıcı/hesap + action anahtarlarını ayrı uygula.
- [ ] Başarısız login limiti ile genel request limiti arasındaki davranışı tek testli politika haline getir.
- [ ] `reset-rate-limit` geçici route'unu kaldır; mevcut route gerçek module store'u zaten temizlemiyor.
- [ ] Rate-limit fail-open/fail-closed kararını endpoint riskine göre belirle.

### SEC-05 — High severity dependency açıklarını kapat

- [ ] Next.js/Sharp/Nanoid güvenlik zincirini güncelle.
- [ ] Önce Next.js ve `eslint-config-next` sürümlerini uyumlu **16.3.1** hattına yükseltip `npm audit --omit=dev` tekrar çalıştır.
- [ ] Image optimization, admin auth, upload ve production build regression testlerini çalıştır.
- [ ] CI'da high/critical audit bulgularını merge blocker yap.

Kanıt: Production audit sonucu **3 high**: doğrudan `next`, transitif `sharp`, transitif `nanoid`; critical yok.

---

## P1 — Yüksek öncelik

### PERF-04 — Font Awesome ve font yükünü azalt

- [ ] Harici Font Awesome CSS/webfont kullanımını yerel SVG veya zaten kurulu `react-icons` ile değiştir.
- [ ] `fa-solid-900` ve `fa-brands-400` global preload'larını kaldır.
- [ ] Yalnızca kullanılan ikonları import ederek tree-shaking doğrula.
- [ ] Geist Mono'yu yalnızca kod/mini app route'larında yüklemeyi değerlendir; normal sayfalarda gereksiz preload etme.

Kanıt:

- Cloudflare Font Awesome: yaklaşık **295 KB**.
- Yerel Geist Sans + Mono: yaklaşık **134 KB**.
- Font Awesome CSS render-blocking kritik yol üzerinde.

### PERF-05 — Favicon ve apple icon dosyalarını gerçek boyutlarında üret

- [ ] 16×16, 32×32, 180×180 ve uygun `.ico` varyantlarını ayrı optimize dosyalar olarak üret.
- [ ] Olmayan `/favicon-16x16.png` ve `/favicon-32x32.png` linklerini ya oluştur ya kaldır.
- [ ] `favicon.ico` ile `apple-touch-icon.png` aynı 189,6 KB dosya olmamalı.
- [ ] Metadata API ile `<head>` içindeki tekrarlı icon/link tanımlarını tekilleştir.

Kanıt: Her Lighthouse sayfasında icon grubu yaklaşık **241 KB**; 16×16 ve 32×32 URL'leri canlıda 404 ve 35 KB HTML hata sayfası döndürüyor.

### PERF-06 — Kart görsellerini ve responsive `sizes` değerlerini düzelt

- [ ] Gerçek mobil grid genişliğine göre `sizes` değerlerini düzelt; 378 px kart için 750 px kaynak indirilmesini engelle.
- [ ] PNG blog/project kapaklarını görsel kalite kontrolüyle WebP/AVIF'e dönüştür.
- [ ] Above-the-fold tek LCP görseline öncelik ver; diğerlerini lazy bırak.
- [ ] Admin upload sırasında maksimum çözünürlük, boyut, aspect ratio ve format dönüşümü uygula.
- [ ] Aynı görselin DB URL'si, uploads rewrite'ı ve static kopyası arasında duplicate kaynak bırakma.

Kanıt: Lighthouse tahmini görsel tasarrufu Home 109 KiB, Blog 340 KiB, Work 131 KiB, Picks 166 KiB.

### PERF-07 — Picks'i sayfala/virtualize et

- [ ] İlk istekte 500 kayıt isteme; örneğin 24 kayıt + category counts endpoint'i kullan.
- [ ] Sayfalama, “Load more” veya erişilebilir sanallaştırma uygula.
- [ ] 102 kaydın tamamını aynı anda DOM'a basma.
- [ ] Kategori istatistiklerini bütün array'i client'ta tekrar tekrar filtreleyerek hesaplama.
- [ ] Grid/list görünümü değişirken görsel cache ve scroll konumunu koru.

Kanıt: Picks yaklaşık **1.568 DOM node**, 102 kayıt ve en düşük performans skoru olan 64'e sahip.

### PERF-08 — Route loading UX'i gerçek gecikmeye göre tasarla

- [ ] Route bazlı `loading.js` kullan; header tıklamasına anında görünür geri bildirim ver.
- [ ] Tüm sayfayı skeleton ile değiştirmek yerine mevcut içerik/shell'i koru.
- [ ] Search input API çağrılarını 250–350 ms debounce et ve eski request'i `AbortController` ile iptal et.
- [ ] Filter/sort işlemlerinde `useTransition` ve `aria-busy` kullan.
- [ ] Next Link prefetch'in production'da `/blog`, `/portfolio`, `/picks`, `/contact` için gerçekleştiğini network testle doğrula.

### PERF-09 — MongoDB sorgu, cache ve region ölçümünü iyileştir

- [ ] Her public sorguya structured log ekle: route, requestId, connectMs, queryMs, serializeMs, totalMs, cache durumu.
- [ ] MongoDB Atlas bölgesini belgeleyip Vercel Function region ile karşılaştır.
- [ ] Region değişimini yalnızca p75/p95 ölçümle yap.
- [ ] Blog API'nin bütün eşleşen DB yazılarını 250'ye kadar çekip JS'de paginate etmesi yerine DB pagination/count veya materialized birleşik kaynak tasarla.
- [ ] Sorgularda `.lean()` kullan; Portfolio/Recommendation gibi salt okunur sorgularda Mongoose document hydration maliyetini kaldır.
- [ ] Admin mutation sonrası on-demand revalidation kullan.

### PERF-10 — Global görsel efekt bütçesi belirle

- [ ] Mobilde sürekli grid animasyonu, fixed background ve yoğun backdrop blur'u azalt.
- [ ] `prefers-reduced-motion` ile bütün dekoratif hareketleri kapat.
- [ ] Hover hareketini 2–4 px/az scale ile sınırla.
- [ ] Blur/gradient değişikliklerini Chrome Performance paint/composite kaydıyla karşılaştır.

### UI-03 — Home'un görsel ve semantik sırasını eşleştir

- [ ] Featured Projects DOM'da da Latest Blog Posts'tan önce gelmeli; yalnızca CSS `order-*` ile görsel sıra değiştirme.
- [ ] Ekran okuyucu, klavye tab sırası ve görsel sıra aynı olmalı.
- [ ] Ana sayfadaki Picks/Interests ağırlığını profesyonel hedefe göre azalt; kullanıcı onayı olmadan mevcut Technical Skills kart tasarımını değiştirme.

### UI-04 — Technical Skills verisini tekilleştir, mevcut kart görünümünü koru

- [ ] Home, About ve `constants.js` içindeki ayrı skill listelerini tek kaynağa bağla.
- [ ] Mevcut eski kart/progress tasarımı korunmalı; görsel yeniden tasarım ayrı onay gerektirmeli.
- [ ] Yüzdelerin anlamı açıklanmalı veya proje kanıtı ile desteklenmeli.
- [ ] High-voltage, power systems, protection/grounding, AutoCAD ve ilgili mühendislik yetkinlikleri profesyonel grupta görünmeli.
- [ ] Editör/AI araçları genel “araç kullanabilme” ifadesiyle verilebilir; marka listesi profesyonel değerin önüne geçmemeli.

### UI-05 — Picks görsel veri kalitesi ve Music kartını düzelt

- [ ] Admin kaydında zorunlu görsel/URL doğrulaması, aspect ratio ve preview ekle.
- [ ] Fotoğrafsız movie/game/book kayıtlarını veri migrasyonu ile tamamla.
- [ ] Link kartında dev boş görsel alanı yerine domain favicon + kısa marka tile tasarımı kullan.
- [ ] Music için Spotify oEmbed sonucunu server cache'inde tut; kart başına mount sonrası ayrı request üretme.
- [ ] Spotify URL'sini kart başlığı olarak göstermeyi bırak; track/album/artist alanlarını normalize et.
- [ ] Fallback görsel kategoriye uygun, kasıtlı ve erişilebilir olmalı.
- [ ] Broken image oranı ve source URL durumunu admin dashboard'da raporla.

### UI-06 — Portfolio bilgi mimarisini sadeleştir

- [ ] Üstte 3 Selected Case Study göster; problem, rol, yaklaşım ve sonuç alanlarını ekle.
- [ ] Kategori filtrelerini All/Web/Engineering/AI gibi en fazla 4 ana gruba indir.
- [ ] Çok az proje varken arama + 5 sort + çok kategori + stats yükünü azalt.
- [ ] Mini Apps'i ayrı Labs alanına taşı.
- [ ] Teknik hata mesajını kullanıcı dostu fallback metnine çevir.

### UI-07 — Erişilebilirlik hatalarını kapat

- [ ] ProjectCard icon-only GitHub linklerine `aria-label="View source code"` ekle.
- [ ] Icon-only hedefleri mobilde en az 44×44 px yap.
- [ ] ProjectCard “Dashboard” metninin kontrastını AA seviyesine çıkar.
- [ ] Blog kart heading seviyesini h1 → h2/h3 sırasına uygun yap.
- [ ] Picks kart heading sırasını düzelt.
- [ ] Blog category düğmesinin görünür adı ile accessible name'ini eşleştir.
- [ ] Tooltip'teki kritik bilgiyi hover'a bağımlı bırakma.

Kanıt: Home/Work'te kontrast ve isimsiz link; Blog'da heading order ve label/name mismatch; Picks'te heading order Lighthouse hataları var.

### UI-08 — Footer'ı sadeleştir ve sürüm kaynağını düzelt

- [ ] Marka, temel navigation, GitHub/LinkedIn/email ve copyright dışında kalan yoğun alanları azalt.
- [ ] Tech stack, MIT lisansı, eski portfolio ve build detaylarını README/More alanına taşı.
- [ ] Canlı footer'daki **2.6.1** ile `package.json` **2.8.0** farkını gider.
- [ ] `NEXT_PUBLIC_APP_VERSION` Vercel override'ının build değerini ezip ezmediğini kontrol et.

### UI-09 — Contact/Bergasoft mesajını bütün yüzeylerde eşleştir

- [ ] Contact metadata açıklamasını “soru/say hello” odağından project, software, automation ve electrical engineering işlerine çevir.
- [ ] Inquiry type seçeneklerini form, e-posta konusu ve admin filtreleriyle eşleştir.
- [ ] Başarı mesajında beklenen yanıt süresi ve kayıt ID'sini kullanıcı dostu biçimde göster.
- [ ] Bergasoft'ın hukuki/marka statüsüne uygun dil kullan; doğrulanmamış şirket iddiası üretme.

### UI-10 — About ve içerik yoğunluğunu azalt

- [ ] Profesyonel özet, deneyim, eğitim ve 3 ana capability ilk sırada olmalı.
- [ ] Hobileri kısa kişisel bölümde topla.
- [ ] Aynı beceri ve açıklamaları farklı bölümlerde tekrar etme.
- [ ] 89 KB HTML ve 677 DOM node olan About sayfasını içerik kaybetmeden sadeleştir.

### SEO-04 — Metadata ve social preview'ları güncelle

- [ ] Root OG image hâlâ eski `profile.png`; güncel görsele taşı.
- [ ] Contact/Portfolio/Picks açıklamalarını yeni profesyonel konumlandırmaya göre güncelle.
- [ ] JSON-LD `sameAs` içine doğru LinkedIn'i ekle; geçersiz/eski sosyal linkleri kaldır.
- [ ] `worksFor: Bergasoft` ifadesini gerçek duruma göre Organization, brand veya service olarak modelle.
- [ ] OG/Twitter kartlarını deploy öncesi otomatik screenshot/validator testine ekle.

### SEO-05 — Search Console çalışma akışı kur

- [ ] Domain property doğrulamasını kontrol et.
- [ ] Page indexing raporunda Crawled/Discovered — currently not indexed URL'lerini çıkar.
- [ ] 404, redirect, duplicate canonical ve soft-404 kayıtlarını temizle.
- [ ] Sitemap düzeltildikten sonra ana sayfa, Work, Blog ve high-voltage yazısı için re-index iste.
- [ ] Arama performansında query, impression, CTR ve average position baseline'ı kaydet.
- [ ] Lighthouse SEO 100 skorunu “Google görünürlüğü iyi” şeklinde yorumlama; indeks kapsamı ve içerik otoritesi ayrı ölçülmeli.

### SEC-06 — CSP'yi nonce/hash tabanlı hale getir

- [ ] Font Awesome CDN kaldırıldıktan sonra CSP kaynak listesini daralt.
- [ ] Production `script-src 'unsafe-inline'` kullanımını nonce/hash ile değiştir.
- [ ] Inline JSON-LD için güvenli serialize + nonce/hash stratejisi kullan.
- [ ] `frame-ancestors`, `upgrade-insecure-requests` ve gerekirse COOP/CORP politikalarını uyumluluk testiyle değerlendir.
- [ ] CSP violation reporting'i önce report-only modunda izle.

### SEC-07 — Global wildcard CORS başlığını kaldır

- [ ] Vercel project-level response header veya başka platform ayarında eklenen `Access-Control-Allow-Origin: *` kaynağını bul.
- [ ] Normal HTML sayfalarında CORS başlığı yayınlama.
- [ ] Public API gerekiyorsa yalnızca ilgili endpoint ve methodlarda açık politika uygula.
- [ ] Credential kullanan admin endpoint'lerinde allowlist + `Vary: Origin` kullan.

Kanıt: Canlı Home ve Blog HTML cevapları global `Access-Control-Allow-Origin: *` döndürüyor; bu başlık repo header kodunda görünmüyor.

### SEC-08 — Admin mutation savunmasını güçlendir

- [ ] SameSite cookie'ye ek olarak POST/PUT/PATCH/DELETE admin isteklerinde Origin/Host doğrulaması yap.
- [ ] Gerekirse CSRF token uygula.
- [ ] JWT'ye `iss`, `aud`, benzersiz `jti` ve kısa oturum/rotation politikası ekle.
- [ ] Admin session cookie silme/yenileme akışını Preview ve Production domainlerinde test et.
- [ ] Login audit loguna ham parola veya token yazmadan IP hash, sonuç ve request ID ekle.

### SEC-09 — Contact verisi için PII saklama politikası tanımla

- [ ] IP, user-agent ve referrer saklama amacını Privacy Policy ile eşleştir.
- [ ] Ham IP yerine risk ihtiyacına göre HMAC/hash veya kısaltılmış IP değerlendir.
- [ ] Contact kayıtlarına açık retention/delete süresi ve otomatik temizleme işi ekle.
- [ ] Header alanlarını DB'ye yazmadan önce uzunluk sınırı uygula.
- [ ] Admin export/reply akışında kişisel veri erişimini logla.

---

## P2 — Kalite, gözlemlenebilirlik ve teknoloji bakımı

### OBS-01 — Vercel Analytics ve Speed Insights'ı gerçekten bağla

- [ ] Kurulu `@vercel/analytics` paketi root layout'ta mount edilmemiş; `<Analytics />` ekle veya paketi kaldır.
- [ ] `@vercel/speed-insights` ekleyip route bazlı LCP/INP/CLS/TTFB p75 izle.
- [ ] Vercel dashboard ürünlerinin project ayarlarında açık olduğunu doğrula.
- [ ] Contact project inquiry ve project CTA tıklamalarını gizlilik uyumlu custom event olarak tanımla.
- [ ] RUM verisi düşük trafik nedeniyle yetersizse sentetik kontrolle birlikte yorumla.

### OBS-02 — Structured runtime log baseline'ı ekle

- [ ] Her API route için `start/done/failed`, route, requestId, status ve `durationMs` logla.
- [ ] DB connect ve query sürelerini ayrı alanlarla logla.
- [ ] E-posta gönderiminde contact ID, provider sonucu ve süreyi logla; içerik/PII loglama.
- [ ] Error loglarını route/status bazında haftalık gözden geçir.
- [ ] Observability Plus zorunlu olmayan temel Dashboard/CLI akışını dokümante et.

### QA-01 — Temiz CI Lighthouse baseline ve bütçe kur

- [ ] Kaspersky/extension olmayan CI Chrome'da Home/Blog/Work/Picks/Contact/About ölç.
- [ ] Her route için en az 3 koşum median değerini sakla.
- [ ] Performance < 85, Accessibility < 100, LCP > 2,5 sn veya JS budget aşımında CI uyarısı/engel oluştur.
- [ ] Auth gerektirmeyen smoke testlerde console error, 404 asset ve hydration hatalarını fail et.
- [ ] Mobile 360/390 px ve desktop 1440 px görsel regression snapshot'ları ekle.

### QA-02 — Kritik kullanıcı akışlarını otomatik test et

- [ ] Header route geçişleri ve active state.
- [ ] Blog liste → detay → geri dönüş; tarih ve kart sayısı stabilitesi.
- [ ] Portfolio API hata fallback'i.
- [ ] Picks filter/sort/music image fallback.
- [ ] Contact validation, spam/rate limit ve success state.
- [ ] Admin login success/failure/lockout/logout ve cookie davranışı.
- [ ] Sitemap'teki her URL'nin 200/canonical kontrolü.

### TECH-01 — Bağımlılıkları kontrollü dalgalar halinde güncelle

- [ ] Güvenlik/minor dalga: Next 16.3.1, eslint-config-next 16.3.1, Mongoose 8.24.3, Nodemailer 9.0.5, sanitize-html 2.17.7, PostCSS 8.5.26, Highlight.js 11.12.
- [ ] Major güncellemeleri ayrı PR'lara böl: Analytics 2, MongoDB 7, Mongoose 9, Tailwind 4, ESLint 10, Marked 18, TypeScript 7, cross-env 10.
- [ ] Her major için migration guide, build, unit, browser ve deployment smoke test çalıştır.
- [ ] `bcrypt` + `bcryptjs`, birden çok markdown/highlight paketi, `axios` + native fetch gibi duplicate yetenekleri azalt.
- [ ] Kullanılmayan production dependency'lerini bundle/dep scan ile kaldır.
- [ ] Vercel CLI 56.3.1 → 59.x güncellemesini uygulama bağımlılıklarından ayrı ele al.

### TECH-02 — Node/runtime sürümünü netleştir

- [ ] `engines.node: >=18` yerine CI ve Vercel ile aynı desteklenen LTS hattını pinle.
- [ ] Yerel, CI ve Vercel Node sürümlerini `.nvmrc`/Volta veya package manager politikasıyla eşleştir.
- [ ] Vercel function region ve runtime ayarlarını repo/operasyon dokümanında kaydet.

### TECH-03 — Veri modellerine validasyon ve index bakımı ekle

- [ ] Blog `slug`, visibility ve published indexlerini gerçek sorgu kombinasyonlarına göre compound index olarak değerlendir.
- [ ] Recommendation category/status/order sorgularına uygun compound index ekle.
- [ ] Contact userAgent/referrer/IP alanlarına maksimum uzunluk ve veri minimizasyonu uygula.
- [ ] Duplicate static/DB slug tespiti için admin validation ve migration script'i yaz.

### CLEAN-01 — Geçici/legacy route ve kodları temizle

- [ ] Production'da kapalı olsa da `blog-debug`, `debug`, `test-webhook`, `components-test`, seed/migrate/reset gibi route'ları ayrı internal tooling'e taşı veya kaldır.
- [ ] Kullanılmayan Helmet/CORS/Express uyarlamalarını Next.js route yaklaşımıyla sadeleştir.
- [ ] `src/lib/mongodb.js` içindeki tekrarlı connection option'larını temizle.
- [ ] Footer eski sürüm linki ve legacy yönlendirmelerin analytics kullanımını ölç; gereksiz olanları kaldır.

## Uygulama sırası önerisi

1. Admin parolası/JWT rotation ve dependency high açıkları.
2. Canonical hostname + sitemap + DB blog SSR.
3. Blog/Portfolio/Picks Server Component veri mimarisi.
4. Global VocabularyProvider ve Image MutationObserver kaldırılması.
5. Font Awesome, icon ve görsel optimizasyonu.
6. Picks pagination ve blog veri tekilleştirme.
7. Accessibility ve content/UI düzeltmeleri.
8. Analytics, Speed Insights, structured logs ve CI bütçeleri.
9. Major teknoloji güncellemeleri ve legacy cleanup.

## Denetim sonrası tekrar test matrisi

- [ ] Lighthouse mobile: 6 ana route × 3 koşum, median rapor.
- [ ] WebPageTest/clean Chrome: cold cache + warm cache, İstanbul/Avrupa'ya yakın test bölgesi.
- [ ] Vercel Speed Insights: 7 ve 28 günlük p75 route metrikleri.
- [ ] Curl: HTML/API TTFB, cache status, region header, response size.
- [ ] `npm audit --omit=dev`, lint, typecheck, unit test, production build.
- [ ] Security headers/CSP/CORS ve admin auth negative testleri.
- [ ] Search Console sitemap, canonical, index coverage ve rich result testleri.
- [ ] 390 px mobil: fixed header, focus, menu scroll lock, kart görselleri ve touch targets.
