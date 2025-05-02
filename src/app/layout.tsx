import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from 'next-themes';


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
      <body>
        <ThemeProvider attribute={"class"} defaultTheme="system" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
