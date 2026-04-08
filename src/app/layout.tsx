import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Selvo AI Receptionist",
  description: "Your 24/7 AI Sales & Support assistant on WhatsApp",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`antialiased`}>
        {children}
      </body>
    </html>
  );
}
