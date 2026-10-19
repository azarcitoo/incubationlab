export type QuizQuestion = {
  question: string;
  options: string[];
  answer: number;
  explanation: string;
  source: string;
};

export const quizQuestions: QuizQuestion[] = [
  {
    question: "¿Cuál es la duración de referencia habitual para incubar huevos de gallina?",
    options: ["14 días", "21 días", "28 días"],
    answer: 1,
    explanation:
      "Veintiún días es una referencia habitual para la incubación de huevos de gallina; el tiempo real puede variar.",
    source: "Mississippi State University Extension",
  },
  {
    question: "Según la guía de Mississippi State University, ¿cuál es la temperatura de referencia para una incubadora de aire forzado?",
    options: ["37,8 °C", "38,9 °C", "36,7 °C"],
    answer: 0,
    explanation:
      "La guía cita aproximadamente 37,8 °C para incubadoras de aire forzado y 38,9 °C para incubadoras de aire quieto. Sigue siempre las instrucciones del fabricante del equipo.",
    source: "Mississippi State University Extension",
  },
  {
    question: "¿Qué lectura de bulbo húmedo cita la guía para los primeros 18 días?",
    options: ["23,9–25,0 °C", "29,4–30,6 °C", "31,7–32,2 °C"],
    answer: 1,
    explanation:
      "La guía indica aproximadamente 29,4–30,6 °C de bulbo húmedo durante los primeros 18 días y señala también el intervalo de humedad relativa correspondiente bajo las condiciones descritas.",
    source: "Mississippi State University Extension",
  },
  {
    question: "¿Qué pauta de volteo describe la guía durante los primeros 18 días?",
    options: ["Una vez por semana", "2–3 veces al día", "No voltear en ningún momento"],
    answer: 1,
    explanation:
      "La guía describe el volteo al menos 2–3 veces al día durante los primeros 18 días y detenerlo en los tres días previos a la eclosión.",
    source: "Mississippi State University Extension",
  },
  {
    question: "¿Cómo propone la guía ajustar la ventilación a medida que avanza la incubación?",
    options: [
      "Abrir gradualmente las entradas de aire",
      "Mantener siempre todas las entradas cerradas",
      "Usar un porcentaje universal fijo para cada día",
    ],
    answer: 0,
    explanation:
      "La guía recomienda aumentar gradualmente la apertura de las entradas de aire, cuidando que el flujo no reduzca demasiado la humedad. No establece un porcentaje universal diario.",
    source: "Mississippi State University Extension",
  },
  {
    question: "¿Qué describe mejor los estadios de Hamburger y Hamilton?",
    options: [
      "Una clasificación morfológica del desarrollo embrionario",
      "Una tabla que asigna exactamente un estadio a cada día de incubación",
      "Una escala para medir la viabilidad mediante ovoscopia",
    ],
    answer: 0,
    explanation:
      "Los estadios HH clasifican el desarrollo por rasgos morfológicos. No equivalen rígidamente a un día de incubación.",
    source: "Hamburger y Hamilton (1951)",
  },
  {
    question: "¿Qué reserva nutritiva utiliza principalmente el embrión durante el desarrollo?",
    options: ["El vitelo", "La cáscara", "La cámara de aire"],
    answer: 0,
    explanation:
      "El vitelo almacena nutrientes que el embrión utiliza durante su desarrollo; el saco vitelino participa en su transporte.",
    source: "UNSW Embryology",
  },
  {
    question: "¿Qué membrana contribuye al intercambio gaseoso a través de la cáscara?",
    options: ["La membrana corioalantoidea", "El amnios", "La membrana vitelina"],
    answer: 0,
    explanation:
      "La membrana corioalantoidea se vasculariza y participa en el intercambio de oxígeno y dióxido de carbono a través de los poros de la cáscara.",
    source: "UNSW Embryology; Hamburger y Hamilton (1951)",
  },
];
