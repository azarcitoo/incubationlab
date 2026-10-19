const eggLayerRows = [
  { id: "shell", name: "Cáscara", structure: "Cáscara" },
  { id: "membranes", name: "Membranas", structure: "Membranas del huevo" },
  { id: "albumen", name: "Clara", structure: "Clara o albúmina" },
  { id: "yolk", name: "Yema y saco vitelino", structure: "Vitelo y saco vitelino" },
  { id: "vessels", name: "Vasos sanguíneos", structure: "Vasos vitelinos iniciales" },
  { id: "embryo", name: "Embrión", structure: "Embrión" },
  { id: "extraembryonic", name: "Membranas extraembrionarias", structure: "Membranas extraembrionarias" },
] as const;

export type EggLayerId = typeof eggLayerRows[number]["id"];
type SourceId = "development" | "incubation";

export type StructureDefinition = {
  definition: string;
  role: string;
  development: string;
  source: SourceId;
  viewerLayer?: EggLayerId;
};

export const structureCatalog = {
  "Disco germinal": {
    definition: "Disco de células situado sobre el vitelo; en un huevo fecundado es el lugar donde prosigue el desarrollo del embrión.",
    role: "Sus células se multiplican y organizan los tejidos embrionarios.",
    development: "Etapa inicial de la secuencia educativa.",
    source: "development",
  },
  "Blastodermo temprano": {
    definition: "Conjunto de células que se forma a partir del disco germinal y se organiza sobre el vitelo.",
    role: "Da lugar al embrión y establece regiones celulares que se especializan durante el desarrollo.",
    development: "Etapa inicial; la secuencia celular se extiende durante los primeros días.",
    source: "development",
  },
  "Capas germinales": {
    definition: "Capas embrionarias —ectodermo, mesodermo y endodermo— que se forman durante la gastrulación.",
    role: "Aportan poblaciones celulares que originan distintos tejidos y órganos.",
    development: "Se establecen durante la organización temprana del embrión.",
    source: "development",
  },
  "Línea primitiva": {
    definition: "Engrosamiento transitorio del blastodermo por el que migran células durante la gastrulación.",
    role: "Participa en la formación de capas germinales y en la organización de los ejes corporales.",
    development: "Etapa embrionaria temprana.",
    source: "development",
  },
  "Tubo neural": {
    definition: "Estructura embrionaria que se forma al cerrarse el tejido neural.",
    role: "Da origen al encéfalo y a la médula espinal, componentes del sistema nervioso central.",
    development: "Su formación comienza durante las primeras etapas embrionarias.",
    source: "development",
  },
  "Corazón temprano": {
    definition: "Primordio cardíaco que se organiza y adquiere actividad durante el desarrollo inicial.",
    role: "Impulsa la circulación embrionaria, que distribuye sangre y sustancias por el cuerpo en desarrollo.",
    development: "Comienza a organizarse en una etapa temprana; el ritmo puede variar.",
    source: "development",
  },
  "Vasos vitelinos iniciales": {
    definition: "Primeros vasos extraembrionarios que se extienden por la superficie vascularizada del vitelo.",
    role: "Participan en el transporte de nutrientes entre el vitelo y el embrión.",
    development: "Aparecen durante el desarrollo temprano y la red se amplía después.",
    source: "development",
    viewerLayer: "vessels",
  },
  "Región cefálica": {
    definition: "Parte anterior del embrión en la que se organizan estructuras de la cabeza.",
    role: "Incluye regiones que contribuirán al encéfalo, los órganos sensoriales y la cara.",
    development: "Se diferencia en las primeras etapas y cambia a medida que crece el embrión.",
    source: "development",
    viewerLayer: "embryo",
  },
  "Amnios": {
    definition: "Membrana extraembrionaria que rodea al embrión y delimita la cavidad amniótica.",
    role: "El líquido de la cavidad amortigua el movimiento y evita que el embrión quede adherido a las membranas circundantes.",
    development: "Se forma durante el desarrollo temprano y lo envuelve mientras crece.",
    source: "development",
    viewerLayer: "extraembryonic",
  },
  "Red vascular": {
    definition: "Conjunto de vasos sanguíneos que se ramifican en tejidos embrionarios y extraembrionarios.",
    role: "Conduce sangre y permite el transporte de gases y nutrientes según el tejido y la etapa.",
    development: "Se expande durante el desarrollo; la ilustración del proyecto es esquemática.",
    source: "development",
    viewerLayer: "vessels",
  },
  "Primordios de alas y patas": {
    definition: "Yemas embrionarias de las extremidades, formadas por tejido en crecimiento.",
    role: "Se diferencian en las estructuras de las alas y las patas.",
    development: "Se hacen visibles durante la primera parte de la secuencia embrionaria.",
    source: "development",
    viewerLayer: "embryo",
  },
  "Corazón": {
    definition: "Órgano muscular que impulsa la sangre a través de la circulación.",
    role: "Sostiene el transporte de gases y nutrientes en el embrión en crecimiento.",
    development: "Se organiza tempranamente y continúa madurando durante la incubación.",
    source: "development",
  },
  "Saco vitelino": {
    definition: "Membrana extraembrionaria asociada al vitelo y a vasos que lo conectan con el embrión.",
    role: "Participa en la movilización y el transporte de nutrientes desde la reserva del huevo.",
    development: "Es relevante durante el crecimiento y sus reservas se absorben hacia el final.",
    source: "development",
    viewerLayer: "yolk",
  },
  "Yemas de alas y patas": {
    definition: "Regiones abultadas de tejido embrionario que son los primordios de las extremidades.",
    role: "Se alargan y diferencian para formar alas y patas.",
    development: "Corresponden a una fase temprana de la formación de las extremidades.",
    source: "development",
    viewerLayer: "embryo",
  },
  "Membranas extraembrionarias": {
    definition: "Membranas asociadas al embrión —entre ellas el amnios, el corion, el alantoides y el saco vitelino— que no forman parte de su cuerpo.",
    role: "Contribuyen a la protección, al intercambio con el entorno del huevo y al aprovechamiento de reservas.",
    development: "Se forman y expanden en distintas fases de la incubación.",
    source: "development",
    viewerLayer: "extraembryonic",
  },
  "Extremidades en desarrollo": {
    definition: "Alas y patas embrionarias que se diferencian a partir de sus primordios.",
    role: "Forman los apéndices locomotores y de soporte del ave.",
    development: "Cambian de forma progresivamente durante la primera mitad del desarrollo.",
    source: "development",
    viewerLayer: "embryo",
  },
  "Vasos del saco vitelino": {
    definition: "Red de vasos que recorre la membrana del saco vitelino y se conecta con la circulación embrionaria.",
    role: "Transporta sustancias entre el vitelo y el embrión.",
    development: "La red crece con el saco vitelino y cambia conforme avanzan el desarrollo y la absorción de reservas.",
    source: "development",
    viewerLayer: "vessels",
  },
  "Cabeza y pico en formación": {
    definition: "Región cefálica embrionaria donde se organizan las estructuras faciales, incluido el primordio del pico.",
    role: "El pico adquiere funciones relacionadas con la alimentación tras la eclosión y participa en el picaje al final de la incubación.",
    development: "Los rasgos cefálicos se diferencian gradualmente; no aparecen todos a la vez.",
    source: "development",
    viewerLayer: "embryo",
  },
  "Dedos incipientes": {
    definition: "Regiones digitales que empiezan a distinguirse en los extremos de las extremidades.",
    role: "Se diferencian para formar los dedos de las alas y las patas.",
    development: "Se organizan a medida que las extremidades se remodelan.",
    source: "development",
    viewerLayer: "embryo",
  },
  "Dedos": {
    definition: "Elementos digitales de las extremidades del ave, con formas distintas en alas y patas.",
    role: "Contribuyen a la estructura funcional de cada extremidad; los dedos del pie ayudan al apoyo y agarre.",
    development: "Se distinguen conforme maduran alas y patas.",
    source: "development",
    viewerLayer: "embryo",
  },
  "Alantoides en expansión": {
    definition: "Membrana extraembrionaria que crece desde el intestino posterior del embrión.",
    role: "Participa en el intercambio gaseoso y en la acumulación de productos de desecho; al fusionarse con el corion forma la membrana corioalantoidea.",
    development: "Se expande durante la incubación y se relaciona con la membrana corioalantoidea.",
    source: "development",
    viewerLayer: "extraembryonic",
  },
  "Pico": {
    definition: "Estructura córnea de la boca del ave, formada durante el desarrollo embrionario.",
    role: "Sirve para alimentarse después de la eclosión; cerca de esta, el polluelo lo utiliza para romper membranas y cáscara.",
    development: "Se diferencia progresivamente y participa en el picaje al final de la incubación.",
    source: "development",
    viewerLayer: "embryo",
  },
  "Esqueleto en desarrollo": {
    definition: "Conjunto de estructuras esqueléticas embrionarias en proceso de diferenciación y osificación.",
    role: "Proporciona soporte y protección, y sirve de anclaje al sistema muscular.",
    development: "Se organiza y madura progresivamente durante la incubación.",
    source: "development",
    viewerLayer: "embryo",
  },
  "Patas": {
    definition: "Extremidades posteriores del ave, formadas por segmentos, articulaciones y dedos.",
    role: "Permiten sostener el cuerpo y desplazarse después de la eclosión.",
    development: "Se diferencian desde primordios y adquieren forma gradualmente.",
    source: "development",
    viewerLayer: "embryo",
  },
  "Red vascular extraembrionaria": {
    definition: "Vasos sanguíneos que se desarrollan en las membranas extraembrionarias, como el saco vitelino y la membrana corioalantoidea.",
    role: "Contribuyen al transporte de nutrientes y al intercambio gaseoso en las membranas vascularizadas.",
    development: "Se extiende conforme se expanden las membranas; la red visible en el modelo es esquemática.",
    source: "development",
    viewerLayer: "vessels",
  },
  "Folículos de plumas": {
    definition: "Invaginaciones y estructuras especializadas de la piel donde se forman las plumas.",
    role: "Producen plumas, que cumplen funciones de aislamiento, protección y cobertura.",
    development: "Se forman antes de que el plumaje sea plenamente visible.",
    source: "development",
  },
  "Esqueleto": {
    definition: "Armazón de huesos y cartílagos que sostiene y protege el cuerpo.",
    role: "Da soporte al cuerpo y permite el movimiento junto con músculos y articulaciones.",
    development: "Se diferencia y madura durante el desarrollo embrionario.",
    source: "development",
    viewerLayer: "embryo",
  },
  "Alantoides": {
    definition: "Membrana extraembrionaria derivada del intestino posterior del embrión.",
    role: "Participa en el intercambio gaseoso y en el almacenamiento de desechos; contribuye a formar la membrana corioalantoidea.",
    development: "Crece durante la incubación y se asocia con el corion.",
    source: "development",
    viewerLayer: "extraembryonic",
  },
  "Plumón": {
    definition: "Plumas suaves que forman parte del plumaje juvenil y cubren al polluelo al nacer.",
    role: "Ayuda al aislamiento térmico después de la eclosión; no es un órgano respiratorio.",
    development: "Los folículos y las plumas se desarrollan antes de la eclosión; el grado de cobertura varía.",
    source: "development",
    viewerLayer: "embryo",
  },
  "Párpados": {
    definition: "Pliegues de piel que cubren y protegen los ojos.",
    role: "Protegen la superficie ocular; los párpados se desarrollan y permanecen cerrados durante parte de la incubación.",
    development: "Se forman durante el desarrollo facial y cambian hacia las etapas finales.",
    source: "development",
    viewerLayer: "embryo",
  },
  "Membrana corioalantoidea": {
    definition: "Membrana extraembrionaria formada por la asociación del corion con el alantoides y provista de vasos.",
    role: "Contribuye al intercambio de oxígeno y dióxido de carbono a través de los poros de la cáscara.",
    development: "Se expande durante la incubación y participa en el intercambio gaseoso antes de la eclosión.",
    source: "development",
    viewerLayer: "extraembryonic",
  },
  "Pulmones en desarrollo": {
    definition: "Órganos respiratorios que se forman dentro del embrión; su desarrollo comienza antes de que se utilicen para ventilar aire.",
    role: "Tras la transición respiratoria previa a la eclosión, los pulmones realizan el intercambio gaseoso propio del ave.",
    development: "Se desarrollan durante la incubación; la respiración pulmonar funcional comienza alrededor del picaje interno y la entrada a la cámara de aire.",
    source: "development",
    viewerLayer: "embryo",
  },
  "Pulmones": {
    definition: "Órganos respiratorios del ave, conectados con los sacos aéreos y especializados en el intercambio de gases.",
    role: "Antes de que el polluelo acceda a la cámara de aire, el intercambio gaseoso del embrión depende principalmente de la membrana corioalantoidea; al picar internamente empieza la transición a la respiración pulmonar. Después de eclosionar, los pulmones realizan la respiración aérea.",
    development: "Son relevantes en la transición respiratoria previa a la eclosión y durante la vida posterior.",
    source: "development",
    viewerLayer: "embryo",
  },
  "Cámara de aire": {
    definition: "Espacio que se forma entre las membranas de la cáscara en el extremo ancho del huevo.",
    role: "Recibe el pico durante el picaje interno y proporciona el primer espacio con aire que utiliza el polluelo antes de romper la cáscara.",
    development: "Su tamaño cambia durante la incubación por pérdida de agua; resulta especialmente relevante al final.",
    source: "incubation",
    viewerLayer: "membranes",
  },
  "Membranas del huevo": {
    definition: "Membranas testáceas situadas justo bajo la cáscara; en el extremo ancho se separan para delimitar la cámara de aire.",
    role: "Forman barreras protectoras y participan en el intercambio de gases y agua a través del huevo.",
    development: "Están presentes desde el inicio y adquieren relevancia en la formación de la cámara de aire y el picaje.",
    source: "incubation",
    viewerLayer: "membranes",
  },
  "Membrana interna": {
    definition: "La más interna de las membranas testáceas, en contacto con el contenido del huevo.",
    role: "Actúa como barrera; el polluelo puede atravesarla para acceder a la cámara de aire antes del picaje externo.",
    development: "Protege el contenido desde el inicio y participa en la secuencia de eclosión.",
    source: "incubation",
    viewerLayer: "membranes",
  },
  "Cáscara": {
    definition: "Cubierta mineral porosa del huevo, compuesta principalmente por carbonato de calcio y asociada a membranas testáceas.",
    role: "Protege el contenido y permite el intercambio de gases y vapor de agua por sus poros.",
    development: "Rodea al embrión durante toda la incubación; se rompe durante la eclosión.",
    source: "incubation",
    viewerLayer: "shell",
  },
  "Plumón húmedo que se seca": {
    definition: "Plumaje suave del polluelo recién salido, que está húmedo y se seca tras la eclosión.",
    role: "Contribuye al aislamiento térmico una vez seco.",
    development: "Visible al nacer; su secado ocurre después de salir del huevo.",
    source: "development",
    viewerLayer: "embryo",
  },
  "Saco vitelino en absorción": {
    definition: "Saco vitelino cuyas reservas nutritivas restantes son incorporadas al cuerpo del embrión hacia el final de la incubación.",
    role: "Aporta nutrientes que sostienen la transición entre la vida dentro del huevo y los primeros momentos tras la eclosión.",
    development: "Su absorción se intensifica en la fase final, antes de que el polluelo salga.",
    source: "development",
    viewerLayer: "yolk",
  },
  "Saco vitelino incorporado": {
    definition: "Reserva residual del vitelo que el polluelo ha incorporado al cuerpo antes o durante la eclosión.",
    role: "Proporciona nutrientes disponibles durante la transición inicial fuera del huevo.",
    development: "Corresponde a la etapa final y no debe interpretarse como una estructura externa al polluelo recién nacido.",
    source: "development",
    viewerLayer: "yolk",
  },
  "Clara o albúmina": {
    definition: "Albúmina, el material acuoso rico en proteínas que rodea la yema.",
    role: "Amortigua y aporta agua y proteínas al embrión en desarrollo.",
    development: "Rodea la yema durante la incubación; su contenido se reduce a medida que el embrión utiliza recursos.",
    source: "incubation",
    viewerLayer: "albumen",
  },
  "Vitelo y saco vitelino": {
    definition: "El vitelo es la reserva nutritiva del huevo; el saco vitelino es la membrana vascularizada que lo rodea y se conecta con el embrión.",
    role: "El embrión utiliza el vitelo como fuente de nutrientes, que se transportan mediante la circulación asociada al saco vitelino.",
    development: "Es una fuente principal de nutrientes durante el crecimiento y se absorbe progresivamente cerca de la eclosión.",
    source: "development",
    viewerLayer: "yolk",
  },
  "Vasos sanguíneos": {
    definition: "Conductos de la circulación que transportan sangre; en el huevo algunos se extienden por membranas extraembrionarias.",
    role: "Participan en el transporte de gases y nutrientes entre el embrión y las superficies vascularizadas.",
    development: "La red extraembrionaria se desarrolla y cambia durante la incubación.",
    source: "development",
    viewerLayer: "vessels",
  },
  "Embrión": {
    definition: "Ave en desarrollo dentro del huevo, desde las primeras etapas tras la fecundación hasta la eclosión.",
    role: "Forma progresivamente los tejidos, órganos y sistemas que permitirán la vida del polluelo.",
    development: "Se transforma durante toda la incubación; las fichas describen una secuencia educativa orientativa.",
    source: "development",
    viewerLayer: "embryo",
  },
} as const satisfies Record<string, StructureDefinition>;

export type DevelopmentStructure = keyof typeof structureCatalog;

export function getStructureDefinition(
  structure: DevelopmentStructure,
): StructureDefinition {
  return structureCatalog[structure];
}

const sourceInfo = {
  development: {
    label: "UNSW Embryology",
    href: "https://embryology.med.unsw.edu.au/embryology/index.php/Chicken_Development",
  },
  incubation: {
    label: "Mississippi State University Extension",
    href: "https://extension.msstate.edu/publications/hatching-quality-chicks",
  },
} satisfies Record<SourceId, { label: string; href: string }>;

export const eggLayerInfo = eggLayerRows.map((layer) => ({
  ...layer,
  description: structureCatalog[layer.structure].definition,
}));

export function getStructureSource(source: SourceId) {
  return sourceInfo[source];
}
