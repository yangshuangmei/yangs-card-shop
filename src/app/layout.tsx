import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/Providers";
import FloatingContact from "@/components/FloatingContact";

export const metadata: Metadata = {
  title: "Yang's Card Shop - Premium Pokemon Cards",
  description: "The best place to buy rare and authentic Pokemon cards for TikTok collectors.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <Providers>
          {children}
          <FloatingContact />
        </Providers>
      </body>
    </html>
  );
}
