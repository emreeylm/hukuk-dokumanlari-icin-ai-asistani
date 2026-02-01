# Hukuk Dökümanları için AI Asistanı

LegalDoc AI, Türk hukuk sistemi için geliştirilmiş, yapay zeka destekli bir hukuk dökümanı hazırlama asistanıdır. Rehberli sihirbaz arayüzü sayesinde kullanıcıların hızlıca dilekçe, sözleşme ve ihtarname taslakları oluşturmasına olanak tanır.

## 🚀 Özellikler
- **Modern Arayüz**: Koyu tema ve glassmorphism tasarımı ile premium deneyim.
- **Rehberli Sihirbaz**: Döküman oluşturma sürecinde adım adım asistan desteği.
- **Döküman Yönetimi**: Oluşturulan dökümanları tarayıcıda (localStorage) saklama ve yönetme.
- **Tam Liste Görünümü**: Tüm geçmiş belgeleri tek bir ekranda görebilme.
- **Profesyonel Yazdırma**: Dökümanlara özel baskı tasarımı ve "Yazdır" butonu.
- **Yapay Zeka Entegrasyonu**: Llama 3 / Hugging Face altyapısı ile akıllı döküman kurgulama.
- **Responsive**: Mobil ve masaüstü cihazlar için tam uyumlu.

## 🛠️ Teknoloji Yığını
- **Framework**: [Next.js 15+](https://nextjs.org/)
- **Dil**: TypeScript
- **Stil**: Vanilla CSS (Modern Flexbox/Grid)
- **Yapay Zeka**: Hugging Face Inference API
- **İkonlar**: Lucide React
- **Döküman İşleme**: jsPDF & docx

## 🚦 Başlangıç

### Ön Gereksinimler
- Bilgisayarınızda Node.js kurulu olmalıdır.
- Bir Hugging Face (HF_TOKEN) API anahtarı.

### Kurulum
1. Depoyu klonlayın veya dosyaları indirin.
2. Bağımlılıkları yükleyin:
   ```bash
   npm install
   ```
3. Kök dizinde bir `.env.local` dosyası oluşturun ve API anahtarınızı ekleyin:
   ```env
   HF_TOKEN=api_anahtariniz_buraya
   ```

### Yerel Çalıştırma
```bash
npm run dev
```
Uygulamayı görmek için [http://localhost:3000](http://localhost:3000) adresini açın.

## ⚖️ Lisans ve Sorumluluk Reddi
Bu proje, hukuki döküman hazırlama süreçlerine yardımcı olmak amacıyla geliştirilmiş bir MVP'dir. Yapay zeka tarafından üretilen içerikler her zaman yetkili bir hukuk profesyoneli tarafından kontrol edilmelidir. Bu uygulama hukuki danışmanlık vermez.
