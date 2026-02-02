import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import Link from 'next/link';
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Elysium - Character Data",
  description: "Character tracker and builder for To Another World! With Land Mines",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${outfit.variable} antialiased`}>
        <div className="layout-wrapper">
          <header className="main-header glass-panel">
            <div className="container header-content">
              <Link href="/" className="logo">
                Elysium
              </Link>
              <nav>
                <ul className="nav-links">
                  <li><Link href="/roster">Roster</Link></li>
                  <li><Link href="/skills">Skills</Link></li>
                  <li><Link href="/builder">Builder</Link></li>
                </ul>
              </nav>
            </div>
          </header>
          <main>{children}</main>
        </div>
      </body>
    </html>
  );
}
