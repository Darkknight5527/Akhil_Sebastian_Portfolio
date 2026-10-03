import type { Metadata } from "next";
import Script from "next/script";
import "@fontsource-variable/outfit";
import "./globals.css";

export const metadata: Metadata = {
  title: "Akhil Sebastian — Portfolio",
  description:
    "Akhil Sebastian — EEE engineer working in semiconductor ATE on the Advantest V93000. Robotics, embedded systems, drones and test engineering.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
        <Script src="https://www.googletagmanager.com/gtag/js?id=G-CQ0ZYMLB0S" strategy="afterInteractive" />
        <Script id="ga" strategy="afterInteractive">
          {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','G-CQ0ZYMLB0S');`}
        </Script>
      </body>
    </html>
  );
}
