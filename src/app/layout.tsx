import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from 'next-themes';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: "Magic Card Converter",
  description: "Convert Magic the Gathering card formats",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable}`}
      >
        <ThemeProvider attribute={"class"} defaultTheme="system" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
