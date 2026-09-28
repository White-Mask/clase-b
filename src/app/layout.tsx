import type {
  Metadata,
  Viewport,
} from "next";

import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Clase B Chile",
    template: "%s · Clase B Chile",
  },

  description:
    "Practica y prepárate para el examen teórico de conducción Clase B en Chile.",

  applicationName:
    "Clase B Chile",

  manifest: "/manifest.webmanifest",

  appleWebApp: {
    capable: true,
    statusBarStyle:
      "default",
    title: "Clase B",
  },

  formatDetection: {
    telephone: false,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#0f172a",
};

export default function RootLayout({
  children,
}: Readonly<{
  children:
    React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
