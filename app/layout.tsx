import type { Metadata } from "next";
import Script from "next/script";
import "./legacy.css";
import "./base-overrides.css";

export const metadata: Metadata = {
  title: "Akhil Sebastian — ATE Test Engineer | Semiconductor Testing | Embedded Systems",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@300;400;500&family=Space+Mono:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        {children}
        {/* Google Analytics (same as the original page) */}
        <Script src="https://www.googletagmanager.com/gtag/js?id=G-CQ0ZYMLB0S" strategy="afterInteractive" />
        <Script id="ga" strategy="afterInteractive">
          {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','G-CQ0ZYMLB0S');`}
        </Script>
      </body>
    </html>
  );
}
