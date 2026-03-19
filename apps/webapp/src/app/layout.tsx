import type { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
  title: "Derive",
  description:
    "Derive is a developer Q&A system that turns messy technical questions into structured answers with context, assumptions, and traceability."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
