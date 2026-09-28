import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Clase B Chile",
    short_name: "Clase B",
    description:
      "Practica y prepárate para el examen teórico de conducción Clase B en Chile.",
    start_url: "/",
    display: "standalone",
    background_color: "#f8fafc",
    theme_color: "#0f172a",
    orientation: "portrait",
    lang: "es-CL",
    categories: [
      "education",
      "utilities",
    ],
  };
}
