import type { DevelopmentStructure } from "./structures";

export type DevelopmentDay = {
  day: number;
  stage: string;
  description: string;
  changes: string[];
  structures: DevelopmentStructure[];
  curiosity: string;
};

export const developmentDays: DevelopmentDay[] = [
  {
    day: 1,
    stage: "Inicio del desarrollo",
    description:
      "Al comenzar la incubación, se reanuda el desarrollo embrionario, que se había ralentizado durante el almacenamiento del huevo. La actividad celular temprana ocurre en el disco germinal.",
    changes: ["Se organizan las primeras células del embrión.", "Empieza la formación de los ejes corporales."],
    structures: ["Disco germinal", "Blastodermo temprano"],
    curiosity: "El desarrollo empieza antes de la puesta; la incubación permite que continúe cuando las condiciones son adecuadas.",
  },
  {
    day: 2,
    stage: "Organización inicial",
    description:
      "El blastodermo se reorganiza en capas celulares que darán origen a distintos tejidos. Comienzan a distinguirse las regiones que definirán el eje corporal.",
    changes: ["Se diferencian capas embrionarias.", "Comienzan a establecerse regiones del cuerpo."],
    structures: ["Capas germinales", "Línea primitiva"],
    curiosity: "Las capas embrionarias son el punto de partida de muchos tejidos y órganos del ave.",
  },
  {
    day: 3,
    stage: "Primeros órganos",
    description:
      "Se inicia la formación de estructuras como el tubo neural y el corazón. La red vascular extraembrionaria empieza a desarrollarse alrededor del embrión.",
    changes: ["Avanza la formación del sistema nervioso.", "El corazón comienza a organizarse y puede iniciar su actividad."],
    structures: ["Tubo neural", "Corazón temprano", "Vasos vitelinos iniciales"],
    curiosity: "Los vasos que se extienden por el vitelo ayudan a transportar nutrientes al embrión en crecimiento.",
  },
  {
    day: 4,
    stage: "Crecimiento embrionario",
    description:
      "El embrión se curva y su forma se vuelve más reconocible. Continúa la diferenciación de órganos y se amplían las membranas extraembrionarias.",
    changes: ["Se define mejor el eje cabeza-cola.", "Se expande la circulación extraembrionaria."],
    structures: ["Región cefálica", "Amnios", "Red vascular"],
    curiosity: "El amnios forma un entorno líquido protector alrededor del embrión.",
  },
  {
    day: 5,
    stage: "Regiones en desarrollo",
    description:
      "El cuerpo embrionario sigue creciendo y se distinguen con mayor claridad las regiones de la cabeza, el tronco y los primordios de las extremidades.",
    changes: ["Se diferencian regiones de las extremidades.", "Continúa el desarrollo de órganos internos."],
    structures: ["Primordios de alas y patas", "Corazón", "Saco vitelino"],
    curiosity: "Los primordios son estructuras tempranas que después cambian de forma y se especializan.",
  },
  {
    day: 6,
    stage: "Extremidades incipientes",
    description:
      "Las extremidades en formación se hacen más evidentes y sus tejidos comienzan a diferenciarse. El embrión mantiene un ritmo de crecimiento intenso.",
    changes: ["Se alargan los primordios de las extremidades.", "Prosigue la formación del esqueleto y los órganos."],
    structures: ["Yemas de alas y patas", "Membranas extraembrionarias"],
    curiosity: "Aún no hay plumas desarrolladas: primero se organizan los tejidos de la piel y sus futuros apéndices.",
  },
  {
    day: 7,
    stage: "Desarrollo de las extremidades",
    description:
      "Las extremidades continúan diferenciándose y el contorno corporal resulta más definido. El sistema circulatorio extraembrionario sostiene el intercambio con el vitelo.",
    changes: ["Se refinan las formas de alas y patas.", "Siguen madurando varios órganos."],
    structures: ["Extremidades en desarrollo", "Vasos del saco vitelino"],
    curiosity: "El vitelo es la principal reserva nutritiva que el embrión aprovecha durante el desarrollo.",
  },
  {
    day: 8,
    stage: "Diferenciación corporal",
    description:
      "Prosigue la diferenciación de la cabeza, el pico y las extremidades. Los tejidos siguen especializándose mientras el embrión aumenta de tamaño.",
    changes: ["Se hacen más definidos algunos rasgos de la cabeza.", "Avanza la organización de los dedos."],
    structures: ["Cabeza y pico en formación", "Dedos incipientes"],
    curiosity: "Los cambios de forma se solapan: distintos tejidos no maduran todos al mismo ritmo.",
  },
  {
    day: 9,
    stage: "Crecimiento sostenido",
    description:
      "La forma del embrión se define cada vez más y sus extremidades siguen desarrollándose. Las membranas participan cada vez más en el intercambio y la protección.",
    changes: ["Continúa la diferenciación de dedos y articulaciones.", "Se amplían las membranas extraembrionarias."],
    structures: ["Dedos", "Alantoides en expansión", "Amnios"],
    curiosity: "El alantoides participa en el intercambio gaseoso y en el almacenamiento de desechos durante el desarrollo.",
  },
  {
    day: 10,
    stage: "Rasgos más definidos",
    description:
      "La silueta corporal y las extremidades se definen gradualmente. El pico y los dedos continúan su desarrollo, mientras el esqueleto se organiza.",
    changes: ["Avanza la formación del pico.", "Se diferencian estructuras del esqueleto."],
    structures: ["Pico", "Dedos", "Esqueleto en desarrollo"],
    curiosity: "El desarrollo óseo comienza en moldes de tejido que después se transforman y mineralizan.",
  },
  {
    day: 11,
    stage: "Maduración progresiva",
    description:
      "El embrión sigue aumentando de tamaño y los sistemas de órganos continúan madurando. Las patas y el pico adquieren contornos más reconocibles.",
    changes: ["Prosigue la maduración de órganos.", "Se acentúan rasgos de patas y pico."],
    structures: ["Patas", "Pico", "Red vascular extraembrionaria"],
    curiosity: "El desarrollo no es una cuenta atrás uniforme: temperatura, humedad y variación biológica influyen en los tiempos.",
  },
  {
    day: 12,
    stage: "Formación del plumón",
    description:
      "Comienzan a desarrollarse los folículos de las plumas y puede aparecer el plumón. Continúa la maduración del esqueleto y de los órganos.",
    changes: ["Se desarrollan folículos plumosos.", "Prosigue el crecimiento de las extremidades."],
    structures: ["Folículos de plumas", "Esqueleto", "Alantoides"],
    curiosity: "Las plumas se forman a partir de folículos de la piel, no aparecen como una capa instantánea.",
  },
  {
    day: 13,
    stage: "Plumón incipiente",
    description:
      "El plumón puede hacerse más evidente y el embrión ocupa una porción creciente del huevo. El esqueleto continúa su desarrollo.",
    changes: ["Avanza la cobertura de plumón.", "Se endurecen gradualmente algunas estructuras óseas."],
    structures: ["Plumón", "Párpados", "Esqueleto"],
    curiosity: "El aspecto visible depende de la etapa y de las condiciones; el desarrollo no avanza exactamente al mismo ritmo en todos los huevos.",
  },
  {
    day: 14,
    stage: "Preparación gradual",
    description:
      "El embrión sigue creciendo y madurando; las plumas y el pico continúan desarrollándose. La postura dentro del huevo comienza a cobrar importancia para la etapa final.",
    changes: ["Se desarrolla el plumón.", "Continúa la maduración de los sistemas corporales."],
    structures: ["Plumón", "Pico", "Membrana corioalantoidea"],
    curiosity: "La membrana corioalantoidea contribuye al intercambio de gases a través de los poros de la cáscara.",
  },
  {
    day: 15,
    stage: "Crecimiento avanzado",
    description:
      "El embrión ocupa más espacio y se aproxima a la posición típica de eclosión. El vitelo todavía aporta nutrientes y las membranas siguen siendo funcionales.",
    changes: ["Avanza la absorción de nutrientes del vitelo.", "Continúa la maduración pulmonar y muscular."],
    structures: ["Plumón", "Saco vitelino", "Pulmones en desarrollo"],
    curiosity: "El embrión utiliza superficies extraembrionarias para el intercambio gaseoso antes de respirar aire por sí mismo.",
  },
  {
    day: 16,
    stage: "Maduración final",
    description:
      "El embrión continúa preparándose para la vida fuera del huevo, absorbiendo el vitelo y completando cambios funcionales en varios sistemas.",
    changes: ["Prosigue la absorción del vitelo.", "La postura del embrión se ajusta gradualmente."],
    structures: ["Saco vitelino", "Pulmones", "Plumón"],
    curiosity: "El saco vitelino que queda al final se incorpora al cuerpo y aporta reservas al polluelo recién nacido.",
  },
  {
    day: 17,
    stage: "Posición de eclosión",
    description:
      "El embrión suele orientarse para la eclosión y continúa completando su desarrollo. El espacio disponible disminuye a medida que crece.",
    changes: ["Se consolida la orientación dentro del huevo.", "Continúa la absorción de vitelo."],
    structures: ["Pico", "Cámara de aire", "Saco vitelino"],
    curiosity: "La cámara de aire en el extremo ancho del huevo resulta importante en la transición hacia la respiración pulmonar.",
  },
  {
    day: 18,
    stage: "Transición a la respiración",
    description:
      "En condiciones habituales, se acerca el momento de la transición a la respiración pulmonar y el embrión completa su preparación para romper la membrana interna.",
    changes: ["Avanza la preparación respiratoria.", "El vitelo se absorbe hacia el cuerpo."],
    structures: ["Cámara de aire", "Pulmones", "Membranas del huevo"],
    curiosity: "La ovoscopia puede ayudar a observar algunas estructuras, pero su interpretación depende de la experiencia y de las condiciones de observación.",
  },
  {
    day: 19,
    stage: "Inicio del picaje interno",
    description:
      "Cerca del final, el polluelo puede atravesar la membrana interna hacia la cámara de aire y empezar a utilizar sus pulmones. El momento exacto varía.",
    changes: ["Puede iniciarse el picaje interno.", "Continúa la absorción de reservas nutritivas."],
    structures: ["Pico", "Cámara de aire", "Membrana interna"],
    curiosity: "El primer picaje suele dirigirse a la cámara de aire, no directamente al exterior de la cáscara.",
  },
  {
    day: 20,
    stage: "Preparación para la salida",
    description:
      "El polluelo puede comenzar a romper la cáscara desde dentro. La transición respiratoria y la absorción del vitelo acompañan esta fase final.",
    changes: ["Puede comenzar el picaje externo.", "El polluelo se prepara para salir y recuperarse."],
    structures: ["Pico", "Cáscara", "Saco vitelino en absorción"],
    curiosity: "La eclosión puede extenderse durante muchas horas; las diferencias de tiempo no indican por sí solas un problema.",
  },
  {
    day: 21,
    stage: "Eclosión",
    description:
      "Alrededor de este momento muchos polluelos completan la salida del huevo, aunque el tiempo puede variar. Tras eclosionar, necesitan reposo mientras se secan.",
    changes: ["El polluelo puede completar la eclosión.", "Termina la transición hacia la respiración y la vida fuera del huevo."],
    structures: ["Cáscara", "Plumón húmedo que se seca", "Saco vitelino incorporado"],
    curiosity: "Veintiún días es una referencia habitual para la gallina, no un plazo exacto aplicable a cada huevo.",
  },
];

export function getDevelopmentDay(day: number): DevelopmentDay {
  const normalizedDay = Math.min(21, Math.max(1, Math.round(day)));
  return developmentDays[normalizedDay - 1];
}
