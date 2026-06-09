import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "WebCraft AI — Visual Page Builder",
  description: "Design web pages and animations interactively with AI",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
