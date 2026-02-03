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
  title: "Land Mines DB & Character Simulator",
  description: "Character tracker and builder for To Another World... with Land Mines!",
};

import { auth, signIn, signOut } from "../../auth";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  return (
    <html lang="en">
      <body className={`${inter.variable} ${outfit.variable} antialiased`}>
        <div className="layout-wrapper">
          <header className="main-header glass-panel">
            <div className="container header-content">
              <Link href="/" className="logo">
                Land Mines DB
              </Link>
              <nav>
                <ul className="nav-links">
                  <li><Link href="/roster">Roster</Link></li>
                  <li><Link href="/skills">Skills</Link></li>
                  <li><Link href="/builder">Builder</Link></li>
                  <li>
                    {session ? (
                      <form
                        action={async () => {
                          "use server";
                          await signOut();
                        }}
                      >
                        <button type="submit" style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', font: 'inherit', fontWeight: 500 }}>
                          Logout
                        </button>
                      </form>
                    ) : (
                      <form
                        action={async () => {
                          "use server";
                          await signIn("google");
                        }}
                      >
                        <button type="submit" style={{ background: 'none', border: 'none', color: 'hsl(var(--accent-primary))', cursor: 'pointer', font: 'inherit', fontWeight: 500 }}>
                          Login
                        </button>
                      </form>
                    )}
                  </li>
                </ul>
              </nav>
            </div>
          </header>
          <main>{children}</main>
          <footer className="main-footer glass-panel">
            <div className="container footer-content">
              <p>Design &copy; {new Date().getFullYear()} J. Busch | All source data copyright of the original rights holders <Link href="/credits" className="hover-link">listed here</Link>.</p>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
