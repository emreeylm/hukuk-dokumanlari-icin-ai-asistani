import { NextResponse } from "next/server";

const hfToken = process.env.HF_TOKEN;
const MODEL_NAME = "meta-llama/Meta-Llama-3.1-8B-Instruct";

export async function POST(req: Request) {
    try {
        if (!hfToken) {
            return NextResponse.json({
                error: "HF_TOKEN bulunamadı. Lütfen .env.local dosyasını kontrol edin."
            }, { status: 500 });
        }
        const { docType, parties, subject, facts } = await req.json();

        if (!docType || !parties || !subject || !facts) {
            return NextResponse.json({ error: "Eksik bilgi girdiniz." }, { status: 400 });
        }

        const prompt = `
      Sen Türkiye Cumhuriyeti kanunlarına hakim, profesyonel & kıdemli bir hukuk danışmanısın.
      Görevin: Aşağıdaki bilgilere dayanarak eksiksiz, resmi ve hukuka uygun bir "${docType}" hazırlamaktır.

      GİRDİLER:
      - TARAFLAR: ${parties}
      - KONU: ${subject}
      - OLAY ÖZETİ: ${facts}

      KURALLAR (KESİNLİKLE UYULACAK):
      1. SADECE döküman metnini üret. Başta veya sonda "Tabii, işte taslak..." gibi sohbet ifadeleri ASLA KULLANMA.
      2. Dil: Resmi, akademik ve 'istanbul Türkçesi' ile yazılmış hukuk terminolojisi.
      3. Format: Başlık, giriş, gelişme, sonuç ve imza bloklarını içeren standart hukuk dilekçesi formatı.
      4. Eksik bilgi varsa mantıklı varsayımlarda bulunma; [BOŞLUK] olarak bırak.
    `;

        const response = await fetch(
            "https://router.huggingface.co/v1/chat/completions",
            {
                headers: {
                    Authorization: `Bearer ${hfToken}`,
                    "Content-Type": "application/json",
                },
                method: "POST",
                body: JSON.stringify({
                    model: MODEL_NAME,
                    messages: [
                        { role: "system", content: "Sen yardımcı bir asistan değilsin. Sen sadece JSON veya saf metin çıktısı veren bir hukuk motorusun. Sohbet etme." },
                        { role: "user", content: prompt }
                    ],
                    max_tokens: 2048,
                    temperature: 0.3
                }),
            }
        );

        if (!response.ok) {
            const errorText = await response.text();
            console.error("HF API Error:", response.status, errorText);
            return NextResponse.json({
                error: `API Hatası: ${response.status} - ${errorText.substring(0, 200)}`
            }, { status: response.status });
        }

        const data = await response.json();
        const text = data.choices[0].message.content;

        return NextResponse.json({ content: text });
    } catch (error) {
        console.error("HF Generation Error:", error);
        const errorMessage = error instanceof Error ? error.message : "Bilinmeyen hata";
        return NextResponse.json({ error: `Doküman üretilirken hata: ${errorMessage}` }, { status: 500 });
    }
}
