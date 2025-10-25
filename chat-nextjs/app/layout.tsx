import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Chat App - Next.js + PartyKit",
  description: "Aplicación de chat en tiempo real con Next.js y PartyKit",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
