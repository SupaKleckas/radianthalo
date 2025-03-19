import type { Metadata } from "next";
import { Lexend_Zetta, Inter } from "next/font/google";
import "./globals.css";

const lexendZetta = Lexend_Zetta({
  variable: "--font-lexend-zetta",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Radiant Halo",
  description: "Beauty salon reservation system"
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body
        className={`${lexendZetta.variable} ${inter.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
