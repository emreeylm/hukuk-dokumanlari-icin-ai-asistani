import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Yasal Doküman AI Asistanı | Hukuk MVP",
  description: "Avukatlar için yapay zeka destekli hukuki doküman hazırlama asistanı.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body className="antialiased">
        <main>{children}</main>
        <div className="legal-footer">
          <p>© 2026 Yasal Doküman AI Asistanı. Bu uygulama hukuki danışmanlık vermez.</p>
        </div>
      </body>
    </html>
  );
}
