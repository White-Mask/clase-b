import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Clase B | Simulador de conducción",
  description:
    "Practica para el examen teórico de conducción Clase B en Chile.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
