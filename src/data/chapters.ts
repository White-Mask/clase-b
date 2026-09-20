export const chapters = [
  {
    id: "principios-conduccion",
    name: "Principios de la conducción",
    shortName: "Principios",
    icon: "Gauge",
    description:
      "Funcionamiento del vehículo, física, frenado y sistemas de seguridad.",
  },
  {
    id: "persona-transito",
    name: "La persona en el tránsito",
    shortName: "La persona",
    icon: "Brain",
    description:
      "Percepción, alcohol, drogas, medicamentos, estrés, sueño y fatiga.",
  },
  {
    id: "convivencia-vial",
    name: "Convivencia vial",
    shortName: "Convivencia",
    icon: "Users",
    description:
      "Usuarios vulnerables, peatones, ciclistas, motociclistas y seguridad infantil.",
  },
  {
    id: "normas-circulacion",
    name: "Normas de circulación",
    shortName: "Normas",
    icon: "TrafficCone",
    description:
      "Prioridades, señales, velocidad, virajes, adelantamientos y estacionamiento.",
  },
  {
    id: "circunstancias-especiales",
    name: "Conducción en circunstancias especiales",
    shortName: "Condiciones",
    icon: "CloudRain",
    description:
      "Noche, autopistas, túneles, lluvia, nieve, hielo, niebla y viento.",
  },
  {
    id: "conduccion-eficiente",
    name: "Conducción eficiente",
    shortName: "Eficiencia",
    icon: "Leaf",
    description:
      "Consumo, planificación, mantenimiento y técnicas de conducción eficiente.",
  },
  {
    id: "informaciones-importantes",
    name: "Informaciones importantes",
    shortName: "Información",
    icon: "ShieldAlert",
    description:
      "Siniestros, primeros auxilios, documentos, infracciones y emergencias.",
  },
] as const;

export type ChapterId = (typeof chapters)[number]["id"];
