import type { Metadata } from "next";
import Script from "next/script";
import "./legacy.css";
import "./base-overrides.css";

export const metadata: Metadata = {
  title: "Akhil Sebastian — ATE Test Engineer | Semiconductor Testing | Embedded Systems",
  // same tab icon as the original single-file site
  icons: { icon: { url: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAzMiAzMiI+CiAgPHJlY3Qgd2lkdGg9IjMyIiBoZWlnaHQ9IjMyIiByeD0iNiIgZmlsbD0iIzAzMDgwNSIvPgogIDxyZWN0IHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiIgcng9IjYiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzAwZTU3YSIgc3Ryb2tlLXdpZHRoPSIxLjUiLz4KICA8dGV4dCB4PSIxNiIgeT0iMjIiIGZvbnQtZmFtaWx5PSJtb25vc3BhY2UiIGZvbnQtc2l6ZT0iMTMiIGZvbnQtd2VpZ2h0PSI3MDAiIAogICAgZmlsbD0iIzAwZTU3YSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgbGV0dGVyLXNwYWNpbmc9IjAuNSI+QVM8L3RleHQ+Cjwvc3ZnPg==", type: "image/svg+xml" } },
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
