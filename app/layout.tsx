import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";

export const metadata: Metadata = {
  title: "LeafScan — Plant Disease Detection",
  description: "AI-powered plant disease detection.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-black-base min-h-screen">
        <nav className="sticky top-0 z-50 border-b border-green-dark bg-black-base/80 backdrop-blur-md px-6 py-4 flex justify-between items-center">
          <span className="font-display text-3xl text-green-neon tracking-widest">
            🌿 LeafScan
          </span>
          <div className="flex gap-8">
            <Link
              href="/"
              className="text-[#7da87d] hover:text-green-neon transition-colors text-sm"
            >
              Home
            </Link>
            <Link
              href="/supported"
              className="text-[#7da87d] hover:text-green-neon transition-colors text-sm"
            >
              Supported Plants
            </Link>
          </div>
        </nav>
        {children}
      </body>
    </html>
  );
}
